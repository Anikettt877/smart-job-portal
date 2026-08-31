# 🚀 SmartHire — Smart Job Portal (MERN Stack)

A production-ready, full-stack job portal built with the MERN stack. Users can register as Job Seekers or Recruiters, post and apply for jobs, track applications, and manage hiring pipelines — all from a modern, responsive UI.

---

## 🧱 Tech Stack

| Layer          | Technology                                         |
| -------------- | -------------------------------------------------- |
| Frontend       | React 18 + Vite + Tailwind CSS + Material UI (MUI) |
| UI Components  | Material UI (MUI) v5 + MUI Icons                   |
| Styling        | Tailwind CSS + Emotion                             |
| Backend        | Node.js + Express.js                               |
| Database       | MongoDB (Mongoose ODM)                             |
| Authentication | JWT (JSON Web Tokens) + bcryptjs                   |
| API Style      | RESTful                                            |
| HTTP Client    | Axios                                              |
| Routing        | React Router DOM                                   |
| Notifications  | React Hot Toast                                    |
| Deployment     | Vercel (client) + Render (server)                  |

---

## 📁 Project Structure

```text
smart-job-portal/
├── server/                              # Node + Express backend
│   ├── config/
│   │   └── db.js                        # MongoDB connection
│   ├── controllers/
│   │   ├── authController.js             # Register, Login, GetMe, UpdateProfile
│   │   ├── jobController.js              # CRUD for jobs
│   │   └── applicationController.js      # Apply, track, update status
│   ├── middleware/
│   │   ├── auth.js                       # JWT protect middleware
│   │   └── roleCheck.js                  # Role-based access control
│   ├── models/
│   │   ├── User.js                       # User schema (bcrypt hashing)
│   │   ├── Job.js                        # Job schema
│   │   └── Application.js                # Application schema
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── jobRoutes.js
│   │   └── applicationRoutes.js
│   ├── utils/
│   │   └── generateToken.js               # JWT token generator
│   ├── server.js                          # Entry point
│   ├── package.json
│   └── .env.example
│
└── client/                               # React frontend (Vite)
    ├── src/
    │   ├── components/
    │   │   ├── Navbar.jsx
    │   │   ├── Footer.jsx
    │   │   ├── JobCard.jsx
    │   │   ├── StatusBadge.jsx
    │   │   └── Spinner.jsx
    │   ├── context/
    │   │   └── AuthContext.jsx             # Global auth state (useReducer)
    │   ├── pages/
    │   │   ├── Home.jsx
    │   │   ├── Login.jsx
    │   │   ├── Register.jsx
    │   │   ├── Jobs.jsx                    # Browse with search + filters + pagination
    │   │   ├── JobDetail.jsx                # Full detail + apply modal
    │   │   ├── PostJob.jsx
    │   │   ├── EditJob.jsx
    │   │   ├── Dashboard.jsx                # Role-based (recruiter/user/admin)
    │   │   ├── Applications.jsx             # Application tracker
    │   │   ├── Profile.jsx
    │   │   └── NotFound.jsx
    │   ├── services/
    │   │   ├── axiosInstance.js             # Configured Axios with interceptors
    │   │   └── api.js                       # Auth, Job, Application API calls
    │   ├── App.jsx                          # Routes + ProtectedRoute + GuestRoute
    │   ├── main.jsx
    │   └── index.css                        # Tailwind + custom styles
    ├── index.html
    ├── vite.config.js
    ├── tailwind.config.js
    └── .env.example
```

---

## 🔐 Authentication & Roles

| Role        | Capabilities                                                    |
| ----------- | --------------------------------------------------------------- |
| `user`      | Browse jobs, apply, view/track/withdraw applications            |
| `recruiter` | Post jobs, edit/delete own jobs, view applicants, update status |
| `admin`     | All recruiter abilities + view all applications system-wide     |

---

## 🌐 REST API Reference

### Auth

| Method | Endpoint             | Access  | Description        |
| ------ | -------------------- | ------- | ------------------ |
| POST   | `/api/auth/register` | Public  | Create new account |
| POST   | `/api/auth/login`    | Public  | Login, returns JWT |
| GET    | `/api/auth/me`       | Private | Get current user   |
| PUT    | `/api/auth/profile`  | Private | Update profile     |

### Jobs

| Method | Endpoint                      | Access          | Description                    |
| ------ | ----------------------------- | --------------- | ------------------------------ |
| GET    | `/api/jobs`                   | Public          | Get all jobs (filter/paginate) |
| GET    | `/api/jobs/:id`               | Public          | Get single job                 |
| GET    | `/api/jobs/recruiter/my-jobs` | Recruiter/Admin | Get my posted jobs             |
| POST   | `/api/jobs`                   | Recruiter/Admin | Create job                     |
| PUT    | `/api/jobs/:id`               | Recruiter/Admin | Update job                     |
| DELETE | `/api/jobs/:id`               | Recruiter/Admin | Delete job                     |

### Applications

