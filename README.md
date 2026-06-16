# User Profile CRUDS App

Full-stack user management module built with Spring Boot, MySQL, React, TailwindCSS, Axios, and React Router.

## Features

- Create, read, update, delete, and search users.
- Upload a required profile image when creating a user.
- Replace a profile image while updating a user.
- Delete the stored profile image file when the user is deleted.
- Hash passwords with BCrypt before saving them.
- Validate required user fields and prevent duplicate usernames and emails.
- Return JSON API responses with global exception handling.

## Database Setup

Create a MySQL database named `user_db`. Spring Boot is configured with `createDatabaseIfNotExist=true`, but creating it manually is also fine.

```sql
CREATE DATABASE IF NOT EXISTS user_db;
USE user_db;

CREATE TABLE users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,

    first_name VARCHAR(100) NOT NULL,
    middle_name VARCHAR(100) NULL,
    last_name VARCHAR(100) NOT NULL,

    username VARCHAR(100) NOT NULL UNIQUE,
    email VARCHAR(150) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,

    phone_number VARCHAR(20) NULL,
    gender VARCHAR(20) NULL,
    birth_date DATE NULL,
    address TEXT NULL,

    role VARCHAR(50) DEFAULT 'user',
    profile_image_url VARCHAR(255) NULL,

    status VARCHAR(50) DEFAULT 'active',
    email_verified_at TIMESTAMP NULL,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

Update `backend/src/main/resources/application.properties` if your MySQL username or password is different.

## Backend Run Instructions

```bash
cd backend
mvn spring-boot:run
```

The API runs on `http://localhost:8080`.

## Frontend Run Instructions

```bash
cd frontend
npm install
npm run dev
```

The frontend runs on `http://localhost:5173`.

If your backend is on a different host, create `frontend/.env`:

```env
VITE_API_ORIGIN=http://localhost:8080
```

## API Endpoints

| Method | Endpoint | Description |
| --- | --- | --- |
| `POST` | `/api/users` | Create a user with multipart profile image upload |
| `GET` | `/api/users` | List all users |
| `GET` | `/api/users/{id}` | Get one user by ID |
| `PUT` | `/api/users/{id}` | Update a user and optionally replace profile image |
| `DELETE` | `/api/users/{id}` | Delete a user and profile image |
| `GET` | `/api/users/search?keyword=value` | Search by first name, last name, username, email, phone, role, or status |

## Sample Create Request

Use `multipart/form-data`.

```bash
curl -X POST http://localhost:8080/api/users \
  -F "first_name=Maria" \
  -F "middle_name=Santos" \
  -F "last_name=Reyes" \
  -F "username=mreyes" \
  -F "email=maria@example.com" \
  -F "password=secret123" \
  -F "phone_number=09171234567" \
  -F "gender=female" \
  -F "birth_date=2000-06-16" \
  -F "address=San Fernando, La Union" \
  -F "role=user" \
  -F "status=active" \
  -F "profile_image=@C:/path/to/profile.jpg"
```

## Sample Response

```json
{
  "success": true,
  "message": "User created successfully.",
  "data": {
    "id": 1,
    "first_name": "Maria",
    "middle_name": "Santos",
    "last_name": "Reyes",
    "username": "mreyes",
    "email": "maria@example.com",
    "phone_number": "09171234567",
    "gender": "female",
    "birth_date": "2000-06-16",
    "address": "San Fernando, La Union",
    "role": "user",
    "profile_image_url": "/uploads/profile_images/8b6f1d4c-3dc6-4674-9b50-75dc2bcdf7f9.jpg",
    "status": "active",
    "email_verified_at": null,
    "created_at": "2026-06-16T10:30:00",
    "updated_at": "2026-06-16T10:30:00"
  }
}
```

## Profile Image Storage

The uploaded image file is stored inside:

```text
backend/src/main/resources/static/uploads/profile_images/
```

The database stores only the public path:

```text
/uploads/profile_images/filename.jpg
```

Spring Boot serves files from `src/main/resources/static`, so the frontend can display the image using:

```text
http://localhost:8080/uploads/profile_images/filename.jpg
```

This keeps the actual binary image file out of the MySQL `users` table.
