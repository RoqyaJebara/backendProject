import db from '../config/db.js'; // افترضنا أنك تملك ملف db.js لإعداد الاتصال بقاعدة البيانات

export const getAllQuizzes = async () => {
  const result = await db.query('SELECT * FROM quizzes ORDER BY id');
  return result.rows;
};

export const getQuizById = async (id) => {
  const result = await db.query('SELECT * FROM quizzes WHERE lesson_id = $1', [id]);
  return result.rows[0];
};

export const createQuiz = async (quiz) => {
  const { lesson_id, max_score } = quiz;
  const result = await db.query(
    `INSERT INTO quizzes (lesson_id, max_score)
     VALUES ($1, $2)
     RETURNING *`,
    [lesson_id, max_score]
  );
  return result.rows[0];
};

export const updateQuiz = async (id, quiz) => {
  const { lesson_id, max_score } = quiz;
  const result = await db.query(
    `UPDATE quizzes SET lesson_id = $1, max_score = $2, updated_at = CURRENT_TIMESTAMP
     WHERE id = $3 RETURNING *`,
    [lesson_id, max_score, id]
  );
  return result.rows[0];
};

export const deleteQuiz = async (id) => {
  await db.query('DELETE FROM quizzes WHERE id = $1', [id]);
};
export const addGrade = async (userId, lessonId, quizId, grade) => {
  const query = `
    INSERT INTO quiz_grades (user_id, lesson_id, quiz_id, grade)
    VALUES ($1, $2, $3, $4)
    RETURNING *;
  `;
  const values = [userId, lessonId, quizId, grade];
  const result = await db.query(query, values);
  return result.rows[0];
};
