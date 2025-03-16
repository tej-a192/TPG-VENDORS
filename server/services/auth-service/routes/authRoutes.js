const express = require("express");
const { authTest } = require("../controllers/authController");
const requireAuth = require("../../../middleware/authMiddleware");

const router = express.Router();

router.get("/test", requireAuth, authTest);

module.exports = router;
