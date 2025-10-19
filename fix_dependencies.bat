@echo off
echo Installing missing dependencies...
cd backend
if exist venv\Scripts\activate.bat (
    call venv\Scripts\activate.bat
) else (
    echo Creating virtual environment...
    python -m venv venv
    call venv\Scripts\activate.bat
)

echo Installing psycopg2-binary...
pip install psycopg2-binary

echo Installing email-validator...
pip install email-validator

echo Installing python-multipart...
pip install python-multipart

echo Installing SQLAlchemy postgres dialect...
pip install sqlalchemy[postgresql]

echo All dependencies installed!
pause
