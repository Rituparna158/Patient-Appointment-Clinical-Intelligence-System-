# 🏥 LifeLine — Clinical Intelligence System

A full-featured **Patient Appointment & Clinic Management Platform** designed to streamline healthcare operations across multiple roles including **Admin, Doctor, and Patient**.

---

## 🚀 Features

### 👤 Authentication & Authorization

- Role-based access control (Admin / Doctor / Patient)
- Secure login & registration
- Protected routes

---

### 🧑‍⚕️ Patient Module

- Create & manage patient profile
- Book appointments with doctors
- View appointment history
- Secure payment integration
- View clinical timeline (consultation notes)

---

### 👨‍⚕️ Doctor Module

- Manage appointments
- Add consultation notes
- Track patient history

---

### 🛠️ Admin Module

- Manage doctors, patients, and branches
- View analytics dashboard
- Monitor system activities

---

### 🔔 Notifications

- Real-time-like notification system
- Notification dropdown with unread count

---

### 📊 Dashboard & Analytics

- Appointment trends
- Patient statistics
- Revenue insights

---

### 📋 Reusable Components

- Generic DataTable with:
  - Sorting
  - Pagination
  - Filtering
  - Search

- Form components with validation
- Modal & Drawer components

---

## 🧱 Tech Stack

### Frontend

- React (with TypeScript)
- React Router
- Zustand (State Management)
- React Hook Form + Zod (Validation)
- Tailwind CSS
- ShadCN UI
- Lucide Icons

---

## 📁 Project Structure

```
src/
│
├── app/ # Layout & routing
├── components/ # Reusable UI components
├── features/ # Feature-based modules
├── hooks/ # Custom hooks
├── services/ # API service layer
├── store/ # Zustand stores
├── types/ # TypeScript types
├── schemas/ # Zod schemas
└── pages/ # Route pages
```

---

## ⚙️ Installation & Setup

### 1. Clone the repository

```bash
git clone https://github.com/your-username/lifeline.git
cd lifeline
```

### 2. Install dependencies

```bash
npm install
```

### 3. Run development server

```bash
npm run dev
```

---

## 🔐 Environment Variables

Create a `.env` file:

```
VITE_API_URL=http://localhost:3000/api
```

---

## 📡 API Integration

- Centralized API service layer
- Token-based authentication
- Error handling with toast notifications

---

## 🧪 Validation

- Form validation using **Zod**
- Integrated with **React Hook Form**

---

## 📌 Key Highlights

- Modular & scalable architecture
- Clean separation of concerns
- Reusable UI system
- Optimized state management with Zustand
- Fully typed with TypeScript

---

## 🚧 Future Improvements

- Real-time notifications (WebSocket)
- Advanced analytics dashboard
- Role-based UI customization
- Performance optimizations
- Accessibility improvements

---

## 👨‍💻 Author

**Rituparna Rath**

---

## 📜 License

This project is licensed under the MIT License.

---

## ⭐ If you like this project

Give it a ⭐ on GitHub!
