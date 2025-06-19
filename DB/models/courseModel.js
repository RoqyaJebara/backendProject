import pool from "../config/db.js";
import { parseBoolean } from "../utils/validation.js";

export const getAllCourses = async () => {
  const res = await pool.query(`SELECT 
  courses.*, 
  users.name AS instructor_name, 
  users.email AS instructor_email
FROM 
  courses
JOIN 
  users ON courses.instructor_id = users.id;
`);
  return res.rows;
};

export const getCourseById = async (id) => {
  const res = await pool.query("SELECT * FROM courses WHERE id = $1", [id]);
  return res.rows[0];
};

export const findCoursesByInstructor = async (instructorId) => {
  try {
    const result = await pool.query(
      `
      SELECT 
        courses.id AS course_id,
        courses.title,
        courses.description,
        courses.instructor_id,
        courses.category_id,
        categories.name AS category_name,
        courses.price,
        courses.thumbnail_url,
        courses.is_published,
        courses.is_approved,
        courses.created_at,
        courses.updated_at
      FROM public.courses
      INNER JOIN categories ON categories.id=courses.category_id
      WHERE courses.instructor_id = $1
	  
    `,
      [instructorId]
    );

    return result.rows;
  } catch (error) {
    console.error("Error fetching instructor courses:", error);
    throw error;
  }
};
export const createCourse = async (courseData) => {
  const {
    title,
    description,
    instructor_id,
    category_id,
    price,
    thumbnail_url,
    is_published,
  } = courseData;
  const isPublished = 'true'

  const res = await pool.query(
    `INSERT INTO courses 
    (title, description, instructor_id, category_id, price, thumbnail_url, is_published)
    VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
    [
      title,
      description,
      instructor_id,
      category_id,
      price,
      thumbnail_url,
      isPublished,
    ]
  );

  return res.rows[0];
};

export const updateCourse = async (id, courseData) => {
  const {
    title,
    description,
    instructor_id,
    category_id,
    price,
    thumbnail_url,
    is_approved,
    is_published,
  } = courseData;

  const res = await pool.query(
    `UPDATE courses SET 
      title = $1,
      description = $2,
      instructor_id = $3,
      category_id = $4,
      price = $5,
      thumbnail_url = $6,
      is_approved = $7,
      is_published=$8,
      updated_at = NOW()
    WHERE id = $9
    RETURNING *`,
    [
      title,
      description,
      instructor_id,
      category_id,
      price,
      thumbnail_url,
      is_approved,
      is_published,
      id,
    ]
  );

  return res.rows[0];
};

export const patchCourseApproval = async (id, is_approved) => {
  const res = await pool.query(
    `UPDATE courses SET 
      is_approved = $1,
      updated_at = NOW()
    WHERE id = $2
    RETURNING *`,
    [is_approved, id]
  );
  return res.rows[0];
};

export const deleteCourse = async (id) => {
  await pool.query("DELETE FROM courses WHERE id = $1", [id]);
};
export const getCoursesByCategory = async (categoryId) => {
  const CategoryId = parseInt(categoryId);
  const query = `
    SELECT * FROM courses
    WHERE category_id = $1
    ORDER BY created_at DESC
  `;
  const { rows } = await pool.query(query, [CategoryId]);
  return rows;
};
