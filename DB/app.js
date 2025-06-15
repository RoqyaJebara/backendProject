import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import { notFound, errorHandler } from "./middleware/error.js";
import "./config/db.js";
import session from "express-session";
import cookieParser from "cookie-parser";
////////////////////////////////////////////
import authRoutes1 from "./routes/authRoutes1.js";

import authRoutes from "./routes/authRoutes.js";
import usersRouter from "./routes/usersRoutes.js";
import categoryRoutes from "./routes/categoryRoutes.js";
import courseRoutes from "./routes/courseRoutes.js";
import lessonRoutes from "./routes/lessonRoutes.js";
import moduleRoutes from "./routes/moduleRoutes.js";
import quizRoutes from "./routes/quizRoutes.js";
import questionRoutes from "./routes/questionRoutes.js";
import  EnrollmentController from './controllers/enrollmentController.js';
import  submissionRoutes from './routes/submissionRoutes.js';
import { enrollmentRoutes } from './routes/enrollmentRoutes.js';
import { query } from './config/db.js';
import { EnrollmentModel } from './models/enrollmentModel.js';
import AnalyticRoutes from './routes/analyticRoutes.js';
const app = express();
app.use("/uploads", express.static("uploads"));

// Security middleware
app.use(helmet());

app.use(
  cors({
    origin: "http://localhost:3000", // السماح من واجهة React
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Logging
app.use(morgan(process.env.NODE_ENV === "production" ? "combined" : "dev"));

// Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cookieParser());
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === "production",
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000, 
      sameSite: "strict",
    },
  })
);


const enrollmentModel = new EnrollmentModel(query);
const enrollmentController = new EnrollmentController(enrollmentModel);
app.use((req, res, next) => {
  res.setHeader('Cache-Control', 'no-store');
  next();
});
app.use('/enrollments', enrollmentRoutes(enrollmentController));

// Routes
app.use("/api/auth1", authRoutes1);//google
app.use("/api/auth", authRoutes);//normal
app.use("/users", usersRouter);
app.use("/categories", categoryRoutes);
app.use("/courses", courseRoutes);
app.use("/modules", moduleRoutes);
app.use("/lessons", lessonRoutes);
app.use("/quizzes", quizRoutes);
app.use("/questions", questionRoutes);
app.use("/", submissionRoutes);
app.use('/', enrollmentRoutes(enrollmentController));
app.use('/', AnalyticRoutes);


// Health check
app.get("/health", (req, res) => res.json({ status: "OK" }));

// Error handling
app.use(notFound);
app.use(errorHandler);
app.get("/", (req, res) => {
  res.send("API is running");
});
export default app;
