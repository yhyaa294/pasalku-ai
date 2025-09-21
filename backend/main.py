"""
File utama untuk menjalankan aplikasi FastAPI.
"""
import uvicorn

if __name__ == "__main__":
    import os
    port = int(os.getenv("PORT", 8000))
    uvicorn.run("app:app", host="0.0.0.0", port=port, reload=True)


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


def decode_token(token: str) -> Optional[schemas.TokenData]:
    """
    Decode JWT token and return token data.
    """
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        email: str = payload.get("sub")
        if email is None:
            return None
        return schemas.TokenData(email=email)
    except JWTError:
        return None

async def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    """
    Get current authenticated user from JWT token.
    """
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    token_data = decode_token(token)
    if token_data is None:
        raise credentials_exception
    user = crud.get_user_by_email(db, email=token_data.email)
    if user is None:
        raise credentials_exception
    return user

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
        # Validate input
        if not request.query or len(request.query.strip()) < 10:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Query must be at least 10 characters long"
            )

        # Get AI response from BytePlus
        response = await byteplus_service.get_legal_response(request.query)
        return response
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error in chat endpoint: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="AI service temporarily unavailable. Please try again later."
        )


@app.post("/create-checkout-session", tags=["Billing"])
async def create_checkout_session_endpoint(current_user: models.User = Depends(get_current_user)):
    
    try:
        checkout_session = stripe_service.create_checkout_session(
            user_email=current_user.email,
            price_id=settings.STRIPE_PRICE_ID
        )
        return {"checkout_url": checkout_session.url}
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error creating checkout session: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to create checkout session. Please try again."
        )


@app.get("/test-byteplus", tags=["AI Test"])
async def test_byteplus_connection():
    """Test BytePlus API connection"""
    try:
        is_connected = byteplus_service.test_connection()
        if is_connected:
            return {"status": "success", "message": "BytePlus API connection successful"}
        else:
            return {"status": "error", "message": "BytePlus API connection failed"}
    except Exception as e:
        return {"status": "error", "message": f"BytePlus API error: {str(e)}"}
