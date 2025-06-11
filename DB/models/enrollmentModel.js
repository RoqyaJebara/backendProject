export class EnrollmentModel {
  constructor(queryFunc) {
    this.query = queryFunc;
  }

  async createEnrollment(userId, courseId) {
    const sql = `
      INSERT INTO enrollments (user_id, course_id, progress, enrolled_at)
      VALUES ($1, $2, 0, NOW())
      RETURNING *`;
    const values = [userId, courseId];
    const res = await this.query(sql, values);
    return res.rows[0];
  }
 async getProgress(userId, courseId) {
    const sql = `
      SELECT progress
      FROM enrollments
      WHERE user_id=$1 AND course_id=$2
      `;
    const values = [userId, courseId];
    const res = await this.query(sql, values);
    return res.rows;
  }
  async getEnrollmentById(userId) {
    const sql = `
    SELECT enrollments.*, courses.*
    FROM enrollments
    JOIN courses ON enrollments.course_id = courses.id
    WHERE enrollments.user_id = $1
  `;
    const res = await this.query(sql, [userId]);
    return res.rows; // ترجع كل التسجيلات مع بيانات الدورات
  }
  async updateProgress(progress, userId, courseId) {
    const sql = `
      UPDATE enrollments
      SET progress = $1
      WHERE  user_id=$2 AND course_id=$3
      RETURNING *`;
    const values = [progress, userId, courseId];
    const res = await this.query(sql, values);
    return res.rows[0];
  }

  // Get all enrollments with user and course details
  async getAll() {
    try {
      const query = `
        SELECT 
  e.id, 
  e.enrolled_at, 
  e.completed_at, 
  e.progress,
  u.id as user_id,
  u.name as user_name,
  u.email as user_email,
  u.role as user_role,
  c.id as course_id,
  c.title as course_title,
  c.description as course_description,
  c.price as course_price
FROM 
  enrollments e
JOIN 
  users u ON e.user_id = u.id
JOIN 
  courses c ON e.course_id = c.id
WHERE 
  u.role = 'student'
      `;
      const { rows } = await this.query(query);
      return rows;
    } catch (error) {
      throw error;
    }
  }
}
