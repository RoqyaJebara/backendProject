import db from '../config/db.js'; 

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
  console.log(`Adding grade: userId=${userId}, lessonId=${lessonId}, quizId=${quizId}, grade=${grade}`);
  
  const values = [userId, lessonId, quizId, grade];
  const result = await db.query(query, values);
  return result.rows[0];
};

export const getAllQuizGrades = async () => {
  const query = `
SELECT 
  qg.id, 
  qg.lesson_id, 
  qg.user_id, 
  qg.quiz_id, 
  qg.grade, 
  qg.created_at,

  u.name AS student_name,
  l.title AS lesson_title,
  m.title AS module_title,
  c.id AS course_id,
  c.title AS course_title,
  
  q.max_score

FROM quiz_grades qg
JOIN users u ON qg.user_id = u.id
JOIN lessons l ON qg.lesson_id = l.id
JOIN modules m ON l.module_id = m.id
JOIN courses c ON m.course_id = c.id
JOIN quizzes q ON qg.quiz_id = q.id;
  `;
  const { rows } = await db.query(query);
  return rows;
};
