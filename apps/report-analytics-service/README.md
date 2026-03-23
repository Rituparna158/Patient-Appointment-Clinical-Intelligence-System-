# Reports & Analytics Service

The **Reports & Analytics Service** provides analytical insights and reporting capabilities for the clinic management platform.
It aggregates appointment, patient, and revenue data to power **admin dashboards, doctor dashboards, patient dashboards, and CSV report exports**.

This service is optimized for **read-heavy analytics queries** and integrates with other microservices via shared database models.

---

# Service Responsibilities

- Admin analytics dashboard
- Doctor dashboard metrics
- Patient dashboard metrics
- Appointment analytics trends
- Appointment status breakdown
- Daily analytics tables
- CSV report generation
- Email-based report delivery
- Queue-based asynchronous export jobs

---

# Port

```
Reports & Analytics Service runs on port: 4006
```

---

# Tech Stack

- Node.js
- Express
- TypeScript
- PostgreSQL
- Sequelize ORM
- Redis
- BullMQ
- Fast-CSV
- Zod Validation
- Helmet Security
- Morgan Logging

---

# Architecture Role

This service sits on top of operational services and provides **analytical aggregation**.

```
Auth Service
      │
      ▼
Appointment Service
      │
      ▼
Clinical Service
      │
      ▼
Reports & Analytics Service
      │
      ▼
Dashboards / CSV Reports
```

---

# Features

## Admin Dashboard

Admin dashboards provide system-wide analytics:

- Total appointments
- Completed appointments
- New patients
- Follow-up scheduling
- Appointment status distribution
- Appointment trend graphs
- Daily analytics tables

Endpoints:

```
GET /api/reports-analytics/analytics/admin/dashboard/counters
GET /api/reports-analytics/analytics/admin/dashboard/status
GET /api/reports-analytics/analytics/admin/dashboard/trend
GET /api/reports-analytics/analytics/admin/dashboard/daily
```

---

## Doctor Dashboard

Doctors get personalized analytics:

- Today's appointments
- Completed appointments
- Cancelled appointments
- Upcoming appointments
- Workload trends
- Completion rate
- Patient type statistics

Endpoints:

```
GET /api/reports-analytics/analytics/doctor/dashboard
GET /api/reports-analytics/analytics/doctor/dashboard/table
GET /api/reports-analytics/analytics/doctor/charts/workload
GET /api/reports-analytics/analytics/doctor/charts/completion-rate
GET /api/reports-analytics/analytics/doctor/charts/patient-types
```

---

## Patient Dashboard

Patients can see their appointment statistics.

Includes:

- Upcoming appointments
- Completed appointments
- Appointment history table

Endpoints:

```
GET /api/reports-analytics/analytics/patient/dashboard
GET /api/reports-analytics/analytics/patient/dashboard/table
```

---

# Export Reports

The service supports exporting analytics reports as **CSV files**.

Two export types:

### Admin Export

Includes:

- Appointment analytics
- Doctor names
- Patient names
- Appointment status
- Slot details
- Patient statistics

Endpoint:

```
GET /api/reports-analytics/report/export
```

Query parameters:

```
range
from
to
delivery
```

Delivery options:

```
download
email
```

---

### Doctor Export

Doctors can export their appointment data.

Includes:

- Appointment ID
- Patient name
- Slot date
- Start time
- Status

---

# Queue-Based Export System

Large exports are processed asynchronously using **BullMQ**.

Queue:

```
report-queue
```

Job:

```
analytics.export
```

Flow:

```
API Request
     │
     ▼
Publish Job
     │
     ▼
Worker Service
     │
     ▼
Generate CSV
     │
     ▼
Send Email
```

---

# Database Models

The primary analytics table is:

```
analytics_daily_metrics
```

Fields:

- date
- branchId
- doctorId
- totalAppointments
- confirmedAppointments
- cancelledAppointments
- missedAppointments
- completedAppointments
- totalRevenue
- avgConsultationFee
- newPatients
- uniquePatients
- followUpsScheduled

This table is populated by background workers for fast dashboard queries.

---

# Folder Structure

```
src
 ├── controllers
 ├── services
 ├── repositories
 ├── routes
 ├── queues
 ├── validators
 ├── utils
 ├── types
 ├── config
 └── middlewares
```

---

# Security

The service enforces authentication and role-based access control.

Roles supported:

```
admin
doctor
patient
```

Middleware used:

- authenticate
- authorizeRole
- requireAnyRole

---

# Environment Variables

```
PORT=4006

DB_HOST=
DB_PORT=
DB_USER=
DB_PASS=
DB_NAME=

REDIS_HOST=
REDIS_PORT=
```

---

# Performance Strategy

To support large datasets, the service relies on:

- Pre-aggregated analytics tables
- Pagination for large result sets
- Indexed database columns
- Queue-based report generation
- CSV streaming

---

# CSV Generation

CSV files are generated using **fast-csv**.

Files are temporarily stored in:

```
/exports
```

Example file names:

```
admin-report-171071234.csv
doctor-report-171071567.csv
```

---

# Rate Limiting

Global API rate limiting is enabled to prevent abuse.

Middleware:

```
globalRateLimiter
```

---

# Logging

Request logs are generated using **Morgan**.

Example log:

```
GET /analytics/admin/dashboard/counters 200 35ms
```

---

# Error Handling

All controllers use centralized error middleware.

```
errorHandler
```

Errors return standardized responses.

---

# Service Purpose

The Reports & Analytics Service enables **data-driven insights** across the clinic management platform.

It powers dashboards used by:

- Administrators
- Doctors
- Patients

and provides exportable reports for operational and analytical use.
