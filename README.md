# RentRoll - Property Management Platform

RentRoll is a full-stack property management application designed to help landlords and property managers efficiently manage properties, tenants, and payments. The project is divided into two main parts: a React-based frontend and a Node.js/Express backend with MongoDB.


### Application Link : https://plp-final-project-rent-roll.vercel.app/
---

## Table of Contents
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Scripts](#scripts)
- [License](#license)

---

## Features
- User authentication (JWT-based)
- Property CRUD operations
- Tenant management
- Payment tracking
- Dashboard with key metrics
- Responsive UI with Tailwind CSS

---

## Tech Stack
- **Frontend:** React, Tailwind CSS
- **Backend:** Node.js, Express.js
- **Database:** MongoDB (Mongoose ODM)
- **Authentication:** JWT

---

## Project Structure
```
client/           # React frontend
  src/
    components/   # Reusable UI components
    context/      # React context for global state
    pages/        # Main app pages
    services/     # API service layer
  public/         # Static assets
  ...

server/           # Node.js backend
  models/         # Mongoose models
  routes/         # Express route handlers
  middleware/     # Custom middleware (e.g., auth)
  utils/          # Utility scripts (e.g., seed data)
  ...
```

---

## Getting Started

### Prerequisites
- Node.js (v16+ recommended)
- npm or yarn
- MongoDB Atlas account (or local MongoDB)

### 1. Clone the repository
```sh
git clone https://github.com/Emmz07/Plp-final-project-RentRoll.git
cd Plp-final-project-RentRoll
```

### 2. Setup Environment Variables
- Copy `.env.example` to `.env` in the `server/` directory and fill in your credentials.

### 3. Install Dependencies
#### Backend
```sh
cd server
npm install
```
#### Frontend
```sh
cd ../client
npm install
```

### 4. Run the Application
#### Start Backend
```sh
cd server
npm start
```
#### Start Frontend
```sh
cd ../client
npm run dev
```

The frontend will run on [http://localhost:5173](http://localhost:5173) and the backend on [http://localhost:5000](http://localhost:5000) by default.

---

## Environment Variables
Create a `.env` file in the `server/` directory with the following:
```
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
```

---

## Scripts
### Backend
- `npm start` - Start the Express server
- `npm run dev` - Start server with nodemon (if configured)

### Frontend
- `npm run dev` - Start the React development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

### Thank You.