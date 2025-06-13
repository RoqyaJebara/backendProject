import express from 'express';
import * as quizController from '../controllers/quizController.js';

const quizRoutes = express.Router();

quizRoutes.get('/', quizController.getAllQuizzes);
quizRoutes.get('/:id', quizController.getQuizById);
quizRoutes.post('/', quizController.createQuiz);
quizRoutes.put('/:id', quizController.updateQuiz);
quizRoutes.delete('/:id', quizController.deleteQuiz);
quizRoutes.post('/quiz-grades', quizController.addQuizGrade);

export default quizRoutes;
