import { pool } from "../config/database1.js";

export const findUserByEmail = async (email) => {
  const result = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
  return result.rows[0] || null;
};

export const findUserByGoogleId = async (googleId) => {
  const result = await pool.query("SELECT * FROM users WHERE oauth_provider = 'google' AND oauth_id = $1", [googleId]);
  return result.rows[0] || null;
};

export const createUser = async ({
  name,
  email,
  password_hash,
  role,
  oauth_provider,
  oauth_id,
  is_active,
}) => {
  const query = `
    INSERT INTO users (name, email, password_hash, role, oauth_provider, oauth_id, is_active)
    VALUES ($1, $2, $3, $4, $5, $6, $7)
    RETURNING id, name, email, role, oauth_provider, oauth_id, is_active, created_at, updated_at
  `;

  const values = [name, email, password_hash, role, oauth_provider, oauth_id, is_active];
  const result = await pool.query(query, values);
  return result.rows[0];
};
