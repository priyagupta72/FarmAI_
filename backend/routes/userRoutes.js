import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

const router = express.Router();

// ─── Validation ───────────────────────────────────────────────────────────────

const NAME_REGEX = /^[a-zA-Z\s'-]{2,50}$/;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,72}$/;

const validateRegister = (data) => {
  const errors = [];

  if (!data.firstName || !NAME_REGEX.test(data.firstName))
    errors.push("First name must be 2–50 letters only.");

  if (!data.lastName || !NAME_REGEX.test(data.lastName))
    errors.push("Last name must be 2–50 letters only.");

  if (!data.email || !EMAIL_REGEX.test(data.email))
    errors.push("Please enter a valid email address.");

  if (!data.password || !PASSWORD_REGEX.test(data.password))
    errors.push(
      "Password must be 8–72 characters and include uppercase, lowercase, a number, and a special character (@$!%*?&)."
    );

  return errors;
};

const validateLogin = (data) => {
  const errors = [];
  if (!data.email || !EMAIL_REGEX.test(data.email?.trim()))
    errors.push("Please enter a valid email address.");
  if (!data.password || data.password.trim().length < 1)
    errors.push("Password is required.");
  return errors;
};

// ─── Sanitize ─────────────────────────────────────────────────────────────────

const sanitizeRegisterBody = (body) => ({
  firstName: body.firstName?.trim().slice(0, 50),
  lastName: body.lastName?.trim().slice(0, 50),
  email: body.email?.trim().toLowerCase().slice(0, 254),
  password: body.password?.trim().slice(0, 72),
});

const sanitizeLoginBody = (body) => ({
  email: body.email?.trim().toLowerCase().slice(0, 254),
  password: body.password?.trim().slice(0, 72),
});

// ─── Register ─────────────────────────────────────────────────────────────────

router.post("/register", async (req, res) => {
  const sanitized = sanitizeRegisterBody(req.body);
  const errors = validateRegister(sanitized);

  if (errors.length > 0) {
    return res.status(422).json({ success: false, message: errors[0], errors });
  }

  try {
    const exists = await User.findOne({ email: sanitized.email }).lean();
    if (exists) {
      return res.status(409).json({
        success: false,
        message: "An account with this email already exists.",
      });
    }

    const hashedPassword = await bcrypt.hash(sanitized.password, 12);

    const user = await User.create({
      firstName: sanitized.firstName,
      lastName: sanitized.lastName,
      email: sanitized.email,
      password: hashedPassword,
    });

    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "7d", algorithm: "HS256" }
    );

    return res.status(201).json({
      success: true,
      message: "Account created successfully.",
      token,
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
      },
    });
  } catch (err) {
    // Mongoose duplicate key (race condition safety)
    if (err.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "An account with this email already exists.",
      });
    }
    return res.status(500).json({
      success: false,
      message: "Something went wrong. Please try again later.",
    });
  }
});

// ─── Login ────────────────────────────────────────────────────────────────────

router.post("/login", async (req, res) => {
  const sanitized = sanitizeLoginBody(req.body);
  const errors = validateLogin(sanitized);

  if (errors.length > 0) {
    return res.status(422).json({ success: false, message: errors[0], errors });
  }

  try {
    const user = await User.findOne({ email: sanitized.email }).select("+password");

    // Use constant-time comparison even for non-existent users (prevents timing attacks)
    const dummyHash = "$2a$12$invalidsaltthatisexactly22chars..invalid";
    const passwordToCheck = user ? user.password : dummyHash;
    const isMatch = await bcrypt.compare(sanitized.password, passwordToCheck);

    if (!user || !isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password.",
      });
    }

    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "7d", algorithm: "HS256" }
    );

    return res.status(200).json({
      success: true,
      token,
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
      },
    });
  } catch {
    return res.status(500).json({
      success: false,
      message: "Something went wrong. Please try again later.",
    });
  }
});

export default router;