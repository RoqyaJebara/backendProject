import db from '../config/db.js'

export const getLessonsByModuleId = async (moduleId) => {
  const result = await db.query("SELECT * FROM lessons WHERE module_id = $1 ORDER BY \"order\"", [moduleId]);
  return result.rows;
};

export const createLesson = async (moduleId, data) => {
  const { title, content_type, content, duration, order, is_free } = data;
  const result = await db.query(
    `INSERT INTO lessons (module_id, title, content_type, content, duration, "order", is_free)
     VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
    [moduleId, title, content_type, content, duration, order, is_free]
  );
  return result.rows[0];
};

export const updateLesson = async (id, data) => {
  const { title, content_type, content, duration, order, is_free } = data;
  const result = await db.query(
    `UPDATE lessons SET title = $1, content_type = $2, content = $3, duration = $4, "order" = $5, is_free = $6 WHERE id = $7 RETURNING *`,
    [title, content_type, content, duration, order, is_free, id]
  );
  return result.rows[0];
};


export const deleteLesson = async (lessonId) => {
  // جلب بيانات الدرس
  const lessonRes = await db.query("SELECT * FROM lessons WHERE id = $1", [lessonId]);
  const lesson = lessonRes.rows[0];

  if (!lesson) {
    throw new Error("Lesson not found");
  }

  if (lesson.type === "quiz") {
    const quizRes = await db.query("SELECT * FROM quizzes WHERE lesson_id = $1", [lessonId]);
    const quiz = quizRes.rows[0];

    if (quiz) { // تأكد من وجود quiz قبل استخدامه
      await db.query("DELETE FROM questions WHERE quiz_id = $1", [quiz.id]);
      await db.query("DELETE FROM quizzes WHERE id = $1", [quiz.id]);
    }
  }

  // حذف الدرس نفسه
  await db.query("DELETE FROM lessons WHERE id = $1", [lessonId]);
};





export const getLessonById = async (id) => {
  const result = await db.query(`
    SELECT 
      id, module_id, title, content_type, content, 
      duration, "order", is_free, created_at, updated_at
    FROM public.lessons
    WHERE id = $1
  `, [id]);

  return result.rows[0]; // Return a single lesson object
};
