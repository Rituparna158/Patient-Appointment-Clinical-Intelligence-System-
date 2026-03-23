# Worker Service

The **Worker Service** handles all background processing tasks for the Clinic Management System.
Instead of executing heavy or time-consuming operations during API requests, tasks are pushed to **Redis queues** and processed asynchronously by this service.

This improves system scalability, reliability, and response time.

---

# Overview

The Worker Service processes asynchronous jobs such as:

- Appointment reminders
- Follow-up reminders
- Email notifications
- Analytics generation
- CSV report exports
- Automatic appointment status updates

These tasks are triggered by other services through **BullMQ queues**.

---

# Port

Worker services typically do **not expose public HTTP APIs**.
They run as background processes connected to Redis.

Example runtime:

```
node dist/index.js
```

---

# Technology Stack

- Node.js
- TypeScript
- BullMQ
- Redis
- PostgreSQL
- Sequelize
- Nodemailer
- pnpm

---

# Architecture

The Worker Service subscribes to queues published by other microservices.

```
Client Request
      │
      ▼
API Service
(Auth / Appointment / Clinical / Analytics)
      │
      ▼
Redis Queue (BullMQ)
      │
      ▼
Worker Service
      │
      ▼
Background Job Processing
```

This architecture ensures that API services remain fast and responsive.

---

# Queues Processed

The worker service listens to several queues.

### Appointment Queue

Handles appointment-related background tasks.

Examples:

- appointment confirmation emails
- appointment reminder notifications
- follow-up reminders

Example job:

```
appointment.reminder
```

---

### Clinical Queue

Triggered when consultation notes are created.

Example:

```
consultation.followup
```

Purpose:

- schedule follow-up reminders
- notify patients about upcoming follow-up visits

---

### Report Queue

Used by the Reports & Analytics Service.

Example:

```
analytics.export
```

Purpose:

- generate CSV reports
- send reports via email

---

# Job Flow Example

Example: Appointment Reminder

```
Appointment Confirmed
        │
        ▼
Appointment Service
        │
        ▼
BullMQ Queue
        │
        ▼
Worker Service
        │
        ▼
Send Email Reminder
```

---

# Retry Strategy

Jobs can fail due to temporary issues (network failure, email provider outage).

BullMQ supports automatic retry.

Example configuration:

```
attempts: 5
backoff:
  type: exponential
  delay: 5000
```

This ensures jobs are retried before being marked as failed.

---

# Job Processing Example

Example worker processor:

```
worker.process("consultation.followup", async (job) => {
  const { consultationId } = job.data;

  // fetch consultation
  // schedule follow-up notification
  // send reminder email
});
```

---

# Folder Structure

```
src
 ├── workers
 │   ├── appointment.worker.ts
 │   ├── notification.worker.ts
 │   ├── analytics.worker.ts
 │
 ├── queues
 │   ├── appointment.producer.ts
 │   ├── clinical.producer.ts
 │   ├── report.producer.ts
 │
 ├── services
 │   ├── email.service.ts
 │   ├── analytics.service.ts
 │
 ├── config
 │   ├── redis.ts
 │
 ├── utils
 │   ├── logger.ts
 │
 └── index.ts
```

---

# Redis Configuration

BullMQ requires a Redis instance.

Example environment variables:

```
REDIS_HOST=localhost
REDIS_PORT=6379
```

Connection example:

```
const redisConnection = {
  host: process.env.REDIS_HOST,
  port: Number(process.env.REDIS_PORT)
}
```

---

# Environment Variables

```
NODE_ENV=development

REDIS_HOST=localhost
REDIS_PORT=6379

DB_HOST=localhost
DB_PORT=5432
DB_NAME=clinic
DB_USER=postgres
DB_PASS=password

EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=example@gmail.com
EMAIL_PASS=password
```

---

# Starting the Worker

Development mode:

```
pnpm dev
```

Production:

```
pnpm start
```

---

# Scaling Workers

Multiple worker instances can run simultaneously.

Example:

```
worker-instance-1
worker-instance-2
worker-instance-3
```

BullMQ distributes jobs automatically across workers.

This allows the system to handle high background workloads.

---

# Failure Handling

BullMQ tracks job status:

- waiting
- active
- completed
- failed

Failed jobs can be retried automatically or inspected manually.

---

# Monitoring

Recommended tools for queue monitoring:

- bull-board
- Arena dashboard

These tools provide visibility into:

- queue backlog
- failed jobs
- job retry status
- processing times

---

# Security Considerations

- Workers run inside private infrastructure
- Redis access should be restricted
- Email credentials must be stored in environment variables
- Jobs should validate input before processing

---

# Role in Microservice Architecture

The Worker Service offloads heavy operations from API services.

Benefits:

- faster API responses
- improved system scalability
- better failure handling
- easier horizontal scaling

---

# Summary

The Worker Service is responsible for **asynchronous job processing** across the clinic management platform.

It ensures that tasks such as notifications, reminders, analytics generation, and report exports run reliably without blocking API requests.
