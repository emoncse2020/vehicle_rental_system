# 🚗 Vehicle Rental System

## 🎯 Project Overview

A backend API for a vehicle rental management system that handles:

- **Vehicles** – Manage vehicle inventory with availability tracking
- **Customers** – Manage customer accounts and profiles
- **Bookings** – Handle vehicle rentals, returns, and cost calculation
- **Authentication** – Secure role-based access control (Admin and Customer roles)

**Live Demo:** [Vehicle Rental System](https://vehicle-rental-system-two.vercel.app/)

---

## 🛠️ Technology Stack

- **Node.js + TypeScript**
- **Express.js** (web framework)
- **PostgreSQL** (database)
- **bcrypt** (password hashing)
- **jsonwebtoken** (JWT authentication)

---

## 📁 Code Structure

src/  
├─ config/  
│ └─ db.ts  
├─ middleware/  
│ └─ auth.ts  
├─ modules/  
│ ├─ auth/  
│ ├─ users/  
│ ├─ vehicles/  
│ └─ bookings/  
│ ├─ booking.controller.ts  
│ ├─ booking.routes.ts  
│ └─ booking.services.ts  
└─ app.ts

- Each module has **routes → controller → service**
- Clear separation of concerns for maintainability

---

## 📊 Database Tables

### Users

| Field    | Notes                       |
| -------- | --------------------------- |
| id       | Auto-generated              |
| name     | Required                    |
| email    | Required, unique, lowercase |
| password | Required, min 6 characters  |
| phone    | Required                    |
| role     | 'admin' or 'customer'       |

### Vehicles

| Field               | Notes                       |
| ------------------- | --------------------------- |
| id                  | Auto-generated              |
| vehicle_name        | Required                    |
| type                | 'car', 'bike', 'van', 'SUV' |
| registration_number | Required, unique            |
| daily_rent_price    | Required, positive          |
| availability_status | 'available' or 'booked'     |

### Bookings

| Field           | Notes                              |
| --------------- | ---------------------------------- |
| id              | Auto-generated                     |
| customer_id     | Links to Users table               |
| vehicle_id      | Links to Vehicles table            |
| rent_start_date | Required                           |
| rent_end_date   | Required, must be after start date |
| total_price     | Required, positive                 |
| status          | 'active', 'cancelled', 'returned'  |

---

## 🔐 Authentication & Authorization

### User Roles

- **Admin** – Full system access to manage vehicles, users, and all bookings
- **Customer** – Can register, view vehicles, create/manage own bookings

### Authentication Flow

- Passwords are hashed using **bcrypt**
- Users login via `/api/v1/auth/signin` and receive a JWT
- Protected endpoints require **Authorization: Bearer <token>**
- Role-based access is validated by middleware

---

## 🌐 API Endpoints

### Auth

| Method | Endpoint            | Access | Description             |
| ------ | ------------------- | ------ | ----------------------- |
| POST   | /api/v1/auth/signup | Public | Register new user       |
| POST   | /api/v1/auth/signin | Public | Login and get JWT token |

### Vehicles

| Method | Endpoint                    | Access | Description                         |
| ------ | --------------------------- | ------ | ----------------------------------- |
| POST   | /api/v1/vehicles            | Admin  | Add new vehicle                     |
| GET    | /api/v1/vehicles            | Public | Get all vehicles                    |
| GET    | /api/v1/vehicles/:vehicleId | Public | Get vehicle details                 |
| PUT    | /api/v1/vehicles/:vehicleId | Admin  | Update vehicle details              |
| DELETE | /api/v1/vehicles/:vehicleId | Admin  | Delete vehicle (no active bookings) |

### Users

| Method | Endpoint              | Access      | Description                      |
| ------ | --------------------- | ----------- | -------------------------------- |
| GET    | /api/v1/users         | Admin       | View all users                   |
| PUT    | /api/v1/users/:userId | Admin / Own | Update any user / own profile    |
| DELETE | /api/v1/users/:userId | Admin       | Delete user (no active bookings) |

### Bookings

| Method | Endpoint                    | Access           | Description                                                                  |
| ------ | --------------------------- | ---------------- | ---------------------------------------------------------------------------- |
| POST   | /api/v1/bookings            | Admin / Customer | Create booking (validates vehicle, calculates total, updates vehicle status) |
| GET    | /api/v1/bookings            | Role-based       | Admin: all bookings, Customer: own bookings                                  |
| PUT    | /api/v1/bookings/:bookingId | Role-based       | Customer: cancel before start date, Admin: mark as returned                  |

---

## ⚡ Setup & Run Locally

1. Clone the repository:

```bash
git clone <repo-url>
cd vehicle-rental-system
npm install
```

## Create `.env` file with PostgreSQL config:

```bash
PORT
CONNECTION_STR
JWT_SECRET
```
