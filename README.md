# 🏠 Estatehub - Estatehub Management System

A modern, full-stack real estate platform for buying, selling, and renting properties across India. Built with React, Node.js/Express, and MongoDB with cloud deployment on Vercel and Render.

## ✨ Features

- **Property Listings**: Browse verified properties with detailed information, images, and pricing
- **Advanced Search & Filters**: Search by location, type (apartment, house, villa, commercial), price range, and other criteria
- **User Authentication**: Secure registration and login with JWT authentication
- **Agent Dashboard**: Agents can add, edit, and manage their properties
- **Admin Panel**: Administrators can approve/reject property listings
- **Wishlist**: Users can save favorite properties
- **Inquiries**: Interested buyers can submit inquiries
- **Image Management**: Cloudinary integration for reliable image hosting
- **Responsive Design**: Fully responsive UI with Tailwind CSS
- **Role-Based Access**: Different dashboards for Users, Agents, and Admins

## 🛠️ Tech Stack

### Frontend

- **React 18** - UI framework
- **Redux Toolkit** - State management
- **React Router DOM** - Client-side routing
- **Axios** - HTTP client
- **Tailwind CSS** - Styling
- **Vite** - Build tool
- **React Hot Toast** - Notifications

### Backend

- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **JWT** - Authentication
- **Cloudinary** - Image hosting
- **CORS** - Cross-origin requests

### Deployment

- **Vercel** - Frontend hosting
- **Render** - Backend hosting
- **MongoDB Atlas** - Database hosting

## 📁 Directory Structure

```
Estatehub Management System/
├── frontend/                      # React + Vite frontend
│   ├── src/
│   │   ├── components/           # Reusable components
│   │   │   ├── Navbar.jsx
│   │   │   ├── Footer.jsx
│   │   │   ├── PropertyCard.jsx
│   │   │   └── SearchFilter.jsx
│   │   ├── pages/                # Page components
│   │   │   ├── Home.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── PropertyDetails.jsx
│   │   │   ├── AddProperty.jsx
│   │   │   ├── EditProperty.jsx
│   │   │   ├── AdminDashboard.jsx
│   │   │   ├── AgentDashboard.jsx
│   │   │   └── UserDashboard.jsx
│   │   ├── store/                # Redux store
│   │   │   └── slices/
│   │   │       ├── authSlice.js
│   │   │       ├── propertySlice.js
│   │   │       └── wishlistSlice.js
│   │   ├── utils/
│   │   │   ├── axios.js
│   │   │   ├── helpers.js
│   │   │   └── imageFallbacks.js
│   │   ├── App.jsx
│   │   └── index.css
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.js
│   ├── vercel.json
│   └── .env.example
│
├── backend/                       # Express.js backend
│   ├── config/                   # Configuration
│   │   ├── db.js
│   │   └── cloudinary.js
│   ├── models/                   # MongoDB schemas
│   │   ├── User.js
│   │   ├── Property.js
│   │   ├── Inquiry.js
│   │   └── Wishlist.js
│   ├── controllers/              # Request handlers
│   │   ├── authController.js
│   │   ├── propertyController.js
│   │   ├── inquiryController.js
│   │   ├── wishlistController.js
│   │   └── adminController.js
│   ├── routes/                   # API routes
│   │   ├── auth.js
│   │   ├── properties.js
│   │   ├── inquiries.js
│   │   ├── wishlist.js
│   │   └── admin.js
│   ├── middleware/
│   │   └── auth.js
│   ├── server.js
│   ├── package.json
│   └── .env.example
│
├── package.json
└── README.md
```

## 📋 Prerequisites

