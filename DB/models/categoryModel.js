import  pool  from '../config/db.js';

// Get all categories
export const findAll = async () => {
  const result = await pool.query('SELECT * FROM categories ORDER BY id ASC');
  return result.rows;
};

// Get a category by ID
export const findById = async (id) => {
  const result = await pool.query('SELECT * FROM categories WHERE id = $1', [id]);
  return result.rows[0];
};

// Create a new category
export const create = async (name) => {
  const result = await pool.query(
    'INSERT INTO categories (name) VALUES ($1) RETURNING *',
    [name]
  );
  return result.rows[0];
};

// Update category
export const update = async (id, name) => {
  const result = await pool.query(
    'UPDATE categories SET name = $1 WHERE id = $2 RETURNING *',
    [name, id]
  );
  return result.rows[0];
};

// Delete category
export const remove = async (id) => {
  const result = await pool.query(
    'DELETE FROM categories WHERE id = $1 RETURNING *',
    [id]
  );
  return result.rows[0];
};
