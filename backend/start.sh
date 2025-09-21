#!/bin/bash

# Install dependencies
pip install -r requirements.txt

# Jalankan migrasi database (jika diperlukan)
alembic upgrade head

# Jalankan aplikasi
exec gunicorn main:app --workers 4 --worker-class uvicorn.workers.UvicornWorker --bind 0.0.0.0:${PORT:-8000}
