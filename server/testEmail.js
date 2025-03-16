require("dotenv").config();
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

const mailOptions = {
    from: process.env.EMAIL_USER,
    to: "pavanteja.batthula@sasi.ac.in",  // Replace with your email to test
    subject: "Test Email from Node.js",
    text: "Hello! This is a test email from Tadepalligudem Online.",
};

transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
        console.error("❌ Error sending email:", error);
    } else {
        console.log("✅ Email sent successfully:", info.response);
    }
});
