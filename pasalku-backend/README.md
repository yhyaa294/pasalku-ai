# Pasalku Backend

## Overview
Pasalku is a legal consultation platform designed to assist users in navigating legal issues through an AI-driven interface. The backend is built using FastAPI and integrates with multiple databases to provide a robust and scalable solution.

## Project Structure
The project is organized into several key directories and files:

- **backend/**: Contains the main application code.
  - **server.py**: Entry point for the FastAPI application.
  - **core/**: Configuration settings for the application.
  - **database/**: Database connection logic for various databases (PostgreSQL, MongoDB, Supabase, Turso, EdgeDB).
  - **models/**: Defines the data models used in the application (User, Consultation, Chat).
  - **routers/**: Contains the API routes for different functionalities (authentication, user management, chat, consultations, payments, analytics).

- **alembic/**: Contains migration scripts and configuration for database migrations.
- **.env.example**: Example environment variables needed for the application.
- **requirements.txt**: Lists the dependencies required for the project.

## Setup Instructions

1. **Clone the Repository**
   ```bash
   git clone <repository-url>
   cd pasalku-backend
   ```

2. **Create a Virtual Environment**
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows use `venv\Scripts\activate`
   ```

3. **Install Dependencies**
   ```bash
   pip install -r requirements.txt
   ```

4. **Set Up Environment Variables**
   Copy the `.env.example` file to `.env` and fill in the required variables.

5. **Initialize the Database**
   Run the database initialization script to create the necessary tables.
   ```bash
   python -m backend.database.init_db
   ```

6. **Run the Application**
   Start the FastAPI server.
   ```bash
   uvicorn backend.server:app --reload
   ```

## Usage
Once the server is running, you can access the API documentation at `/api/docs` to explore the available endpoints and their usage.

## Contributing
Contributions are welcome! Please submit a pull request or open an issue for any enhancements or bug fixes.

## License
This project is licensed under the MIT License. See the LICENSE file for more details.