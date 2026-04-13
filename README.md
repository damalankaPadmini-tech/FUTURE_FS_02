# DeltaX Lead Management

![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)
![NodeJS](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white)
![Express.js](https://img.shields.io/badge/express.js-%23404d59.svg?style=for-the-badge&logo=express&logoColor=%2361DAFB)
![SQLite](https://img.shields.io/badge/sqlite-%2307405e.svg?style=for-the-badge&logo=sqlite&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/tailwindcss-%2338B2AC.svg?style=for-the-badge&logo=tailwind-css&logoColor=white)

A high-performance, premium dark-themed Client Lead Management System (Mini CRM) designed to streamline client acquisition and engagement profiling. 

## Features

- **Premium Dark UI**: Gorgeous transparent glassmorphism, native glowing status indicators, and SVG staggered entry animations.
- **Dynamic Dashboard**: Responsive Area Charts integrated with Recharts mapping real lead metrics.
- **Advanced Lead Tracking**: Real-time filtering, fast searching, multi-channel Source Tracking, and complete timeline-event internal Note logging.
- **CSV Data Pipeline**: One-click bulk export function directly downloading `.csv` records.
- **Full Backend Logic**: JSON Web Token implementation, stateless scalable Node.js architecture over SQLite, fully paginated scalable database fetching.

## Environment Variables

Create a `.env` file in the `backend/` directory referencing `.env.example`:

```env
PORT=5000
JWT_SECRET=super_secret_jwt_key_example
```

## How to run locally

### 1. Start the Backend Server

Navigate into the backend directory, install the required dependencies, and execute the startup configuration. The server will self-seed root credentials (`admin@crm.com` / `admin123`) and initialize `data.db`.

```bash
cd backend
npm install
npm run dev
```

### 2. Start the Frontend Application

In a new terminal window, traverse to the frontend repository, install packages, and deploy the Vite hot-reloading development server:

```bash
cd frontend
npm install
npm run dev
```

### 3. Access Portal

Navigate to `http://localhost:5173` to interact with your secure CRM portal. 
*(Port proxy setup ensures frontend requests effortlessly resolve to the active `localhost:5000` backend API route).*
