import * as usersModel from '../models/usersModel.js';
import { updateUserSchema } from '../utils/validation.js';

export const getUsers = async (req, res) => {
  try {
    const users = await usersModel.getAllUsers();
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch users' });
  }
};

export const getUserById = async (req, res) => {
  const id = parseInt(req.params.id);
  try {
    const user = await usersModel.getUserById(id);
    if (user) res.json(user);
    else res.status(404).json({ error: 'User not found' });
  } catch (error) {
    res.status(500).json({ error: 'Error fetching user' });
  }
};

// ✅ Get all students
export const getStudents = async (req, res) => {
  try {
    const students = await usersModel.getAllStudents();
    res.json(students);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch students' });
  }
};

// ✅ Get all instructors
export const getInstructors = async (req, res) => {
  try {
    const instructors = await usersModel.getAllInstructors();
    res.json(instructors);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch instructors' });
  }
};

export const updateUser = async (req, res) => {
  const id = parseInt(req.params.id);
  try {
    const { error } = updateUserSchema.validate(req.body);
    if (error) throw new Error(error.details[0].message);
    const user = await usersModel.updateUser(id, req.body);
    if (user) res.json(user);
    else res.status(404).json({ error: 'User not found or update failed' });
  } catch (error) {
    console.error('Controller error updating user:', error.message);
    res.status(500).json({ error: 'Error updating user' });
  }
};

export const deleteUser = async (req, res) => {
  const id = parseInt(req.params.id);
  try {
    const user = await usersModel.deleteUser(id);
    if (user) res.json({ message: 'User deleted successfully' });
    else res.status(404).json({ error: 'User not found' });
  } catch (error) {
    res.status(500).json({ error: 'Error deleting user' });
  }
};
