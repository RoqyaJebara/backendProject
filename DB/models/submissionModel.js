import db from "../config/db.js"; // your db client (e.g., pg Pool)

export const submitAssignment = async ({ lessonId, file, userId }) => {
  const now = new Date();
  const result = await db.query(
    `INSERT INTO submissions (lesson_id, user_id, submission_url, submitted_at, created_at, updated_at)
     VALUES ($1, $2, $3, $4, $4, $4) RETURNING *`,
    [lessonId, userId, file, now]
  );
  return result.rows[0];
};

export const gradeSubmission = async ({ submissionId, grade, feedback }) => {
  const now = new Date();
  const result = await db.query(
    `UPDATE submissions SET grade = $1, feedback = $2, updated_at = $3
     WHERE id = $4 RETURNING *`,
    [grade, feedback, now, submissionId]
  );
  return result.rows[0];
};

export const getSubmissionById = async (id) => {
  const result = await db.query(`SELECT * FROM submissions WHERE id = $1`, [id]);
  return result.rows[0];
};

export const getAllSubmissions = async () => {
  const result = await db.query(`SELECT * FROM submissions`);
  return result.rows;
};
