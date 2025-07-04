// controllers/questionController.js
import {
  getAllQuestions,
  getQuestionById,
  insertQuestion,
  updateQuestion,
  deleteQuestion,
  getQuestionsByLessonId,
} from '../models/questionModel.js';

export const fetchQuestions = async (req, res) => {
  try {
    const questions = await getAllQuestions();
    res.json(questions);
  } catch (error) {
    res.status(500).json({ error: 'حدث خطأ أثناء جلب الأسئلة' });
  }
};

export const fetchQuestionsByQuizId = async (req, res) => {
  const { lessonId } = req.params;
  console.log("lessonId", lessonId);
  try {
    const questions = await getQuestionsByLessonId(lessonId);
    res.json(questions);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch questions for quiz" });
  }
};
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
    const { quizId,lessonId, question, options, correct_answer } = req.body;

    if ( !question || !options || !correct_answer) {
      return res.status(400).json({ error: "جميع الحقول مطلوبة",msg: question, options, correct_answer });
    }
  // console.log( req.body.quizId+" req.body.quizId");
  console.log( req.body.question+" req.body.question");
  console.log( req.body.options+" req.body.options");
  console.log( req.body.correct_answer+" req.body.correct_answer");
    const newQuestion = await insertQuestion({
      quizId,
      question,
      options,
      correct_answer,lessonId
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
    console.log(req.params.id + " <- req.params.id");
    
    const deleted = await deleteQuestion(req.params.id);

    if (!deleted)
      return res.status(404).json({ error: "السؤال غير موجود" });

    res.json({ message: "تم الحذف بنجاح" });
  } catch (error) {
    console.error("Error deleting question:", error);
    res.status(500).json({ error: "فشل في الحذف" });
  }
};