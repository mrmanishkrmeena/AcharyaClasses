const express = require("express");
const nodemailer = require("nodemailer");
const bodyParser = require("body-parser");
// const user = require('./models/db.js');
const path = require("path");
// require("dotenv").config();

const app = express();
const PORT = 4000;

// Middleware
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "public")));



// api for contact form submit ================
app.post("/send-email", async (req, res) => {

  const { name, email, phone, message } = req.body;

  // Backend validation to match front-end logic
  if (!name || !email || !phone || !message) {
    return res.status(400).json({ success: false, message: "Please fill in all required fields." });
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ success: false, message: "Invalid email format." });
  }

  if (!/^[0-9]{10}$/.test(phone)) {
    return res.status(400).json({ success: false, message: "Invalid phone number." });
  }

  console.log("Contact form submission:", name, email, phone, message);
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "manishkumarmeena23072003@gmail.com",
      pass: "kvtr akmr rmcy nnoo",
    },
  });

  const mailOptions = {
    from: "manishkumarmeena23072003@gmail.com",
    to: email,
    subject: "Thank You for Contacting Us",
    text: `Hi ${name},\n\nThank you for connecting with us. We will contact you soon.\n\nMessage: ${message}\n\n- Acharya Classes Team`,
  };

  const adminMailOptions = {
    from: "manishkumarmeena23072003@gmail.com",
    to: "manishm.ug20.ee@nitp.ac.in",
    subject: "New Contact Form Submission",
    text: `New contact form submission:\n\nName: ${name}\nEmail: ${email}\nPhone: ${phone}\nQuery: ${message}`,
  };

  try {
    await transporter.sendMail(mailOptions);
    await transporter.sendMail(adminMailOptions);
    res.status(200).json({ success: true, message: "Message sent successfully." });
  } catch (error) {
    console.error("Error sending email:", error);
    res.status(500).json({ success: false, message: "An error occurred while sending the email." });
  }
});


// API FOR REGISTRATION FORM SUBMIT =================

// api for form submit ================
app.post("/submit-form", async (req, res) => {
  const {
    fname,
    lname,
    email,
    phone_number,
    gender,
    age,
    dob,
    address,
    state,
    pincode,
    classSelection,
  } = req.body;

  // Backend validation
  if (!fname || !lname || !email || !phone_number || !gender || !age || !dob || !address || !state || !pincode) {
    return res.status(400).json({ success: false, message: "Please fill in all required fields." });
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ success: false, message: "Invalid email format." });
  }

  if (!/^[0-9]{10}$/.test(phone_number)) {
    return res.status(400).json({ success: false, message: "Invalid phone number." });
  }

  console.log("Form submission:", fname, lname, email, phone_number, gender, age, dob, address, state, pincode, classSelection);

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "manishkumarmeena23072003@gmail.com",
      pass: "kvtr akmr rmcy nnoo", // Replace with your email password
    },
  });

  // Email to the user
  const mailOptions = {
    from: "manishkumarmeena23072003@gmail.com",
    to: email,
    subject: "Thank You for Registering with Us",
    text: `Hi ${fname},\n\nThank you for registering with us! We will contact you soon.\n\n- Your Team`,
  };

  // Email to the admin
  const adminMailOptions = {
    from: "manishkumarmeena23072003@gmail.com",
    to: "manishm.ug20.ee@nitp.ac.in",  // Replace with the admin's email
    subject: "New Registration Form Submission",
    text: `New registration submission:\n\nName: ${fname} ${lname}\nEmail: ${email}\nPhone: ${phone_number}\nGender: ${gender}\nAge: ${age}\nDate of Birth: ${dob}\nAddress: ${address}\nState: ${state}\nPincode: ${pincode}\nClass: ${classSelection.join(", ")}`,
  };

  try {
    await transporter.sendMail(mailOptions);
    await transporter.sendMail(adminMailOptions);
    res.status(200).json({ success: true, message: "Registration details sent successfully." });
  } catch (error) {
    console.error("Error sending email:", error);
    res.status(500).json({ success: false, message: "An error occurred while sending the email." });
  }
});



// Serve main page
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

// Serve other static HTML pages dynamically
app.get("/:page", (req, res) => {
  res.sendFile(path.join(__dirname, req.params.page));
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
