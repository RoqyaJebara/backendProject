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


export const addQuizGrade = async (req, res) => {
  try {
    const { userId, lessonId, quizId, grade } = req.body;

    if (!userId || !lessonId || !quizId || grade == null) {
      return res.status(400).json({ error: 'All fields are required.' });
    }

    const newGrade = await QuizModel.addGrade(userId, lessonId, quizId, grade);
    res.status(201).json(newGrade);
  } catch (error) {
    console.error('Error adding quiz grade:', error);
    res.status(500).json({ error: 'Failed to add quiz grade.' });
  }
};

export const fetchAllQuizGrades = async (req, res) => {
  try {
    const grades = await QuizModel.getAllQuizGrades(); 
    res.json(grades);
  } catch (error) {
    console.error('Error fetching quiz grades:', error);
    res.status(500).json({ error: 'Failed to fetch quiz grades' });
  }
};