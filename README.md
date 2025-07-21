# RentRoll - Property Management Platform

RentRoll is a full-stack property management application designed to help landlords and property managers efficiently manage properties, tenants, and payments. The project is divided into two main parts: a React-based frontend and a Node.js/Express backend with MongoDB.


### 🚀 Live Application  
🔗 [https://plp-final-project-rent-roll.vercel.app/](https://plp-final-project-rent-roll.vercel.app/)


### 🎥 Demo Video  
[https://github.com/user-attachments/assets/a1b2f9a3-9d34-4d42-99c7-24db210c3c44](https://github-production-user-asset-6210df.s3.amazonaws.com/92723243/468782580-a1b2f9a3-9d34-4d42-99c7-24db210c3c44.mp4?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIAVCODYLSA53PQK4ZA%2F20250721%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Date=20250721T194453Z&X-Amz-Expires=300&X-Amz-Signature=23809986dc21c4b33eda1fc9534f5c77888f28e94221f50fb101361fd7d58df0&X-Amz-SignedHeaders=host)



---

## 📸 Screenshots

### 🖼 Dashboard

<img width="1908" height="825" alt="Screenshot 2025-07-20 184848" src="https://github.com/user-attachments/assets/94d30157-b5de-4dae-964c-423521998c9e" />

### 🏘 Property Management
<p align="center">
  <img width="1905" height="855" alt="Screenshot 2025-07-21 195527" src="https://github.com/user-attachments/assets/73d28558-6ab0-422d-adff-c43a956e7249" />
  <img width="1885" height="838" alt="Screenshot 2025-07-21 195549" src="https://github.com/user-attachments/assets/d0a6af44-3cd2-4e7e-a672-98f48fbf5b0c" />
</p>

### 👥 Tenants Page
<p align="center">
  <img width="1896" height="850" alt="Screenshot 2025-07-21 195616" src="https://github.com/user-attachments/assets/edc00ed6-0b4f-4e60-8a5d-6a03dcc7b40e" />
<img width="1867" height="852" alt="Screenshot 2025-07-21 195638" src="https://github.com/user-attachments/assets/6474fa5c-381c-4b09-a19d-f0bbad23d9ff" />
</p>

### 💳 Payment Tracking
<p align="center">
  <img width="1896" height="852" alt="Screenshot 2025-07-21 195747" src="https://github.com/user-attachments/assets/fa597828-a52e-4d2f-b7ed-c77049659cba" />
<img width="1890" height="857" alt="Screenshot 2025-07-21 195826" src="https://github.com/user-attachments/assets/22da7df9-cc60-49a6-8d2e-aef8ee7ff123" />
</p>

---

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

The frontend will run on [http://localhost:5173](http://localhost:3000) and the backend on [http://localhost:5000](http://localhost:5000) by default.

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


Frontend: http://localhost:3000

Backend: http://localhost:5000

### Scripts
## Backend
npm start - Run production Express server

npm run dev - Run server with Nodemon (dev)

## Frontend
npm run dev - Start development server

npm run build - Create production build

npm run preview - Preview the production build

 ### License
This project is open source and available under the MIT License.

### Thank You!
If you find this project helpful or inspiring, consider giving it a ⭐ on GitHub!

### Thank You.
