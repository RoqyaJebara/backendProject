import pool from '../config/db.js';

export async function getCourseAnalytics() {
  const query = `
 SELECT 
  c.id AS course_id,
  c.title,
  u_instructor.name AS instructor_name,
  COUNT(DISTINCT e.user_id) AS enrollments_count
FROM courses c
LEFT JOIN users u_instructor ON c.instructor_id = u_instructor.id AND u_instructor.role = 'instructor'
LEFT JOIN enrollments e ON c.id = e.course_id
LEFT JOIN users u_student ON e.user_id = u_student.id AND u_student.role = 'student'
GROUP BY c.id, u_instructor.name
ORDER BY c.title
  `;

  const { rows } = await pool.query(query);
  return rows;
}
  

  export async function getStudents() {
    const  { rows } = await pool.query(`SELECT id, name FROM users WHERE role = 'student'`);
    return rows;
  }

  export async function getInstructors() {
    const  { rows } = await pool.query(`SELECT id, name FROM users WHERE role = 'instructor'`);
    return rows;
  }
  export async function getAllStudentsEnrollments() {
  const query = `
    SELECT
      u.id AS user_id,
      u.name AS student_name,
      c.id AS course_id,
      c.title AS course_title,
      e.enrolled_at,
      e.completed_at,
      e.progress
    FROM users u
    JOIN enrollments e ON u.id = e.user_id
    JOIN courses c ON c.id = e.course_id
    WHERE u.role = 'student'
    ORDER BY u.name, c.title;
  `;

  const { rows } = await pool.query(query);
  return rows;
}

