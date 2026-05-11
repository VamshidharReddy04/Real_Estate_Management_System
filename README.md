# 🏠 EstateHub - Real Estate Management System

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
  - **Global Styles** - Centralized CSS in `App.css` with Tailwind directives and custom components

### Backend

- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **JWT** - Authentication
- **Cloudinary** - Image hosting
- **Multer** - File upload handling
- **Multer Cloudinary Storage** - Direct cloud upload integration
- **CORS** - Cross-origin requests

### Deployment

- **Vercel** - Frontend hosting
- **Render** - Backend hosting
- **MongoDB Atlas** - Database hosting

## 📁 Directory Structure

```
Real Estate Management System/
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
cd Real\ Estate\ Management\ System
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

````bash
cd ../frontend
npm install
cp .env.example .env.local
npm run dev
# Frontend runs on http://localhost:5173 (or next available port)

### 4. Seed Sample Data (Optional)

To populate the database with sample properties:

```bash
cd backend
node scripts/seedSampleProperties.js
# Output: Successfully seeded 12 properties
````

### 5. Demo Account Credentials

After seeding, use these test accounts:

| Role  | Email          | Password  |
| ----- | -------------- | --------- |
| Admin | admin@demo.com | Admin@123 |
| Agent | agent@demo.com | Agent@123 |
| User  | user@demo.com  | User@123  |

**Note:** Create these accounts manually in the app or update the seed script to create demo users.

````

## 🔐 Environment Variables

### Vercel Environment Variable Format
Use the exact backend API URL without a trailing slash. The frontend now normalizes the value automatically, but this format is the safest and recommended one.

### 🖼️ Cloudinary Setup

The application uses Cloudinary for reliable image hosting. To enable:

