# 🏠 EstateHub – MERN Real Estate Management System

A full-stack Real Estate Management System built with the MERN stack (MongoDB, Express, React, Node.js), featuring role-based auth, property listings, wishlist, inquiry system, and complete admin controls.

---

## 🚀 Live Deployment

| Service  | Platform      | URL                                                     |
| -------- | ------------- | ------------------------------------------------------- |
| Frontend | Vercel        | `https://your-app.vercel.app`                           |
| Backend  | Render        | `https://real-estate-management-system-rh4j.onrender.com` |
| Database | MongoDB Atlas | Cloud hosted                                            |
| Images   | Cloudinary    | Cloud CDN                                               |

---

## ✨ Features

### 👤 Authentication & Roles

- JWT-based Register / Login
- 3 Roles: **User**, **Agent**, **Admin**
- Protected routes per role
- Password hashing with bcryptjs

### 🏠 Properties

- Browse all approved listings with real-time search
- Filters: type, status, city, price range, bedrooms
- Pagination (12 per page)
- Full property details: gallery, features, amenities
- View counter per property

### ❤️ Wishlist (Users)

- Save/unsave properties
- Dedicated wishlist dashboard with quick access

### 💬 Inquiries

- Users send messages to property agents
- Agents can reply to inquiries
- Status tracking: pending → read → replied

### 🏢 Agent Dashboard

- Add, edit, delete own properties
- Manage received inquiries
- View live stats (total listings, views, pending)

### ⚙️ Admin Dashboard

- Approve / reject / suspend properties
- Manage all users (role change, ban, delete)
- View all platform inquiries
- Platform-wide statistics

---

## 🛠️ Tech Stack

| Layer      | Technology                                  |
| ---------- | ------------------------------------------- |
| Frontend   | React 18, Vite, Redux Toolkit, Tailwind CSS |
| Backend    | Node.js, Express.js                         |
| Database   | MongoDB + Mongoose                          |
| Auth       | JWT + bcryptjs                              |
| Images     | Cloudinary + Multer                         |
| State Mgmt | Redux Toolkit + Axios                       |
| UI/UX      | Tailwind CSS, React Hot Toast               |

---

## 📁 Project Structure

```
real-estate-management-system/
├── backend/
│   ├── config/
│   │   ├── cloudinary.js
│   │   └── db.js
│   ├── controllers/
│   │   ├── adminController.js
│   │   ├── authController.js
│   │   ├── inquiryController.js
│   │   ├── propertyController.js
│   │   └── wishlistController.js
│   ├── data/
│   │   └── fallbackProperties.js
│   ├── middleware/
│   │   └── auth.js
│   ├── models/
│   │   ├── Inquiry.js
│   │   ├── Property.js
│   │   ├── User.js
│   │   └── Wishlist.js
│   ├── routes/
│   │   ├── admin.js
│   │   ├── auth.js
│   │   ├── inquiries.js
│   │   ├── properties.js
│   │   └── wishlist.js
│   ├── scripts/
│   │   ├── migrateLocalImagesToCloudinary.js
│   │   └── seedSampleProperties.js
│   ├── server.js
│   └── package.json
│
└── frontend/
    ├── public/
    │   └── hero-building.jpg
    ├── src/
    │   ├── components/
    │   │   ├── Footer.jsx
    │   │   ├── Navbar.jsx
    │   │   ├── PropertyCard.jsx
    │   │   └── SearchFilter.jsx
    │   ├── pages/
    │   │   ├── AddProperty.jsx
    │   │   ├── AdminDashboard.jsx
    │   │   ├── AgentDashboard.jsx
    │   │   ├── EditProperty.jsx
    │   │   ├── Home.jsx
    │   │   ├── Login.jsx
    │   │   ├── PropertyDetails.jsx
    │   │   ├── Register.jsx
    │   │   └── UserDashboard.jsx
    │   ├── store/
    │   │   ├── slices/
    │   │   │   ├── authSlice.js
    │   │   │   ├── propertySlice.js
    │   │   │   └── wishlistSlice.js
    │   │   └── store.js
    │   ├── utils/
    │   │   ├── axios.js
    │   │   ├── helpers.js
    │   │   └── imageFallbacks.js
    │   ├── App.jsx
    │   ├── index.css
    │   └── main.jsx
    ├── index.html
    ├── package.json
    ├── postcss.config.js
    ├── tailwind.config.js
    └── vite.config.js
```

---

## ⚙️ Local Setup

### Prerequisites

- Node.js v18+
- MongoDB Atlas account
- Cloudinary account

### 1. Install Dependencies

```bash
npm install
npm run install:all
```

### 2. Backend `.env`

