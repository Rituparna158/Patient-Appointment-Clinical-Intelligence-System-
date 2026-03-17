# Patient Service

The **Patient Service** manages patient profiles within the clinic management system.

It allows patients to create, update, and delete their profile information while allowing administrators to search patient records.

---

# Features

- Patient profile creation
- Patient profile update
- Patient profile retrieval
- Soft delete patient profile
- Admin patient search
- Pagination support
- Search by name or email
- Zod validation
- Role based access control

---

# Tech Stack

- Node.js
- Express
- TypeScript
- PostgreSQL
- Sequelize ORM
- Zod Validation

---

# Port

```
Patient Service runs on port: 4002
```

---

# Core Functionalities

### Patient Profile

Patients can:

- Create their profile
- View their profile
- Update their profile
- Delete their profile

Profiles include:

- Address
- Emergency contact

---

### Admin Patient Search

Admins can search patients using:

- Name
- Email

Supports:

- Pagination
- Filtering

---

# API Endpoints

### Patient Profile

POST `/api/patient/profile`
GET `/api/patient/me`
PUT `/api/patient/me`
DELETE `/api/patient/me`

---

### Admin Search

GET `/api/patient`

Query Parameters:

```
search
page
limit
```

---

# Authentication

All endpoints require authentication using JWT tokens.

Authorization middleware ensures only:

- Patients manage their own profiles
- Admins can search patients

---

# Folder Structure

```
src
 ├── controllers
 ├── services
 ├── repositories
 ├── models
 ├── routes
 ├── validators
 ├── middleware
 ├── utils
```

---

# Database

Table:

```
patients
```

Fields:

- id
- userId
- address
- emergencyContact
- isActive
- createdAt
- updatedAt

---

# Purpose in System

The Patient Service manages all patient related data and profile operations for the clinic platform.
