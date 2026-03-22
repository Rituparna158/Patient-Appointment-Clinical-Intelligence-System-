# Clinic Management System – Microservices Platform

A **full-stack clinic management system** built with a **microservices architecture**.
The platform allows patients to book appointments, doctors to manage consultations, and administrators to manage clinic operations.

The system is designed with **scalability, modularity, and production-style backend practices** in mind.

# 🧭 Project Overview

This project is composed of multiple **backend microservices**, a **React frontend**, and supporting infrastructure like **PostgreSQL, Redis, and worker queues**.

Key capabilities include:

- Authentication with JWT + refresh tokens
- Role-based access control (RBAC)
- Patient profile management
- Doctor appointment booking
- Consultation and clinical records
- Background workers for notifications and reminders
- API documentation via Swagger
- Docker-based local development

The architecture separates responsibilities across services so each component can evolve independently.

# 📁 Project Structure

```
clinic-system
│
├── docker-compose.yml
├── README.md
│
├── services
│
│ ├── auth-service
│ │ ├── src
│ │ ├── package.json
│ │ ├── .env
│ │ └── .env.example
│ │
│ ├── patient-service
│ │ ├── src
│ │ ├── package.json
│ │ ├── .env
│ │ └── .env.example
│ │
│ ├── appointment-service
| | ├── src
│ │ ├── .env
│ │ └── .env.example
│ ├── report-analytics-service
| | ├── src
│ │ ├── .env
│ │ └── .env.example
│ │
│ ├── clinical-service
|   ├── src
│ │ ├── .env
│ │ └── .env.example
│ │
│ ├── worker-service
│ │
│ └── web-app
│ ├── src
│ └── package.json
│
├── packages
│ └── swagger
│ ├── auth.swagger.yaml
│ ├── patient.swagger.yaml
│ └── appointment.swagger.yaml

```

# 🧰 Tech Stack

## Backend

- Node.js
- Express.js
- TypeScript
- Sequelize ORM
- PostgreSQL
- Redis
- BullMQ (worker queues)

## Frontend

- React.js
- TypeScript
- React Router
- Tailwind CSS / UI components

## Infrastructure

- Docker
- Docker Compose
- Redis
- PostgreSQL

## Security

- JWT Authentication
- Refresh tokens
- Cookie-based sessions
- Role-based access control (RBAC)
- Rate limiting
- Input validation (Zod)

## Documentation

- Swagger / OpenAPI

# 🔐 Authentication & Security

The authentication service provides:

- JWT access tokens
- Refresh token rotation
- Role-based access control
- Secure password hashing
- OTP password reset
- Email notifications
- Rate limiting on sensitive endpoints

# ⚙️ Environment Variables

Each service has its own `.env` file.

Example `.env.example`:

```
PORT=4001

DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASS=postgres
DB_NAME=clinic_db

JWT_SECRET=your_access_secret
JWT_REFRESH_SECRET=your_refresh_secret

REDIS_HOST=localhost
REDIS_PORT=6379

MAIL_USER=your_email@gmail.com
MAIL_PASS=your_email_app_password

FRONTEND_URL=http://localhost:8080
```

Copy and configure:

cp .env.example .env

# 🚀 Local Development Setup

## 1. Clone the Repository

## 2. Install Dependencies

For each service:

cd services/auth-service
npm install

Repeat for other services.

## 3. Setup Environment Variables

Create `.env` files for each service using `.env.example`.

## 4. Start Infrastructure

If using Docker:

docker-compose up -d

This will start:

- PostgreSQL
- Redis
- Backend services
  
# 📚 API Documentation

Swagger documentation is available via:

/api-docs

Multiple API specs are aggregated for:

- Auth service
- Patient service
- Appointment service
- Reports and Analytics Service
- Clinical Service

# ⚡ Background Jobs

The **worker service** processes asynchronous tasks such as:

- Appointment reminders
- Email notifications
- Scheduled jobs
- System background processing

Queue system powered by **BullMQ + Redis**.

# 🧩 Key Features

- Patient profile management
- Doctor management
- Appointment scheduling
- Consultation record system
- RBAC authorization
- Notification system
- Microservice-based architecture

# 📈 Future Improvements

- API gateway layer
- Multi Branch performance in single Dashboard
- Payment gateway integration



<img width="1920" height="1080" alt="Screenshot (12)" src="https://github.com/user-attachments/assets/4c04679e-3f63-4ff1-9dcb-c33d8f6cad16" />
<img width="1920" height="1080" alt="Screenshot (13)" src="https://github.com/user-attachments/assets/6e5ee7ec-d622-4058-87da-4f7973da53da" />
<img width="1920" height="1080" alt="Screenshot (15)" src="https://github.com/user-attachments/assets/5aadede5-755e-46f0-808e-2f071ae49609" />
<img width="1920" height="1080" alt="Screenshot (17)" src="https://github.com/user-attachments/assets/4c557033-ef9b-4c5b-817c-79562d2ba26b" />

