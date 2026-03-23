# Clinical Service

The **Clinical Service** manages medical records created during consultations.

Doctors create consultation notes for appointments, which are stored as clinical records.

---

# Features

- Create consultation notes
- Update consultation notes
- Patient consultation timeline
- Doctor consultation dashboard
- Admin clinical records view
- Follow-up scheduling
- Notification generation
- Search and filtering
- Pagination support

---

# Tech Stack

- Node.js
- Express
- TypeScript
- PostgreSQL
- Sequelize ORM
- Redis
- BullMQ

---

# Port

```
Clinical Service runs on port: 4004
```

---

# Core Functionalities

### Consultation Notes

Doctors can create consultation notes containing:

- Symptoms
- Diagnosis
- Prescriptions
- Notes
- Follow-up date

Each appointment can have **only one consultation note**.

---

### Doctor Dashboard

Doctors can view:

- Their consultation records
- Filter by date
- Search patients
- Sort consultations

---

### Patient Timeline

Patients can view:

- Full consultation history
- Previous diagnoses
- Previous prescriptions

---

### Admin Access

Admins can:

- View all clinical records
- Search across consultations
- Filter results

---

# API Endpoints

### Create Note

POST `/api/clinical/notes`

---

### Update Note

PATCH `/api/clinical/notes/:noteId`

---

### Get Notes by Appointment

GET `/api/clinical/notes/:appointmentId`

---

### Doctor Dashboard

GET `/api/clinical/doctor/me`

---

### Patient Timeline

GET `/api/clinical/patient/me`

---

### Admin Clinical Records

GET `/api/clinical/admin`

---

# Notifications

Clinical service also manages:

```
notifications
```

Users receive:

- Follow-up reminders
- Appointment notifications

---

# Queue System

BullMQ queue used:

```
clinical-queue
```

Job types:

```
consultation.followup
```

---

# Folder Structure

```
src
 ├── controllers
 ├── services
 ├── repositories
 ├── models
 ├── routes
 ├── queues
 ├── validators
 ├── utils
```

---

# Purpose in System

The Clinical Service stores and manages medical consultation records and patient history.
