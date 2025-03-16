const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Otp = require("../models/Otp");
const sendEmail = require("../utils/emailService");

// 🔹 Register User
exports.register = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Check if user exists
        let user = await User.findOne({ email });
        if (user) return res.status(400).json({ message: "User already exists" });

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create new user
        user = new User({ name, email, password: hashedPassword });
        await user.save();

        // Generate token
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });

        res.json({ message: "User registered successfully", token });
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
};

// 🔹 Login User
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find user
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: "Invalid credentials" });

        // Compare passwords
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

        // Generate token
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });

        res.json({ message: "Login successful", token });
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
};


// 🔹 Register User & Send OTP
exports.register = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        let user = await User.findOne({ email });
        if (user) return res.status(400).json({ message: "User already exists" });

        // Generate OTP
        const otpCode = Math.floor(100000 + Math.random() * 900000).toString();

        // Save OTP in DB
        await Otp.create({ email, otp: otpCode });

        // Send OTP via email
        await sendEmail(email, "Verify Your Account", `Your OTP is: ${otpCode}`);

        res.json({ message: "OTP sent successfully. Please verify your account." });
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
};

// 🔹 Verify OTP & Register User
exports.verifyOtp = async (req, res) => {
    try {
        const { email, otp } = req.body;

        // Find OTP in DB
        const otpRecord = await Otp.findOne({ email, otp });
        if (!otpRecord) return res.status(400).json({ message: "Invalid or expired OTP" });

        // Delete OTP after verification
        await Otp.deleteOne({ email, otp });

        // Hash password & create user
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        const user = await User.create({ name: req.body.name, email, password: hashedPassword });

        // Generate JWT Token
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });

        res.json({ message: "Registration successful", token });
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
};


// 🔹 Send OTP for Password Reset
exports.sendResetOtp = async (req, res) => {
    try {
        const { email } = req.body;

        let user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: "User not found" });

        // Generate OTP
        const otpCode = Math.floor(100000 + Math.random() * 900000).toString();

        // Save OTP in DB
        await Otp.create({ email, otp: otpCode });

        // Send OTP via email
        await sendEmail(email, "Reset Your Password", `Your OTP is: ${otpCode}`);

        res.json({ message: "OTP sent for password reset" });
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
};

// 🔹 Verify OTP & Reset Password
exports.resetPassword = async (req, res) => {
    try {
        const { email, otp, newPassword } = req.body;

        // Find OTP in DB
        const otpRecord = await Otp.findOne({ email, otp });
        if (!otpRecord) return res.status(400).json({ message: "Invalid or expired OTP" });

        // Delete OTP after verification
        await Otp.deleteOne({ email, otp });

        // Hash new password & update user
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        await User.findOneAndUpdate({ email }, { password: hashedPassword });

        res.json({ message: "Password reset successful" });
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
};
