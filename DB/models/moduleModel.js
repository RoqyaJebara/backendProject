import db from '../config/db.js'
export const getModulesByCourseId = async (courseId) => {//ORDER BY \"order\"
  const result = await db.query("SELECT * FROM modules WHERE course_id = $1 ", [courseId]);
  return result.rows;
};
export const getModuleById=async (id)=>{
  const id1 =parseInt(id);
  const query = "SELECT * FROM modules WHERE id = $1";
  const values = [id1];

  try {
    const result = await db.query(query, values);
    return result.rows[0];
  } catch (error) {
    throw error;
  }
}
export const createModule = async (courseId, data) => {
  const { title, description, order } = data;
  const result = await db.query(
    `INSERT INTO modules (course_id, title, description, "order") VALUES ($1, $2, $3, $4) RETURNING *`,
    [courseId, title, description, order]
  );
  return result.rows[0];
};

export const updateModule = async (id, data) => {
  const { title, description, order } = data;
  const result = await db.query(
    `UPDATE modules SET title = $1, description = $2, "order" = $3 WHERE id = $4 RETURNING *`,
    [title, description, order, id]
  );
  return result.rows[0];
};

export const deleteModule = async (id) => {
  await db.query("DELETE FROM modules WHERE id = $1", [id]);
};
