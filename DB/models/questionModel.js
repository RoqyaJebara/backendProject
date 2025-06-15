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

export const getQuestionsByLessonId = async (lessonId) => {
  console.log(lessonId+"lessonid");
  
  // أولاً: نحصل على quiz_id المرتبط بالدرس
  const quizResult = await db.query(
    "SELECT id FROM quizzes WHERE lesson_id = $1",
    [lessonId]
  );
  const quizId = quizResult.rows[0]?.id;
  if (!quizId) {
    return { quizId: null, questions: [] };
  }

  // ثانياً: نحصل على الأسئلة المرتبطة بالـ quiz
  const questionsResult = await db.query(
    "SELECT * FROM questions WHERE quiz_id = $1 ORDER BY id",
    [quizId]
  );

  return {
    quizId,
    questions: questionsResult.rows,
  };
};

// Get single question by ID
export const getQuestionById = async (quizId) => {
  const result = await db.query("SELECT * FROM questions WHERE quiz_id = $1", [quizId]);
  return result.rows; // فقط أعد النتائج، لا تستخدم res هنا
};
// Create a new question
export const insertQuestion = async ({ quizId, lessonId, question, options, correct_answer }) => {
  try {
    console.log("Received lessonId:", lessonId);
    console.log("Received quizId:", quizId);

    let finalQuizId = quizId;

    if (!finalQuizId) {
      const quizResult = await db.query(
        "SELECT id FROM quizzes WHERE lesson_id = $1",
        [lessonId]
      );

      console.log("quizResult.rows:", quizResult.rows);

      finalQuizId = quizResult.rows[0]?.id;
      console.log("Fetched quizId from DB:", finalQuizId);

      if (!finalQuizId) {
        throw new Error(`No quiz found for lessonId ${lessonId}`);
      }
    } else {
      console.log("Using provided quizId:", finalQuizId);
    }

    const result = await db.query(
      `INSERT INTO questions (quiz_id, question, options, correct_answer, created_at, updated_at)
       VALUES ($1, $2, $3, $4, NOW(), NOW())
       RETURNING *`,
      [finalQuizId, question, options, correct_answer]
    );

    return result.rows[0];
  } catch (error) {
    console.error("Database insert error:", error);
    throw error;
  }
};





// Update a question
export const updateQuestion = async (id, {  question, options, correct_answer,lessonId }) => {
  console.log("id,q,o,c,lessonid"+id+question+ options+ correct_answer+lessonId);
  
  const quiz_id = await db.query("SELECT id FROM quizzes WHERE lesson_id = $1", [lessonId]);
  console.log(quiz_id+"quiz_id");
  const result = await db.query(
    `UPDATE questions SET
       quiz_id = $1,
       question = $2,
       options = $3,
       correct_answer = $4,
       updated_at = NOW()
     WHERE id = $5 RETURNING *`,
    [quiz_id.rows[0]?.id, question, options, correct_answer, id]
  );
  return result.rows[0] || null;
};
// Delete a question
export const deleteQuestion = async (id) => {
  const result = await db.query("DELETE FROM questions WHERE id = $1 RETURNING *", [id]);
  return result.rows[0]; // أرجع الصف المحذوف
};
