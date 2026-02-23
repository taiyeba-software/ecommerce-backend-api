# 🌸 Rajkonna Backend API

Production-ready backend for the Rajkonna E-commerce Platform, built with Node.js, Express, MongoDB, and Redis.

This backend powers product management, authentication, orders, cart functionality, and image handling — and is fully deployed on Render.

## 🌐 Live API Base URL

**https://backend-rajkonna.onrender.com**

Example:
```
GET https://backend-rajkonna.onrender.com/api/products
```

## 🚀 Project Overview

Rajkonna Backend is a RESTful API designed with scalability, clean architecture, and production deployment in mind.

It follows:
- Modular architecture
- Separation of concerns
- Environment-based configuration
- Cloud-ready deployment strategy

The application is fully deployed and serving real production data.

## 🏗️ Architecture

### High-Level Architecture
```
Client (Frontend)
        ↓
Render (Cloud Hosting)
        ↓
Express.js API Layer
        ↓
MongoDB Atlas (Database)
        ↓
Redis (Caching Layer)
        ↓
ImageKit (Media Storage)
```

### 🔹 Layered Architecture Design

The backend follows a modular layered structure:

**Routes → Controllers → Services → Models → Database**

#### 1️⃣ Routes Layer
Defines API endpoints and maps them to controllers.

#### 2️⃣ Controllers Layer
Handles request/response logic and delegates business logic to services.

#### 3️⃣ Services Layer
Contains core business logic (Redis caching, ImageKit integration, etc.).

#### 4️⃣ Models Layer
Defines MongoDB schemas using Mongoose.

#### 5️⃣ Middleware Layer
Handles:
- Authentication (JWT)
- Role-based authorization
- Validation
- Error handling

This separation makes the system:
- ✅ Maintainable
- ✅ Scalable
- ✅ Testable
- ✅ Interview-friendly

## 🛠 Tech Stack

### Runtime & Framework
- Node.js
- Express.js

### Database
- MongoDB Atlas (Cloud)
- Mongoose ODM

### Caching
- Redis (Cloud-ready configuration)

### Authentication
- JWT (JSON Web Tokens)
- bcryptjs (password hashing)

### File & Media Handling
- ImageKit (cloud image storage + CDN)

### Validation & Testing
- express-validator
- Jest + Supertest

## 🔐 Security Considerations

- ✅ Passwords hashed with bcrypt
- ✅ JWT-based stateless authentication
- ✅ Environment variables for secrets
- ✅ Role-based authorization for admin routes
- ✅ Input validation on all critical endpoints
- ✅ No sensitive data exposed in production

## ⚙️ Deployment Strategy (Render)

This backend is configured to be deployment-friendly and cloud-ready.

### Why It Deploys Cleanly:
- ✅ Uses environment variables (no hardcoded secrets)
- ✅ Uses `process.env.PORT` for dynamic port binding
- ✅ MongoDB Atlas cloud connection (SRV URI)
- ✅ Redis URL configurable via environment
- ✅ Production-safe build command (`npm install`)
- ✅ Separate root route handling

### Render Configuration
**Build Command:**
```bash
npm install
```

**Start Command:**
```bash
node server.js
```

**Node Version:** Auto-detected (can be specified if needed)

## 🌍 Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
PORT=5000
MONGO_URI=your_mongodb_srv_connection
JWT_SECRET=your_jwt_secret
REDIS_URL=your_redis_url
IMAGEKIT_PUBLIC_KEY=your_key
IMAGEKIT_PRIVATE_KEY=your_key
IMAGEKIT_URL_ENDPOINT=your_endpoint
```

**In production**, these are configured inside Render's Environment Settings.

### Variable Explanations

- `PORT`: The port on which the server will run (default: 5000)
- `MONGO_URI`: MongoDB connection string (use MongoDB Atlas SRV URI for production)
- `JWT_SECRET`: Secret key for JWT token generation
- `REDIS_URL`: Redis connection URL
- `IMAGEKIT_PUBLIC_KEY`: Public key for ImageKit
- `IMAGEKIT_PRIVATE_KEY`: Private key for ImageKit
- `IMAGEKIT_URL_ENDPOINT`: ImageKit URL endpoint for image access

## � Local Development Setup

### 1️⃣ Clone the Repository
```bash
git clone https://github.com/taiyeba-software/Backend-Rajkonna
cd Backend-Rajkonna
```

### 2️⃣ Install Dependencies (Clean Install Recommended)
For a clean and consistent installation:
```bash
npm ci
```

If `package-lock.json` is not present:
```bash
npm install
```

### 3️⃣ Install Development Dependencies
Install nodemon for development:
```bash
npm install --save-dev nodemon
```

### 4️⃣ Configure Environment Variables
Create a `.env` file in the root directory:
```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
REDIS_URL=your_redis_url
IMAGEKIT_PUBLIC_KEY=your_key
IMAGEKIT_PRIVATE_KEY=your_key
IMAGEKIT_URL_ENDPOINT=your_endpoint
```

### 5️⃣ Run the Development Server
```bash
npm run dev
```

Server will start at:
```
http://localhost:5000
```

## 🧪 Testing

Run the test suite:
```bash
npm test
```

Uses Jest + Supertest for endpoint testing.

## 📦 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout

### Products
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get product by ID
- `POST /api/products` - Create new product (Admin)
- `PUT /api/products/:id` - Update product (Admin)
- `DELETE /api/products/:id` - Delete product (Admin)

### Orders
- `GET /api/orders` - Get user orders
- `GET /api/orders/:id` - Get order by ID
- `POST /api/orders` - Create new order

### Cart
- `GET /api/cart` - Get user cart
- `POST /api/cart` - Add item to cart
- `PUT /api/cart/:id` - Update cart item
- `DELETE /api/cart/:id` - Remove item from cart

## 📁 Project Structure

```
rajkonna-backend/
├── src/
│   ├── app.js                 # Express app setup
│   ├── controllers/           # Route controllers
│   ├── services/              # External services (Redis, ImageKit)
│   ├── routes/                # API routes
│   ├── models/                # Mongoose models
│   ├── middlewares/           # Custom middlewares
│   ├── validators/            # Input validation
│   └── db/                    # Database connection
├── tests/                     # Test files
├── server.js                  # Server entry point
├── package.json               # Dependencies and scripts
└── README.md                  # This file
```

## 🧠 Scalability Considerations

- ✅ Stateless authentication (JWT)
- ✅ Redis caching layer
- ✅ Cloud MongoDB
- ✅ CDN-based image hosting (ImageKit)
- ✅ Modular code structure
- ✅ Ready for horizontal scaling

## 💡 Key Engineering Decisions

- Used SRV MongoDB URI for cloud compatibility
- Avoided local-only configurations
- Configured dynamic PORT for hosting platforms
- Clean separation between business logic and routing
- Used environment-based config for production readiness

## 🎯 What Makes This Interview-Ready?

- ✅ Fully deployed production API
- ✅ Cloud database integration
- ✅ Caching layer implementation
- ✅ Clean layered architecture
- ✅ Secure authentication flow
- ✅ Real-world e-commerce logic
- ✅ CI-friendly and environment-driven setup

**This is not just a backend — it's a production-ready service.**

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new features
5. Run tests: `npm test`
6. Submit a pull request

## 📌 Quick Commands

- **Start development server**: `npx nodemon server.js`
- **Run tests**: `npm test`
- **Install dependencies**: `npm install`

## 📄 License

This project is licensed under the ISC License.

---

**Built with ❤️ for Rajkonna E-commerce Platform**

