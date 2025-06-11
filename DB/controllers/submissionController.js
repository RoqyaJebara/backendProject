import {
  submitAssignment,
  gradeSubmission,
  getSubmissionById,
  getAllSubmissions,
} from "../models/submissionModel.js";

export const handleSubmitAssignment = async (req, res) => {
  const userId = parseInt(req.params.id);
  const lessonId = req.body.lessonId;
  const file = req.file ? req.file.filename : null; // اسم الملف المحفوظ في مجلد uploads

  if (!userId || !lessonId || !file) {
    return res.status(400).json({ error: "userId, lessonId and file are required." });
  }

  try {
    const submission = await submitAssignment({ userId, lessonId, file });
    res.status(201).json(submission);
  } catch (err) {
    console.error("Error submitting assignment:", err);
    res.status(500).json({ error: "Failed to submit assignment." });
  }
};

export const handleGradeSubmission = async (req, res) => {
  const submissionId = parseInt(req.params.id);
  const { grade, feedback } = req.body;

  if (grade == null) {
    return res.status(400).json({ error: "Grade is required." });
  }

  try {
    const updated = await gradeSubmission({ submissionId, grade, feedback });
    res.json(updated);
  } catch (err) {
    console.error("Error grading submission:", err);
    res.status(500).json({ error: "Failed to grade submission." });
  }
};

export const handleGetSubmission = async (req, res) => {
  const id = parseInt(req.params.id);
  try {
    const submission = await getSubmissionById(id);
    if (!submission) return res.status(404).json({ error: "Submission not found." });
    res.json(submission);
  } catch (err) {
    console.error("Error fetching submission:", err);
    res.status(500).json({ error: "Error fetching submission." });
  }
};

export const handleGetAllSubmissions = async (_req, res) => {
  try {
    const submissions = await getAllSubmissions();
    res.json(submissions);
  } catch (err) {
    console.error("Error fetching submissions:", err);
    res.status(500).json({ error: "Error fetching submissions." });
  }
};
