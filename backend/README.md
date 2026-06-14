# Backend Project Structure

## Installation

1. Create a Python virtual environment:
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

2. Install dependencies:
```bash
pip install -r requirements.txt
```

3. Create `.env` file with your configuration:
```
DATABASE_URL=postgresql://user:password@localhost:5432/task_manager
SECRET_KEY=your-secret-key-change-this-in-production
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
FRONTEND_URL=http://localhost:5173
```

## Running the API

```bash
python run.py
```

The API will be available at `http://localhost:8000`
- Interactive docs: `http://localhost:8000/docs`
- OpenAPI schema: `http://localhost:8000/openapi.json`

## Database Setup

### PostgreSQL Installation

**Windows:**
1. Download PostgreSQL from https://www.postgresql.org/download/windows/
2. Install with default options
3. Remember the password for the `postgres` user

**macOS:**
```bash
brew install postgresql
brew services start postgresql
```

**Linux:**
```bash
sudo apt-get install postgresql postgresql-contrib
sudo systemctl start postgresql
```

### Creating Database

```bash
# Connect to PostgreSQL
psql -U postgres

# Create database
CREATE DATABASE task_manager;

# Create user (optional, for better security)
CREATE USER task_user WITH PASSWORD 'your_password';
ALTER ROLE task_user SET client_encoding TO 'utf8';
ALTER ROLE task_user SET default_transaction_isolation TO 'read committed';
ALTER ROLE task_user SET default_transaction_deferrable TO on;
ALTER ROLE task_user SET default_transaction_deferrable TO on;
GRANT ALL PRIVILEGES ON DATABASE task_manager TO task_user;

# Exit
\q
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login and get token
- `GET /api/auth/me` - Get current user

### Tasks
- `GET /api/tasks` - List all tasks (with filters)
- `GET /api/tasks/{id}` - Get single task
- `POST /api/tasks` - Create task
- `PUT /api/tasks/{id}` - Update task
- `DELETE /api/tasks/{id}` - Delete task

### Users
- `GET /api/users` - List all users (admin only)
- `GET /api/users/{id}` - Get user info
- `GET /api/users/notifications/me` - Get my notifications
- `PUT /api/users/notifications/{id}/read` - Mark notification as read

## Environment Variables

- `DATABASE_URL` - PostgreSQL connection string
- `SECRET_KEY` - JWT secret key
- `ALGORITHM` - JWT algorithm (HS256)
- `ACCESS_TOKEN_EXPIRE_MINUTES` - Token expiration time
- `FRONTEND_URL` - Frontend URL for CORS
