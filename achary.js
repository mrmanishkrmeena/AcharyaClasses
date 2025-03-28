const express = require("express");
const nodemailer = require("nodemailer");
const bodyParser = require("body-parser");
const path = require("path");
const http = require("http");
require("dotenv").config();
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");

const app = express();
const PORT = 4000;
const server = http.createServer(app);

// Middleware
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "public")));
app.use(helmet()); // Security middleware

// Rate Limiter to prevent spam
const emailLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 requests per 15 minutes
  message: { success: false, message: "Too many requests, please try again later." }
});

// Email Configuration
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Contact Form API
app.post("/send-email", emailLimiter, async (req, res) => {
  const { name, email, phone, message } = req.body;

  if (!name || !email || !phone || !message) {
    return res.status(400).json({ success: false, message: "Please fill in all required fields." });
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ success: false, message: "Invalid email format." });
  }
  if (!/^[0-9]{10}$/.test(phone)) {
    return res.status(400).json({ success: false, message: "Invalid phone number." });
  }

  try {
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Thank You for Contacting Us",
      text: `Hi ${name},\n\nThank you for connecting with us. We will contact you soon.\n\n- Team`,
    });

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: "admin@example.com",
      subject: "New Contact Form Submission",
      text: `New contact form submission:\n\nName: ${name}\nEmail: ${email}\nPhone: ${phone}\nMessage: ${message}`,
    });

    res.status(200).json({ success: true, message: "Message sent successfully." });
  } catch (error) {
    console.error("Error sending email:", error);
    res.status(500).json({ success: false, message: "An error occurred while sending the email." });
  }
});

// Serve main page
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

// Restrict file access to `.html` only
app.get("/:page", (req, res) => {
  const page = req.params.page;
  if (!page.endsWith(".html")) {
    return res.status(403).send("Access denied");
  }
  res.sendFile(path.join(__dirname, page));
});

// Start the server
server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});

// Graceful shutdown
process.on("SIGINT", () => {
  console.log("Shutting down server...");
  server.close(() => {
    console.log("Server closed.");
    process.exit(0);
  });
});
