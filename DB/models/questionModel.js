import db from '../config/db.js'; 
// Get all questions
export const getAllQuestions = async (req, res) => {
  try {
    const result = await db.query("SELECT * FROM questions ORDER BY id");
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch questions" });
  }
};

// Get questions by quiz ID
export const getQuestionsByQuizId = async (req, res) => {
  const { quizId } = req.params;
  try {
    const result = await db.query(
      "SELECT * FROM questions WHERE quiz_id = $1 ORDER BY id",
      [quizId]
    );
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch questions for quiz" });
  }
};

// Get single question by ID
export const getQuestionById = async (quizId) => {
  const result = await db.query("SELECT * FROM questions WHERE quiz_id = $1", [quizId]);
  return result.rows; // فقط أعد النتائج، لا تستخدم res هنا
};
// Create a new question
export const insertQuestion = async ({ quizId, question, options, correct_answer }) => {
  try {
    const result = await db.query(
      `INSERT INTO questions (quiz_id, question, options, correct_answer, created_at, updated_at)
       VALUES ($1, $2, $3, $4, NOW(), NOW())
       RETURNING *`,
      [quizId, question, options, correct_answer]
    );
    return result.rows[0];
  } catch (error) {
    console.error("Database insert error:", error);
    throw error;
  }
};

// Update a question
export const updateQuestion = async (req, res) => {
  const { id } = req.params;
  const { quiz_id, question, options, correct_answer } = req.body;
  try {
    const result = await db.query(
      `UPDATE questions SET
         quiz_id = $1,
         question = $2,
         options = $3,
         correct_answer = $4,
         updated_at = NOW()
       WHERE id = $5 RETURNING *`,
      [quiz_id, question, options, correct_answer, id]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: "Question not found" });
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: "Failed to update question" });
  }
};

// Delete a question
export const deleteQuestion = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await db.query("DELETE FROM questions WHERE id = $1 RETURNING *", [id]);
    if (result.rows.length === 0) return res.status(404).json({ error: "Question not found" });
    res.json({ message: "Question deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete question" });
  }
};
