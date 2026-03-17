# Auth Service

The **Auth Service** is responsible for authentication, authorization, and user management within the clinic management system.

It handles user registration, login, token management, RBAC (Role Based Access Control), password reset, and admin account provisioning.

---

# Features

- User Registration
- Login with JWT Authentication
- Refresh Token Support
- Logout with Token Revocation
- Role Based Access Control (RBAC)
- Permission Based Authorization
- Admin Account Creation
- Doctor Account Creation
- Forgot Password via OTP
- Password Reset using Redis OTP
- Email Notifications using Nodemailer
- Swagger API Documentation

---

# Tech Stack

- Node.js
- Express
- TypeScript
- PostgreSQL
- Sequelize ORM
- Redis
- JWT Authentication
- Zod Validation
- Nodemailer
- Swagger

---

# Port

```
Auth Service runs on port: 4001
```

---

# Main Modules

### Authentication

- Register new users
- Login users
- Generate JWT access tokens
- Generate refresh tokens
- Token refresh endpoint

### RBAC

- Roles: admin, doctor, patient
- Permission based access control
- Middleware authorization

### Admin Operations

Admin users can create:

- Doctor accounts
- Admin accounts

### Password Recovery

- Forgot password via OTP
- OTP stored in Redis
- Email delivery using Gmail SMTP

---

# API Endpoints

### Auth

POST `/api/auth/register`
POST `/api/auth/login`
POST `/api/auth/refresh`
POST `/api/auth/logout`
GET `/api/auth/me`

---

### Password Recovery

POST `/api/auth/forgot-password`
POST `/api/auth/reset-password`

---

### Admin Management

POST `/api/admin/create-doctor`
POST `/api/admin/create-admin`

---

# Authentication Flow

1. User registers
2. Password is hashed using bcrypt
3. Role assigned (default: patient)
4. Login generates:
   - Access Token (15 minutes)
   - Refresh Token (7 days)

5. Refresh token stored in Redis
6. Cookies used for authentication

---

# Security

- Password hashing with bcrypt
- Refresh token stored in Redis
- HTTP-only cookies
- Role and permission middleware
- Token invalidation on logout

---

# Environment Variables

```
PORT=4001
JWT_SECRET=
JWT_REFRESH_SECRET=
DB_HOST=
DB_USER=
DB_PASS=
DB_NAME=
REDIS_HOST=
REDIS_PORT=
MAIL_USER=
MAIL_PASS=
```

---

# Swagger Documentation

```
/api-docs
```

Includes API documentation for:

- Auth Service
- Patient Service
- Appointment Service

---

# Folder Structure

```
src
 ├── controllers
 ├── services
 ├── repositories
 ├── models
 ├── routes
 ├── middleware
 ├── validators
 ├── utils
 └── config
```

---

# Purpose in System

The Auth Service acts as the **central identity provider** for all microservices in the clinic management platform.
