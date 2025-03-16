const mongoose = require("mongoose");

// Check if the model exists, if not, define it
const User = mongoose.models.User || mongoose.model("User", new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }
}, { timestamps: true }));

module.exports = User;
