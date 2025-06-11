// routes/questionRoutes.js
import express from 'express';
import {
  fetchQuestions,
  fetchQuestion,
  createQuestion,
  editQuestion,
  removeQuestion
} from '../controllers/questionController.js';

const questionRoutes = express.Router();

questionRoutes.get('/', fetchQuestions);
questionRoutes.get('/:id', fetchQuestion);
questionRoutes.post('/', createQuestion);
questionRoutes.put('/:id', editQuestion);
questionRoutes.delete('/:id', removeQuestion);

export default questionRoutes;