```env
PORT=5000
MONGO_URI=mongodb+srv://<user>:<pass>@cluster.mongodb.net/realEstateDB
JWT_SECRET=your_super_secret_key_at_least_32_chars
JWT_EXPIRE=7d
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
NODE_ENV=development
CLIENT_URL=http://localhost:5173
```

### 2b. Frontend `.env.local`

For local development, create `frontend/.env.local` to point to your backend:

```env
VITE_API_URL=http://localhost:5000/api
```

For production (deployed backend), use:

```env
VITE_API_URL=https://real-estate-management-system-rh4j.onrender.com/api
```

### 3. Run Development

Single command from the project root:

```bash
npm run dev
```

This starts backend and frontend together.

```bash
# Backend only
npm run dev:backend

# Frontend only
npm run dev:frontend
```

- Frontend: http://localhost:5173
- Backend API: http://localhost:5000/api
- Health check: http://localhost:5000/api/health

---

## ☁️ Deployment Guide

### Backend → Render

1. Push `backend/` to a GitHub repo
2. Create a new **Web Service** on [render.com](https://render.com)
3. Connect repo, set **Build**: `npm install`, **Start**: `npm start`
4. Add the backend environment variables from the `.env` example above
5. Deploy → copy your Render URL

### Frontend → Vercel

1. Push `frontend/` to a GitHub repo
2. Import project on [vercel.com](https://vercel.com)
3. Framework preset: **Vite**
4. Add env var: `VITE_API_URL=https://your-render-url.onrender.com/api`
5. Deploy → get your live URL

### Database → MongoDB Atlas

1. Create cluster at [mongodb.com/atlas](https://cloud.mongodb.com)
2. Create database user
3. Whitelist IP: `0.0.0.0/0` (allow all for production)
4. Copy connection string → paste into `MONGO_URI`

### Images → Cloudinary

1. Sign up at [cloudinary.com](https://cloudinary.com)
2. Dashboard → copy Cloud Name, API Key, API Secret
3. Paste into backend environment variables

---

## 🔌 API Reference

### Auth

| Method | Endpoint             | Access  | Description       |
| ------ | -------------------- | ------- | ----------------- |
| POST   | `/api/auth/register` | Public  | Register new user |
| POST   | `/api/auth/login`    | Public  | Login & get token |
| GET    | `/api/auth/me`       | Private | Get current user  |
| PUT    | `/api/auth/profile`  | Private | Update profile    |

### Properties

| Method | Endpoint                      | Access      | Description             |
| ------ | ----------------------------- | ----------- | ----------------------- |
| GET    | `/api/properties`             | Public      | List all (with filters) |
| GET    | `/api/properties/:id`         | Public      | Property details        |
| POST   | `/api/properties`             | Agent/Admin | Create property         |
| PUT    | `/api/properties/:id`         | Agent/Admin | Update property         |
| DELETE | `/api/properties/:id`         | Agent/Admin | Delete property         |
| GET    | `/api/properties/agent/my`    | Agent       | Agent's own listings    |
| GET    | `/api/properties/admin/all`   | Admin       | All properties          |
| PUT    | `/api/properties/:id/approve` | Admin       | Approve/reject          |

### Wishlist

| Method | Endpoint                    | Access | Description     |
| ------ | --------------------------- | ------ | --------------- |
| GET    | `/api/wishlist`             | User   | Get wishlist    |
| POST   | `/api/wishlist/:propertyId` | User   | Add to wishlist |
| DELETE | `/api/wishlist/:propertyId` | User   | Remove          |

### Inquiries

| Method | Endpoint               | Access      | Description        |
| ------ | ---------------------- | ----------- | ------------------ |
| POST   | `/api/inquiries`       | User        | Send inquiry       |
| GET    | `/api/inquiries/my`    | User        | My sent inquiries  |
| GET    | `/api/inquiries/agent` | Agent       | Received inquiries |
| PUT    | `/api/inquiries/:id`   | Agent/Admin | Reply / update     |
| GET    | `/api/inquiries/admin` | Admin       | All inquiries      |

### Admin

| Method | Endpoint               | Access | Description    |
| ------ | ---------------------- | ------ | -------------- |
| GET    | `/api/admin/stats`     | Admin  | Platform stats |
| GET    | `/api/admin/users`     | Admin  | All users      |
| PUT    | `/api/admin/users/:id` | Admin  | Update user    |
| DELETE | `/api/admin/users/:id` | Admin  | Delete user    |

---

## 🔐 Default Demo Accounts

Use these credentials with the demo buttons on the login page:

- **User** → `demo@user.com` / `demo123`
- **Agent** → `demo@agent.com` / `demo123`
- **Admin** → `demo@admin.com` / `demo123`

> These accounts are created automatically when you run `npm run seed:properties` in `backend/`.

---

## 📜 License

MIT © EstateHub 2024
