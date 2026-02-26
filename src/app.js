

const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");

const authRoutes = require("./routes/auth.route");
const productRoutes = require("./routes/product.route");
const cartRoutes = require("./routes/cart.routes");
const orderRoutes = require("./routes/order.routes");

const app = express();

// 🔥 CORS FIRST
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://localhost:4173",
      "https://your-frontend-domain.vercel.app",
    ],
    credentials: true,
  })
);

// ✅ Explicitly handle preflight
app.options("*", cors());

// Then other middleware
app.use(express.json());
app.use(cookieParser());

// Then routes
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/orders", orderRoutes);

module.exports = app
