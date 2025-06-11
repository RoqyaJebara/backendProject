// controllers/questionController.js
import {
  getAllQuestions,
  getQuestionById,
  insertQuestion,
  updateQuestion,
  deleteQuestion,
} from '../models/questionModel.js';

export const fetchQuestions = async (req, res) => {
  try {
    const questions = await getAllQuestions();
    res.json(questions);
  } catch (error) {
    res.status(500).json({ error: 'حدث خطأ أثناء جلب الأسئلة' });
  }
};

import { getQuestionsByQuizId } from '../models/questionModel.js';

export const fetchQuestion = async (req, res) => {
  try {
    const questions = await getQuestionById(req.params.id);

    if (!questions || questions.length === 0) {
      return res.status(404).json({ error: 'لا توجد أسئلة لهذا الاختبار' });
    }

    res.json(questions);
  } catch (error) {
    console.error("Error fetching questions:", error);
    res.status(500).json({ error: 'فشل في جلب السؤال' });
  }
};


export const createQuestion = async (req, res) => {
  try {
    const { quizId, question, options, correct_answer } = req.body;

    if (!quizId || !question || !options || !correct_answer) {
      return res.status(400).json({ error: "جميع الحقول مطلوبة",msg: quizId, question, options, correct_answer });
    }
  console.log( req.body.quizId+" req.body.quizId");
  console.log( req.body.question+" req.body.question");
  console.log( req.body.options+" req.body.options");
  console.log( req.body.correct_answer+" req.body.correct_answer");
    const newQuestion = await insertQuestion({
      quizId,
      question,
      options,
      correct_answer,
    });

    res.status(201).json(newQuestion);
  } catch (error) {
    console.error("فشل في إضافة السؤال:", error);
    res.status(500).json({ error: "فشل في إضافة السؤال" });
  }
};

export const editQuestion = async (req, res) => {
  try {
    const updated = await updateQuestion(req.params.id, req.body);
    if (!updated) return res.status(404).json({ error: 'السؤال غير موجود' });
    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: 'فشل في التحديث' });
  }
};

export const removeQuestion = async (req, res) => {
  try {
    const deleted = await deleteQuestion(req.params.id);
    if (!deleted) return res.status(404).json({ error: 'السؤال غير موجود' });
    res.json({ message: 'تم الحذف بنجاح' });
  } catch (error) {
    res.status(500).json({ error: 'فشل في الحذف' });
  }
};
