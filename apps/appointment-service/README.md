# Appointment Service

The **Appointment Service** handles the complete lifecycle of clinic appointments including booking, payment confirmation, scheduling, rescheduling, and cancellation.

---

# Features

- Book appointments
- Doctor slot management
- Payment confirmation
- Appointment rescheduling
- Appointment cancellation
- Refund handling
- Patient appointment history
- Doctor appointment dashboard
- Admin appointment search
- Filtering and sorting
- Pagination support

---

# Tech Stack

- Node.js
- Express
- TypeScript
- PostgreSQL
- Sequelize ORM
- Redis
- BullMQ (Queue System)

---

# Port

```
Appointment Service runs on port: 4003
```

---

# Core Functionalities

### Appointment Booking

Patients can:

- Choose doctor
- Choose branch
- Select available slot
- Add appointment reason

System ensures:

- Slot availability
- No past bookings
- Slot locking after booking

---

### Payment Confirmation

After booking:

- Payment status updated
- Appointment status confirmed
- Queue job created for notifications

---

### Doctor Features

Doctors can:

- View their appointments
- Update appointment status
- Reschedule appointments
- Cancel appointments

---

### Admin Features

Admins can:

- Search appointments
- Filter by branch
- Filter by status
- Sort results

---

# API Endpoints

### Booking

POST `/api/appointments/book`

---

### Payment

POST `/api/appointments/pay`

---

### Patient

GET `/api/appointments/me`

---

### Doctor

GET `/api/appointments/doctor/me`

PATCH `/api/appointments/:id/status`

---

### Admin

GET `/api/appointments`

---

### Slot Management

GET `/api/appointments/slots`

POST `/api/appointments/admin/create-slot`

---

# Queue System

BullMQ is used to handle background tasks.

Queues:

```
appointment-queue
```

Jobs:

- appointment.confirmed
- appointment.reminder

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
 ├── queues
 ├── utils
```

---

# Purpose in System

The Appointment Service coordinates scheduling between patients and doctors.
