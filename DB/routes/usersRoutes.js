import express from 'express';
import {
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
  getStudents,
  getInstructors,
} from '../controllers/usersController.js';

const usersRouter = express.Router();

// ✅ ثابتة أولًا
usersRouter.get('/role/students', getStudents);
usersRouter.get('/role/instructors', getInstructors);

// ✅ بعدها العامة
usersRouter.get('/', getUsers);
usersRouter.get('/:id', getUserById);
usersRouter.put('/:id', updateUser);
usersRouter.delete('/:id', deleteUser);

export default usersRouter;