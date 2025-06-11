import express from "express";
import {
  handleSubmitAssignment,
  handleGradeSubmission,
  handleGetSubmission,
  handleGetAllSubmissions,
} from "../controllers/submissionController.js";
import multer from 'multer';

const upload = multer({ dest: 'uploads/' });

const submissionRoutes = express.Router();

submissionRoutes.post('/assignments/:id/submit', upload.single('file'), handleSubmitAssignment);
submissionRoutes.put("/assignments/:id/grade", handleGradeSubmission);    // Instructor
submissionRoutes.get("/submissions/:id", handleGetSubmission);            // Get one
submissionRoutes.get("/submissions", handleGetAllSubmissions);            // Admin or instructor

export default submissionRoutes;