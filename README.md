# 🚀 Investa — Full-Stack Investment Blog Platform

A dynamic investment blogging platform with a **React** frontend, **Node.js/Express** backend, and **MongoDB** database.

---

## 📁 Project Structure

```
Investa/
├── client/               # React frontend (CRA)
│   ├── src/
│   │   ├── components/   # Navbar, Sidebar
│   │   ├── pages/        # All page components
│   │   └── services/
│   │       └── api.js    # Axios API service (all API calls here)
│   ├── .env              # Frontend environment variables
│   └── vercel.json       # Vercel deployment config
│
└── server/               # Node.js/Express backend
    ├── controllers/      # Business logic
    ├── models/           # Mongoose schemas
    ├── routes/           # Express route definitions
    ├── middleware/        # Auth middleware (JWT)
    ├── database.js        # MongoDB connection
    ├── server.js         # Express app entry point
    ├── .env              # Server environment variables
    └── render.json       # Render deployment config
```

---

## 🌐 API Endpoints

### Auth
| Method | Endpoint              | Access  | Description             |
|--------|-----------------------|---------|-------------------------|
| POST   | `/api/register`       | Public  | Register new user       |
| POST   | `/api/login`          | Public  | Login & get JWT token   |
| GET    | `/api/profile`        | Private | Get user profile        |
| PUT    | `/api/profile`        | Private | Update user profile     |
| PUT    | `/api/change-password`| Private | Change password         |

### Blog / Articles (Full CRUD)
| Method | Endpoint              | Access  | Description             |
|--------|-----------------------|---------|-------------------------|
| GET    | `/api/articles`       | Public  | Get all articles (supports `?search=` `?category=`) |
| GET    | `/api/articles/:id`   | Public  | Get single article      |
| POST   | `/api/articles`       | Private | Create new article      |
| PUT    | `/api/articles/:id`   | Private | Update article          |
| DELETE | `/api/articles/:id`   | Private | Delete article          |

### Investment Ideas
| Method | Endpoint                   | Access  | Description             |
|--------|----------------------------|---------|-------------------------|
| GET    | `/api/investment-ideas`    | Public  | Get all ideas (supports `?search=` `?riskLevel=`) |

### Goals
| Method | Endpoint          | Access  | Description             |
|--------|-------------------|---------|-------------------------|
| GET    | `/api/goals`      | Private | Get user's goals        |
| POST   | `/api/goals`      | Private | Create a goal           |
| PUT    | `/api/goals/:id`  | Private | Update a goal           |
| DELETE | `/api/goals/:id`  | Private | Delete a goal           |

### Recommendations
| Method | Endpoint                          | Access  | Description              |
|--------|-----------------------------------|---------|--------------------------|
| GET    | `/api/recommendations/:profile`   | Public  | Get recommendations by profile type |

---

## 🖥️ Running Locally

### Prerequisites
- Node.js >= 18
- MongoDB (local) **OR** MongoDB Atlas account

### 1. Clone & Install

```bash
# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install
```

### 2. Configure Environment Variables

**Server** (`server/.env`):
```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/investa
JWT_SECRET=your_super_secret_jwt_key_here
NODE_ENV=development
```

**Client** (`client/.env`):
```env
REACT_APP_API_URL=http://localhost:5000/api
```

### 3. Start MongoDB (Local)
```bash
# Windows
net start MongoDB

# macOS/Linux
sudo service mongod start
# or
mongod
```

### 4. Run the Server
```bash
cd server
npm run dev   # Development with nodemon (auto-reload)
# or
npm start     # Production
```
Server runs at: **http://localhost:5000**
Health check: **http://localhost:5000/**

### 5. Run the Client
```bash
cd client
npm start
```
App runs at: **http://localhost:3000**

---

## 📡 Real-Time Updates

The app polls the backend every **30 seconds** to fetch new articles/data automatically — no manual refresh required. Newly published articles appear within 30 seconds on all connected clients.

---

## 🔑 Admin / Content Management

The Articles page includes a built-in admin panel:

1. **Log in** — Register/login with any account
2. **Toggle Admin Mode** — Click the "Admin" button in the Investment Library header
3. **Create Posts** — Click "New Post" to open the blog editor form
4. **Edit Posts** — Hover any card → click the ✏️ edit icon
5. **Delete Posts** — Hover any card → click the 🗑️ delete icon

> **Note:** Create/Edit/Delete operations require a valid JWT token (you must be logged in).

---

## 🔍 Search & Filtering

- **Search**: Use the Navbar search or append `?search=keyword` to `/articles` or `/investment-ideas`
- **Category Filter**: Use the tab bar on the Articles page (Stocks, ETFs, Crypto, Real Estate, Bonds, General)
- **Risk Filter**: Use the tab bar on the Investment Ideas page (Low / Medium / High Risk)

---

## ☁️ Deployment

### Frontend → Vercel

1. Push `client/` to a GitHub repo (or the whole monorepo)
2. Go to [vercel.com](https://vercel.com) → New Project → Import repo
3. Set **Root Directory** to `client`
4. Add **Environment Variable**:
   - `REACT_APP_API_URL` = `https://your-backend.onrender.com/api`
5. Deploy ✅

### Backend → Render

1. Go to [render.com](https://render.com) → New Web Service
2. Connect your GitHub repo
3. Set **Root Directory** to `server`
4. Set **Build Command**: `npm install`
5. Set **Start Command**: `node server.js`
6. Add **Environment Variables**:
   - `MONGO_URI` = your MongoDB Atlas connection string
   - `JWT_SECRET` = a long random string
   - `NODE_ENV` = `production`
   - `CORS_ORIGIN` = `https://your-app.vercel.app`
7. Deploy ✅

### Database → MongoDB Atlas

1. Go to [mongodb.com/atlas](https://www.mongodb.com/atlas)
2. Create a free cluster (M0 Sandbox)
3. Create a database user (username + password)
4. Whitelist all IPs: `0.0.0.0/0` (for Render's dynamic IPs)
5. Click **Connect → Drivers** → copy the connection string
6. Replace `<password>` and set as `MONGO_URI` in Render environment variables

**Atlas URI format:**
```
mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/investa?retryWrites=true&w=majority
```

---

## 🧱 Blog Post Schema

```js
{
  title: String,         // required
  content: String,       // required - full article text
  summary: String,       // optional - shown on article cards
  author: String,        // required
  category: String,      // stocks | etf | crypto | real_estate | bonds | general
  tags: [String],        // array of tag strings
  imageUrl: String,      // optional - URL to cover image
  readTime: Number,      // minutes (default: 5)
  likes: Number,         // default: 0
  createdAt: Date,       // auto-generated
  updatedAt: Date        // auto-updated
}
```

---

## 🛡️ Error Handling

- **Loading states**: Spinner shown while fetching data
- **API errors**: User-friendly alert banners with retry messaging  
- **Empty states**: Visual empty state with "Clear Filters" CTA
- **401 errors**: Stale JWT tokens are automatically cleared, preventing broken states
- **Form validation**: Create/Edit form requires Title, Content, and Author before submitting

---

## 🔧 Tech Stack

| Layer      | Technology                    |
|------------|-------------------------------|
| Frontend   | React 19, MUI v7, React Router v7 |
| HTTP Client| Axios (with interceptors)     |
| Backend    | Node.js, Express 4            |
| Auth       | JWT (30-day tokens), bcryptjs |
| Database   | MongoDB + Mongoose            |
| Dev Tools  | nodemon, dotenv               |
| Deployment | Vercel (frontend), Render (backend), MongoDB Atlas (DB) |
