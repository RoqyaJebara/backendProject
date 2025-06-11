import { query } from '../config/db.js';
import bcrypt from 'bcryptjs';

// Get all users
export const getAllUsers = async () => {
  try {
    const result = await query('SELECT * FROM users ORDER BY created_at ASC');
    return result.rows;
  } catch (error) {
    console.error('Error fetching users:', error.message);
    throw error;
  }
};

// Get user by ID
export const getUserById = async (id) => {
  try {
    const result = await query('SELECT * FROM users WHERE id = $1', [id]);
    return result.rows[0];
  } catch (error) {
    console.error('Error fetching user by ID:', error.message);
    throw error;
  }
};

// ✅ Get all students
export const getAllStudents = async () => {
  try {
    const result = await query("SELECT * FROM users WHERE role = 'student' ORDER BY created_at ASC");
    return result.rows;
  } catch (error) {
    console.error('Error fetching students:', error.message);
    throw error;
  }
};

// ✅ Get all instructors
export const getAllInstructors = async () => {
  try {
    const result = await query("SELECT * FROM users WHERE role = 'instructor' ORDER BY created_at ASC");
    return result.rows;
  } catch (error) {
    console.error('Error fetching instructors:', error.message);
    throw error;
  }
};

// Update user
export const updateUser = async (id, data) => {
  const {
    name,
    email,
    password_hash,
    role,
    oauth_provider,
    oauth_id,
    is_active,
  } = data;

  console.log('Updating user with ID:', id);
  console.log('Received data:', data);

  if (!password_hash) {
    throw new Error("Missing password_hash in request body");
  }

  const hashedPassword = await bcrypt.hash(
    password_hash,
    parseInt(process.env.BCRYPT_SALT_ROUNDS)
  );

  try {
    const result = await query(
      `
      UPDATE users SET
        name = $1,
        email = $2,
        password_hash = $3,
        role = $4,
        oauth_provider = $5,
        oauth_id = $6,
        is_active = $7,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = $8
      RETURNING *`,
      [name, email, hashedPassword, role, oauth_provider, oauth_id, is_active, id]
    );

    if (result.rowCount === 0) {
      console.log('No user updated — user with ID may not exist');
      return null;
    }

    return result.rows[0];
  } catch (error) {
    console.error('Error updating user:', error.message);
    throw error;
  }
};

// Delete user
export const deleteUser = async (id) => {
  console.log(id+"id");
  
  try {
    const result = await query('DELETE FROM users WHERE id = $1 RETURNING *', [id]);
    return result.rows[0];
  } catch (error) {
    console.error('Error deleting user:', error.message);
    throw error;
  }
};
