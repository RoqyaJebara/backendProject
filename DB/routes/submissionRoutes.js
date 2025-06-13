import express from "express";
import multer from "multer";
import {
  handleSubmitAssignment,
  handleGradeSubmission,
  handleGetSubmission,
  handleGetAllSubmissions,
} from "../controllers/submissionController.js";

// Setup multer storage with original filename (optional, cleaner)
const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + "-" + file.originalname;
    cb(null, uniqueName);
  },
});

const upload = multer({ storage });

const submissionRoutes = express.Router();

// ✅ Submit an assignment (with file upload)
submissionRoutes.post(
  "/assignments/:id/submit",
  upload.single("file"),
  handleSubmitAssignment
);

// ✅ Grade a submission
submissionRoutes.put("/assignments/:id/grade", handleGradeSubmission);

// ✅ Get one submission by ID
submissionRoutes.get("/submissions/:id", handleGetSubmission);

// ✅ Get all submissions (for instructors/admins)
submissionRoutes.get("/submissions", handleGetAllSubmissions);

export default submissionRoutes;
