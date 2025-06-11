import * as QuizModel from '../models/quizModel.js';

export const getAllQuizzes = async (req, res) => {
  try {
    const quizzes = await QuizModel.getAllQuizzes();
    res.json(quizzes);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch quizzes' });
  }
};

export const getQuizById = async (req, res) => {
  try {
    const quiz = await QuizModel.getQuizById(req.params.id);
    if (!quiz) return res.status(404).json({ error: 'Quiz not found' });
    res.json(quiz);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch quiz' });
  }
};

export const createQuiz = async (req, res) => {
  try {
    const quiz = await QuizModel.createQuiz(req.body);
    res.status(201).json(quiz);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create quiz' });
  }
};

export const updateQuiz = async (req, res) => {
  try {
    const quiz = await QuizModel.updateQuiz(req.params.id, req.body);
    if (!quiz) return res.status(404).json({ error: 'Quiz not found' });
    res.json(quiz);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update quiz' });
  }
};

export const deleteQuiz = async (req, res) => {
  try {
    await QuizModel.deleteQuiz(req.params.id);
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete quiz' });
  }
};
