from fastapi import FastAPI, Depends, HTTPException, status
from sqlalchemy.orm import Session

from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from jose import JWTError

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="login")

from . import crud, models, schemas
from .core import security
from .services import ai_agent
from .database import engine, get_db

# This line creates the database tables if they don't exist
models.Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Pasalku.ai Backend",
    description="API for Pasalku.ai, providing legal information through an AI agent.",
    version="1.0.0",
)


@app.post("/register", response_model=schemas.User, status_code=status.HTTP_201_CREATED, tags=["Authentication"])
def create_user_endpoint(user: schemas.UserCreate, db: Session = Depends(get_db)):
    """
    Endpoint to register a new user.
    - Checks if the email is already registered.
    - Creates a new user in the database.
    """
    db_user = crud.get_user_by_email(db, email=user.email)
    if db_user:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Email already registered")
    return crud.create_user(db=db, user=user)


@app.post("/login", response_model=schemas.Token, tags=["Authentication"])
def login_for_access_token(db: Session = Depends(get_db), form_data: OAuth2PasswordRequestForm = Depends()):
    """
    Endpoint for user login. 
    - Authenticates the user.
    - Returns a JWT access token.
    """
    user = crud.get_user_by_email(db, email=form_data.username)
    if not user or not security.verify_password(form_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token = security.create_access_token(subject=user.email)
    return {"access_token": access_token, "token_type": "bearer"}


async def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, security.SECRET_KEY, algorithms=[security.ALGORITHM])
        email: str = payload.get("sub")
        if email is None:
            raise credentials_exception
        token_data = schemas.TokenData(email=email)
    except JWTError:
        raise credentials_exception
    user = crud.get_user_by_email(db, email=token_data.email)
    if user is None:
        raise credentials_exception
    return user


@app.get("/users/me", response_model=schemas.User, tags=["Users"])
async def read_users_me(current_user: models.User = Depends(get_current_user)):
    """Fetch the current logged in user's data."""
    return current_user


@app.post("/chat", response_model=schemas.ChatResponse, tags=["AI Chat"])
async def chat_with_ai(
    request: schemas.ChatRequest, 
    current_user: models.User = Depends(get_current_user)
):
    """
    Main endpoint for AI consultation.
    - Requires authentication.
    - Takes a user query and returns a structured AI response.
    """
    try:
        response = ai_agent.get_ai_response(request.query)
        return response
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_503_SERVICE_UNAVAILABLE, detail=str(e))


@app.get("/", tags=["Root"])
async def read_root():
    """A simple endpoint to check if the API is running."""
    return {"message": "Welcome to Pasalku.ai Backend!"}
