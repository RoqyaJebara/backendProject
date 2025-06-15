import express from "express";
import { register, login, googleLogin } from "../controllers/authController1.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/google/token", googleLogin);

export default router;
