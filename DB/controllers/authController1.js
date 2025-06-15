import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { verifyGoogleToken } from "../utils/googleVerify1.js";
import { findUserByEmail, findUserByGoogleId, createUser } from "../models/userModel1.js";
import {pool} from "../config/database1.js";
const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret";

export const register = async (req, res) => {
  try {
    const {
      name,
      email,
      password_hash, // raw password from client (we will hash here)
      role,
      oauth_provider,
      oauth_id,
      is_active,
    } = req.body;

    // Check if user already exists
    const existingUser = await findUserByEmail(email);
    if (existingUser) {
      return res.status(400).json({ error: "User with this email already exists." });
    }

    // Hash password only if not OAuth registration
    let hashedPassword = null;
    // if (!oauth_provider || oauth_provider.toLowerCase() === "lms") {
    //   const saltRounds = 10;
    //   hashedPassword = await bcrypt.hash(password_hash, saltRounds);
    // }

    const user = await createUser({
      name,
      email,
      password_hash: hashedPassword,
      role,
      oauth_provider,
      oauth_id,
      is_active,
    });

    // Create JWT token
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    return res.status(201).json({ user, token });
  } catch (error) {
    console.error("Registration error:", error);
    return res.status(500).json({ error: "Server error during registration." });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await findUserByEmail(email);
    if (!user) {
      return res.status(400).json({ error: "Invalid email or password." });
    }

    if (!user.password_hash) {
      return res.status(400).json({ error: "Please login with Google OAuth." });
    }

    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(400).json({ error: "Invalid email or password." });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    return res.json({ user, token });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({ error: "Server error during login." });
  }
};

// Google OAuth login or registration by token

export const googleLogin = async (req, res) => {
  try {
    const { credential } = req.body;
    if (!credential) {
      return res.status(400).json({ error: "Google credential token is required." });
    }

    // Verify token
    const payload = await verifyGoogleToken(credential);

    const googleId = payload.sub;
    const email = payload.email;
    const name = payload.name;

    // Check if user exists by Google ID
    let user = await findUserByGoogleId(googleId);

    if (!user) {
      // If no user, check if user exists by email (maybe registered previously without google)
      user = await findUserByEmail(email);

      if (!user) {
        // Create new user with google info
        user = await createUser({
          name,
          email,
          password_hash: null,
          role: "student",
          oauth_provider: "google",
          oauth_id: googleId,
          is_active: true,
        });
      } else {
        // User exists but without google id, update to link google id
        const query = `
          UPDATE users SET oauth_provider = 'google', oauth_id = $1 WHERE email = $2
          RETURNING *
        `;
        const values = [googleId, email];
        const result = await pool.query(query, values);
        user = result.rows[0];
      }
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    return res.json({ user, token });
  } catch (error) {
    console.error("Google login error:", error);
    return res.status(500).json({ error: "Google login failed." });
  }
};
