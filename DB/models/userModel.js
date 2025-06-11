import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { query } from '../config/db.js';

const UserModel = {
  async create({ email, password_hash, name,role ,oauth_id, oauth_provider ,is_active}) {
    try {
      const hashedPassword = await bcrypt.hash(password_hash, parseInt(process.env.BCRYPT_SALT_ROUNDS));
      
      const { rows } = await query(
        `INSERT INTO users (email, password_hash, name,role, oauth_id, oauth_provider,is_active) 
         VALUES ($1, $2, $3,$4, $5, $6, $7) 
         RETURNING id, email, name, created_at`,
        [email, hashedPassword, name,role, oauth_id , oauth_provider,is_active ]
      );
      
      return rows[0];
    } catch (error) {
      if (error.code === '23505') {
        throw new Error('Email already exists');
      }
      throw error;
    }
  },

  async findByEmail(email) {
    const { rows } = await query(
      'SELECT id, email, password_hash, name,role FROM users WHERE email = $1',
      [email]
    );
    return rows[0];
  },

  async findById(id) {
    const { rows } = await query(
      'SELECT id, email, name,role FROM users WHERE id = $1',
      [id]
    );
    return rows[0];
  },

  generateToken(userId) {
    return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN || '1d',
    });
  },

  async verifyPassword(candidatePassword, hashedPassword) {
    return await bcrypt.compare(candidatePassword, hashedPassword);
  },

  async updatePassword(userId, newPassword) {
    const hashedPassword = await bcrypt.hash(newPassword, parseInt(process.env.BCRYPT_SALT_ROUNDS));
    await query(
      'UPDATE users SET password_hash = $1 WHERE id = $2',
      [hashedPassword, userId]
    );
  }
};

export default UserModel;