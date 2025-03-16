require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const requireAuth = require("./middleware/authMiddleware"); // Clerk Middleware
const authRoutes = require("./services/auth-service/routes/authRoutes");
const { authTest } = require("../controllers/authController");

// Import Routes
// const authRoutes = require("./services/auth-service/routes/authRoutes");
// const vendorRoutes = require("./services/vendor-service/routes/vendorRoutes");
// const productRoutes = require("./services/product-service/routes/productRoutes");
// const orderRoutes = require("./services/order-service/routes/orderRoutes");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Connect Database
connectDB();

// Routes
// app.use("/api/auth", authRoutes);
// app.use("/api/vendors", requireAuth, vendorRoutes);
// app.use("/api/products", requireAuth, productRoutes);
// app.use("/api/orders", requireAuth, orderRoutes);
router.get("/test", requireAuth, authTest);


// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
