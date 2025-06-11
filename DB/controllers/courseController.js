import * as Course from '../models/courseModel.js';
import path, { parse } from 'path';
import fs from 'fs';

export const getCourses = async (req, res) => {
  try {
    const courses = await Course.getAllCourses();
    res.json(courses);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch courses' });
  }
};

export const getCourse = async (req, res) => {
  try {
    const course = await Course.getCourseById(req.params.id);
    if (!course) return res.status(404).json({ error: 'Course not found' });
    res.json(course);
  } catch (err) {
    res.status(500).json({ error: 'Error fetching course' });
  }
};
export const getInstructorsCourses = async (req, res) => {
  const { instructor_id } = req.params;

  try {
    const courses = await Course.findCoursesByInstructor(instructor_id);

    res.status(200).json(courses);
  } catch (error) {
    console.error('Error fetching instructor courses:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
export const createCourse = async (req, res) => {
  try {
    const { title, description, instructor_id, category_id, price } = req.body;
    const thumbnail = req.file ? req.file.filename : null;

    const newCourse = await Course.createCourse({
      title,
      description,
      instructor_id,
      category_id,
      price,
      thumbnail_url: thumbnail,
      is_published: false,  // مثلا هنا تعيين قيمة افتراضية
    });

    res.status(201).json(newCourse);
  } catch (err) {
    res.status(500).json({ error: 'Error creating course' });
  }
};

export const updateCourse = async (req, res) => {
  try {
    const { title, description, instructor_id, category_id, price, is_approved } = req.body;
    const thumbnail = req.file ? req.file.filename : null;

    // هنا تحديث كامل
    const updated = await Course.updateCourse(req.params.id, {
      title,
      description,
      instructor_id,
      category_id,
      price,
      thumbnail_url: thumbnail,
      is_approved: is_approved !== undefined ? is_approved : false,
    });

    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: 'Error updating course' });
  }
};

export const patchCourseApproval = async (req, res) => {
  try {
    const { is_approved } = req.body;
    if (typeof is_approved === 'undefined') {
      return res.status(400).json({ error: 'is_approved field is required' });
    }

    const updated = await Course.patchCourseApproval(req.params.id, is_approved);
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: 'Error updating course approval' });
  }
};

export const deleteCourse = async (req, res) => {
  try {
    await Course.deleteCourse(req.params.id);
    res.status(204).send("deleted");
  } catch (err) {
    res.status(500).json({ error: 'Error deleting course' });
  }
};
export const getCategoryCourses = async (req, res) => {
  const { categoryId } = req.params;
const CategoryId=parseInt(categoryId);
  try {
    const courses = await Course.getCoursesByCategory(CategoryId);
    res.json(courses);
  } catch (err) {
    console.error("Error fetching category courses:", err);
    res.status(500).json({ error: "Failed to fetch courses by category" });
  }
};