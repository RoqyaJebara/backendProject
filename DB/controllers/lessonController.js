import * as lessonModel from '../models/lessonModel.js';
export const getLessons = async (req, res) => {
  const lessons = await lessonModel.getLessonsByModuleId(req.params.moduleId);
  res.json(lessons);
};

export const createLesson = async (req, res) => {
  const lesson = await lessonModel.createLesson(req.params.moduleId, req.body);
  res.status(201).json(lesson);
};

export const updateLesson = async (req, res) => {
  const lesson = await lessonModel.updateLesson(req.params.id, req.body);
  res.json(lesson);
};


export const deleteLesson = async (req, res) => {
  try {
    await lessonModel.deleteLesson(req.params.id);
    res.status(204).send(); // No Content
  } catch (error) {
    console.error("Error deleting lesson:", error.message);
    res.status(500).json({ error: error.message || "Failed to delete lesson" });
  }
};

export const getLesson = async (req, res) => {
  try {
    // const { id  } = req.params;
    const Id = parseInt(req.params.id);
    

    // ✅ تحقق من صحة الـ ID
    if (isNaN(Id)) {
      return res.status(400).json({ error: 'Invalid lesson ID' });
    }

    const lesson = await lessonModel.getLessonById(Id);

    if (!lesson) {
      return res.status(404).json({ error: 'Lesson not found' });
    }

    res.status(200).json(lesson);
  } catch (err) {
    console.error('Error fetching lesson:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