- **Node.js** v16+
- **npm** or **yarn**
- **MongoDB Atlas** account (free tier available at [mongodb.com](https://mongodb.com))
- **Cloudinary** account (free tier available at [cloudinary.com](https://cloudinary.com))
- **Git**

## 🚀 Quick Start

### 1. Clone Repository

```bash
git clone https://github.com/VamshidharReddy04/Real_Estate_Management_System.git
cd Real_Estate_Management_System
```

### 2. Backend Setup

```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your credentials (see Environment Variables below)
npm start
# Backend runs on http://localhost:5000
```

### 3. Frontend Setup

```bash
cd ../frontend
npm install
cp .env.example .env.local
npm run dev
# Frontend runs on http://localhost:5173 (or next available port)
```

## 🔐 Environment Variables

### ONE-FILE SETUP

**Backend** - Copy example to actual `.env`:

```bash
cd backend
cp .env.example .env
```

**Edit `backend/.env`** with your credentials:

```env
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/realEstateDB?retryWrites=true&w=majority
PORT=5000
NODE_ENV=production
JWT_SECRET=generate_a_random_string_minimum_32_characters
JWT_EXPIRE=7d
CLIENT_URL=https://your-vercel-frontend-url.vercel.app
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

**Frontend** - Copy example to `.env.local`:

```bash
cd frontend
cp .env.example .env.local
```

That's it! **No need to edit** - uses `/api` proxy for local development.

**Production (Vercel)** - Set only in Vercel Dashboard:

- Project Settings → Environment Variables
- Add: `VITE_API_URL=https://your-render-backend.onrender.com/api`
- Redeploy automatically uses this

**Why?**

- Local dev: `.env.local` uses Vite proxy to localhost:5000
- Production: Vercel uses dashboard environment variable
- No need for multiple .env files!

**Getting Credentials:**

- MongoDB: [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
- Cloudinary: [Cloudinary](https://cloudinary.com/)
- JWT_SECRET: `openssl rand -base64 32`

## 🏃 Running the Application

### Development

**Start Backend** (Terminal 1):

```bash
cd backend
npm start
```

**Start Frontend** (Terminal 2):

```bash
cd frontend
npm run dev
```

Frontend: http://localhost:5173
Backend: http://localhost:5000

### Production Build

```bash
cd frontend
npm run build    # Creates optimized build in dist/
```

## 🌐 Live Deployment

| Component | Platform | URL                                                                           |
| --------- | -------- | ----------------------------------------------------------------------------- |
| Frontend  | Vercel   | https://real-estate-management-system-n-vamshidhar-reddys-projects.vercel.app |
| Backend   | Render   | https://real-estate-management-system-rh4j.onrender.com                       |

## 📡 API Endpoints

### Auth

- `POST /api/auth/register` - Register user
- `POST /api/auth/login` - Login user

### Properties

- `GET /api/properties` - List all properties
- `GET /api/properties/:id` - Get property details
- `POST /api/properties` - Create property (agents)
- `PUT /api/properties/:id` - Update property (agents)
- `DELETE /api/properties/:id` - Delete property (agents)
- `PUT /api/properties/:id/approve` - Approve property (admin)

### Wishlist

- `GET /api/wishlist` - Get wishlist
- `POST /api/wishlist/:propertyId` - Add to wishlist
- `DELETE /api/wishlist/:propertyId` - Remove from wishlist

### Inquiries

- `POST /api/inquiries` - Send inquiry
- `GET /api/inquiries/my` - Get my inquiries

## 🔄 Deployment Steps

### Deploy Backend to Render

1. Push code to GitHub
2. Go to [render.com](https://render.com) and create new Web Service
3. Connect GitHub repository
4. Build Command: `npm install`
5. Start Command: `npm start`
6. Add environment variables from `.env.example`
7. Deploy and copy URL

### Deploy Frontend to Vercel

1. Go to [vercel.com](https://vercel.com) and import GitHub repo
2. Set environment variable: `VITE_API_URL=https://your-render-url/api`
3. Deploy
4. Update `CLIENT_URL` in backend and redeploy

## ⚙️ Troubleshooting

**Properties not loading?**

- Check backend is running
- Verify `VITE_API_URL` in frontend
- Check MongoDB connection
- View browser console (F12) for errors

**CORS errors?**

- Update `CLIENT_URL` in backend .env
- Match frontend URL exactly
- Redeploy backend

**Images not uploading?**

- Verify Cloudinary credentials
- Check account has active plan
- Confirm credentials in backend .env

**MongoDB connection fails?**

- Add your IP to MongoDB Atlas whitelist
- Use `0.0.0.0/0` for development only
- Verify connection string in MONGO_URI

## 🤝 Contributing

1. Fork repository
2. Create feature branch: `git checkout -b feature/YourFeature`
3. Commit: `git commit -m 'Add YourFeature'`
4. Push: `git push origin feature/YourFeature`
5. Open Pull Request

## ⚠️ Security Notes

- Never commit `.env` files (already in .gitignore)
- Use strong `JWT_SECRET` (minimum 32 characters)
- Rotate credentials if exposed
- Keep dependencies updated
- Use HTTPS in production
- Whitelist MongoDB IPs carefully

## 📄 License

MIT License - See LICENSE file for details

## 👨‍💻 Author

**Vamshidhar Reddy**

- GitHub: [@VamshidharReddy04](https://github.com/VamshidharReddy04)

---

**Ready to deploy? Follow the Quick Start guide above!** 🚀
