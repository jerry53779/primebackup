# Django Backend Setup Instructions

## Prerequisites
- Python 3.9+
- pip

## Installation & Setup

### 1. Create Virtual Environment
```bash
cd backend
python -m venv venv

# On Windows:
venv\Scripts\activate

# On macOS/Linux:
source venv/bin/activate
```

### 2. Install Dependencies
```bash
pip install -r requirements.txt
```

### 3. Create Superuser (Admin)
```bash
python manage.py createsuperuser
```

### 4. Run Migrations
```bash
python manage.py migrate
```

### 5. Run Development Server
```bash
python manage.py runserver
```

The backend will be available at `http://localhost:8000/`

### API Endpoints

**Authentication:**
- `POST /api/token/` - Obtain JWT token
- `POST /api/token/refresh/` - Refresh JWT token

**Users:**
- `GET /api/users/` - List all users
- `GET /api/users/{id}/` - Get specific user
- `GET /api/users/me/` - Get current user

**User Profiles:**
- `GET /api/profiles/` - List all profiles
- `GET /api/profiles/{id}/` - Get specific profile
- `GET /api/profiles/me/` - Get current user's profile

**Projects:**
- `GET /api/projects/` - List all projects
- `GET /api/projects/{id}/` - Get specific project
- `POST /api/projects/` - Create new project (authenticated)
- `PUT /api/projects/{id}/` - Update project (owner only)
- `GET /api/projects/my_projects/` - Get current user's projects
- `GET /api/projects/public/` - Get all public projects
- `POST /api/projects/{id}/request_access/` - Request access to project
- `POST /api/projects/{id}/approve_access/` - Approve access request (owner only)
- `POST /api/projects/{id}/reject_access/` - Reject access request (owner only)

**Access Requests:**
- `GET /api/access-requests/` - List access requests
- `GET /api/access-requests/my_requests/` - Get current user's requests
- `GET /api/access-requests/received_requests/` - Get requests for user's projects

**Team Members:**
- `GET /api/team-members/` - List all team members
- `POST /api/team-members/` - Create team member