1. **Create Cloudinary Account**: Sign up at [cloudinary.com](https://cloudinary.com) (free tier available)
2. **Get Credentials**: Copy your Cloud Name, API Key, and API Secret from Dashboard
3. **Add to Backend `.env`**:
	 ```env
	 CLOUDINARY_CLOUD_NAME=your_cloud_name
	 CLOUDINARY_API_KEY=your_api_key
	 CLOUDINARY_API_SECRET=your_api_secret
	 ```
4. **Automatic Image Handling**: When agents upload properties, images are automatically uploaded to Cloudinary

**Image Storage Format**: All images stored as objects in MongoDB:
```json
{
	"url": "https://res.cloudinary.com/...",
	"public_id": "cloud_public_identifier"
}
````

**Backward Compatibility**: The app automatically converts string URLs to Cloudinary format using `normalizeImages()` in the API.

---

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

- Project Settings → Environment Variables (ensure no trailing slash)
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

### 📋 Detailed Render (Backend) Steps

1. **Create New Web Service**:
   - Go to https://render.com/dashboard
   - Click "New +" → "Web Service"
   - Connect GitHub account and select repository

2. **Configure Deployment**:
   - **Name**: `real-estate-management-backend`
   - **Root Directory**: `backend`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Instance Type**: Free (or Paid for production)

3. **Add Environment Variables** (Settings → Environment):

   ```
   MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/realEstateDB...
   PORT=5000
   NODE_ENV=production
   JWT_SECRET=your-32-char-secret-key
   JWT_EXPIRE=7d
   CLIENT_URL=https://your-frontend-url.vercel.app
   CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret
   ```

4. **Deploy**: Click "Deploy" and wait (~5 min)
5. **Copy URL**: Backend now accessible at `https://your-service.onrender.com`

### 📋 Detailed Vercel (Frontend) Steps

1. **Import Repository**:
   - Go to https://vercel.com/new
   - Click "Import Git Repository"
   - Select your GitHub repo

2. **Configure Project**:
   - **Project Name**: `real-estate-management-frontend`
   - **Framework**: `Vite`
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build` (auto-detected)
   - **Output Directory**: `dist` (auto-detected)

3. **Add Environment Variables** (Settings → Environment Variables):

   ```
   VITE_API_URL=https://your-service.onrender.com/api
   ```

4. **Deploy**: Click "Deploy" and wait (~2-3 min)
5. **Copy URL**: Frontend now accessible at `https://your-project.vercel.app`

### 🔗 Final Steps

1. **Update Backend URL**: In `backend/.env`, update:

   ```
   CLIENT_URL=https://your-project.vercel.app
   ```

2. **Redeploy Backend**: Push changes or manually trigger redeploy in Render
3. **Test**: Visit https://your-project.vercel.app and verify all features work

---

## ⚙️ Troubleshooting

### ✅ Verification Checklist

Before deploying, verify locally:

- [ ] Backend running: `curl http://localhost:5000/api/health` (or check server.js has health route)
- [ ] Frontend builds: `npm run build` succeeds in frontend/ without errors
- [ ] MongoDB connected: Seed script runs successfully
- [ ] Cloudinary working: Properties display images after seeding
- [ ] Login works: Can create account and login
- [ ] CORS not blocking: No "Access to XMLHttpRequest" errors in console

### 🐛 Common Issues & Solutions

**Properties not loading?**

- Check backend is running
- Verify `VITE_API_URL` in frontend
- Check MongoDB connection
- View browser console (F12) for errors
- **Local dev**: Ensure Vite proxy is configured (check `frontend/vite.config.js`)
- **Production**: Verify `VITE_API_URL` environment variable is set correctly in Vercel

**CORS errors?**

- Update `CLIENT_URL` in backend .env
- Match frontend URL exactly
- Redeploy backend
- Check backend `server.js` has CORS configured: `cors({ origin: process.env.CLIENT_URL })`

**Images not uploading?**

- Verify Cloudinary credentials
- Check account has active plan
- Confirm credentials in backend .env
- Test Cloudinary separately: `node scripts/seedSampleProperties.js`
- Check `console.log` in `propertyController.js` for upload errors
- Verify Cloudinary account quota not exceeded

**MongoDB connection fails?**

- Add your IP to MongoDB Atlas whitelist
- Use `0.0.0.0/0` for development only
- Verify connection string in MONGO_URI
- Test connection: `mongo "YOUR_MONGO_URI"`
- Check `.env` file is in correct location (`backend/.env`)
- Ensure `MONGO_URI` doesn't have special characters needing URL encoding

### 🚀 Performance Tips

- **Backend**: Use `NODE_ENV=production` on Render (reduces logging, faster)
- **Frontend**: Vercel caches static assets; CSS bundle should be <100KB
- **Database**: Add indexes to frequently queried fields for faster queries
- **Images**: Cloudinary auto-optimizes; consider using `q_auto,f_auto` in URLs for smaller payloads

## 🤝 Contributing

## 🏗️ Project Architecture

### Frontend Flow

1. **Entry**: `main.jsx` → mounts `App.jsx` to DOM
2. **Routing**: `App.jsx` uses React Router with private route protection
3. **State Management**: Redux Toolkit stores (`authSlice`, `propertySlice`, `wishlistSlice`)
4. **API Calls**: Axios wrapper in `utils/axios.js` with automatic token injection
5. **Styling**: Global styles in `App.css` (Tailwind + custom CSS)
6. **Components**: Reusable in `components/` (Navbar, Footer, PropertyCard, SearchFilter)
7. **Pages**: Role-based views in `pages/` (Admin, Agent, User dashboards)

### Backend Flow

1. **Entry**: `server.js` loads `.env` and connects to MongoDB/Cloudinary
2. **Database**: MongoDB models in `models/` (User, Property, Inquiry, Wishlist)
3. **Controllers**: Business logic in `controllers/` with image normalization
4. **Routes**: API endpoints in `routes/` with authentication middleware
5. **Auth**: JWT middleware in `middleware/auth.js` protects routes
6. **File Upload**: Multer + Cloudinary in image upload endpoints
7. **Seed Data**: `scripts/seedSampleProperties.js` populates 12 demo properties

### Image Handling Pipeline

```
User Uploads Image
	↓
Multer captures file
	↓
Multer Cloudinary Storage uploads to cloud
	↓
API returns {url, public_id}
	↓
Frontend receives URL and displays
	↓
normalizeImages() ensures consistency
```

### Database Schema

**User**: `{email, password, role, name, phone}`
**Property**: `{title, description, location, price, images[], agentId, status}`
**Inquiry**: `{propertyId, userId, message, status}`
**Wishlist**: `{userId, propertyId}`

---

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

## 🧪 Testing Guide

### Manual Testing Checklist

**Authentication**:

- [ ] Register new user account
- [ ] Login with credentials
- [ ] Token stored in localStorage
- [ ] Logout clears token
- [ ] Protected routes redirect to login

**Properties**:

- [ ] Browse all properties on home page
- [ ] Search/filter by location and type
- [ ] Click property card to view details
- [ ] Images load correctly from Cloudinary
- [ ] Agent can add new property with images
- [ ] Admin can approve/reject properties

**Wishlist**:

- [ ] User can add properties to wishlist
- [ ] Wishlist persists on page refresh
- [ ] User can view wishlist page
- [ ] Remove from wishlist works

**Inquiries**:

- [ ] User can submit inquiry on property
- [ ] Inquiry shows in user dashboard
- [ ] Agent receives inquiries for their properties

### Automated Testing (Future)

Consider adding:

- Jest for unit tests (controllers, utils)
- React Testing Library for component tests
- Supertest for API endpoint tests
- E2E tests with Cypress or Playwright

---

## 📦 Version Information

| Component | Version | Status    |
| --------- | ------- | --------- |
| Node.js   | 16+     | ✅ Tested |
| React     | 18.x    | ✅ Latest |
| Vite      | Latest  | ✅ Latest |
| Tailwind  | 3.x     | ✅ Latest |
| Express   | 4.x     | ✅ Stable |
| MongoDB   | Latest  | ✅ Atlas  |

---

## 📋 Quick Reference

### Commands Cheat Sheet

```bash
# Backend
cd backend && npm install                   # Install dependencies
npm start                                   # Run server (port 5000)
npm run seed                                # Populate sample data

# Frontend
cd frontend && npm install                  # Install dependencies
npm run dev                                 # Dev server (port 5173)
npm run build                               # Production build
npm run preview                             # Preview build locally

# Git
git status                                  # Check changes
git add -A && git commit -m "message"       # Commit changes
git push origin main                        # Push to GitHub
```

### Environment Variables Quick Copy

**Backend `.env`** (minimum):

```env
MONGO_URI=mongodb+srv://user:pass@cluster.mongodb.net/realEstateDB
JWT_SECRET=your-random-32-char-secret-key-here
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
NODE_ENV=development
```

**Frontend `.env.local`** (local dev only):

```env
# No variables needed for local dev (uses Vite proxy)
# For production, Vercel env var is: VITE_API_URL
```

## 📄 License

MIT License - See LICENSE file for details

## 👨‍💻 Author

**Vamshidhar Reddy**

- GitHub: [@VamshidharReddy04](https://github.com/VamshidharReddy04)

---

**Ready to deploy? Follow the Quick Start guide above!** 🚀