| Method | Endpoint                       | Access          | Description               |
| ------ | ------------------------------ | --------------- | ------------------------- |
| POST   | `/api/applications`            | User            | Apply for a job           |
| GET    | `/api/applications/my`         | User            | Get my applications       |
| GET    | `/api/applications/job/:jobId` | Recruiter/Admin | Get applicants for job    |
| GET    | `/api/applications`            | Admin           | Get all applications      |
| PUT    | `/api/applications/:id`        | Recruiter/Admin | Update application status |
| DELETE | `/api/applications/:id`        | User/Admin      | Withdraw application      |

---

## 🎨 UI & Styling

SmartHire uses a combination of **Material UI (MUI)** and **Tailwind CSS** to build its responsive user interface.

### Material UI

MUI is used for reusable React UI components and Material Design elements, including:

* Buttons
* Text fields and form controls
* Dialogs and modals
* Cards
* Menus
* Navigation components
* Icons
* Loading indicators
* Other reusable UI elements

The project uses **MUI v5** with `@mui/material` and `@mui/icons-material`.

### Tailwind CSS

Tailwind CSS is used for:

* Responsive layouts
* Spacing and sizing
* Flexbox and grid layouts
* Responsive design
* Custom styling
* Dark mode
* Mobile-first UI

### Emotion

Emotion is used as the styling engine required by Material UI.

---

## ⚙️ Local Development Setup

### Prerequisites

* Node.js v16+
* MongoDB Atlas account (free tier) OR local MongoDB
* Git

### Step 1 — Clone the repository

```bash
git clone https://github.com/yourusername/smart-job-portal.git
cd smart-job-portal
```

### Step 2 — Setup the Backend

```bash
cd server
npm install
cp .env.example .env
```

Edit `.env` with your MongoDB URI and JWT secret.

```bash
npm run dev
```

✅ Server running at `http://localhost:5000`

### Step 3 — Setup the Frontend

Open another terminal:

```bash
cd client
npm install
cp .env.example .env
```

The development environment uses the Vite proxy to communicate with the backend.

```bash
npm run dev
```

✅ Client running at `http://localhost:5173`

---

## 🔑 Environment Variables

### `server/.env`

```env
PORT=5000
NODE_ENV=development

# MongoDB Atlas connection string
MONGO_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/smart-job-portal?retryWrites=true&w=majority

# JWT
JWT_SECRET=your_super_secret_jwt_key_at_least_32_chars
JWT_EXPIRE=7d

# Allowed frontend origin (CORS)
CLIENT_URL=http://localhost:5173
```

### `client/.env`

```env
# Development: uses Vite proxy → localhost:5000
VITE_API_URL=/api

# Production: your Render backend URL
# VITE_API_URL=https://smart-job-portal-api.onrender.com/api
```

---

## 🚀 Deployment Guide

### 1. MongoDB Atlas

1. Create a free M0 cluster.
2. Create a database user.
3. Configure Network Access.
4. Copy the MongoDB connection string.
5. Add it to `MONGO_URI` in the backend environment variables.

### 2. Backend → Render

1. Push your code to GitHub.
2. Create a new Web Service on Render.
3. Connect your GitHub repository.
4. Configure:

```text
Root Directory: server
Build Command: npm install
Start Command: node server.js
```

5. Add the required environment variables:

```env
MONGO_URI=<your Atlas URI>
JWT_SECRET=<your secret>
JWT_EXPIRE=7d
NODE_ENV=production
CLIENT_URL=https://your-app.vercel.app
PORT=5000
```

6. Deploy the backend and copy the Render URL.

### 3. Frontend → Vercel

1. Import the GitHub repository into Vercel.
2. Configure:

```text
Root Directory: client
Framework Preset: Vite
Build Command: npm run build
Output Directory: dist
```

3. Add:

```env
VITE_API_URL=https://smart-job-portal.onrender.com/api
```

4. Deploy the frontend.

---

## 🧪 Test Credentials

Register accounts manually or seed the database:

| Role      | Email                | Password  |
| --------- | -------------------- | --------- |
| Recruiter | `recruiter@demo.com` | `demo123` |
| Seeker    | `seeker@demo.com`    | `demo123` |

> Note: Use the Register page to create these accounts. Admin role must be set directly in MongoDB.

---

## ✨ Features Summary

* ✅ JWT Authentication with role-based access (`user` / `recruiter` / `admin`)
* ✅ Full CRUD for Jobs
* ✅ Job application system with cover letter + resume URL
* ✅ Application status pipeline: Applied → Reviewing → Selected / Rejected
* ✅ Advanced job search with text search, filters, and pagination
* ✅ Role-based dashboards
* ✅ Profile management with skills, bio, and location
* ✅ Dark mode toggle persisted to localStorage
* ✅ Responsive mobile-first design
* ✅ Material UI reusable components
* ✅ MUI Icons
* ✅ Tailwind CSS responsive styling
* ✅ Password hashing with bcryptjs
* ✅ CORS configured for production origins
* ✅ Global error handling
* ✅ Axios interceptors
* ✅ Automatic 401 redirect to login on token expiry
* ✅ MongoDB text index for full-text job search
* ✅ Duplicate application prevention using a unique compound index

---

## 📄 License

MIT License — free to use for college projects and personal portfolios.

---

Built with ❤️ using the **MERN Stack** | MongoDB · Express · React · Node.js
