import db from "../config/db.js"; 


export const submitAssignment = async ({ userId, lessonId, file }) => {

  const File = file ? `/uploads/${file}` : null;

  try {
    // تحقق إن كان الطالب قد قدم مسبقًا
    const existing = await db.query(
      `SELECT * FROM submissions WHERE user_id = $1 AND lesson_id = $2`,
      [userId, lessonId]
    );

    if (existing.rows.length > 0) {
      // تحديث التسليم
     const result= await db.query(
        `UPDATE submissions
         SET submission_url=$1,
             updated_at = NOW()
         WHERE user_id = $2 AND lesson_id = $3`,
        [file,  userId, lessonId]
      );
      return result.rows[0];
    } else {     
     const result=  await db.query(
       `INSERT INTO submissions (user_id, lesson_id, submission_url, submitted_at)
         VALUES ($1, $2, $3, NOW())`,
        [userId, lessonId, file]
      );
      return  result.rows[0];
    }
  } catch (err) {
    console.error("Submission error:", err);
  }
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
  const result = await db.query(`
    SELECT 
  submissions.*,
  users.name AS student_name,
  lessons.title AS lesson_name,
    lessons.content AS lesson_content,
  modules.title AS module_name,
  courses.title AS course_title
FROM submissions
JOIN lessons ON submissions.lesson_id = lessons.id
JOIN modules ON lessons.module_id = modules.id
JOIN courses ON modules.course_id = courses.id
JOIN users ON submissions.user_id = users.id`);
  return result.rows;
};
