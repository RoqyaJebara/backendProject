import express from 'express';
import multer from 'multer';
import {
  getCourses,
  getCourse,
  createCourse,
  updateCourse,
  deleteCourse,
  patchCourseApproval, 
  getInstructorsCourses, 
  getCategoryCourses
} from '../controllers/courseController.js';

const courseRoutes = express.Router();

const storage = multer.diskStorage({
  destination: 'uploads/',
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  },
});

const upload = multer({ storage });

courseRoutes.get('/', getCourses);
courseRoutes.get('/:id', getCourse);
courseRoutes.post('/', upload.single('thumbnail'), createCourse);
courseRoutes.put('/:id', upload.single('thumbnail'), updateCourse);
courseRoutes.patch('/:id/approval', patchCourseApproval); 
courseRoutes.delete('/:id', deleteCourse);
courseRoutes.get('/instructor/:instructor_id', getInstructorsCourses);
// courseRoutes.get('/instructor/:instructor_id', getInstructorsCourses);
courseRoutes.get('/category/:categoryId', getCategoryCourses);


export default courseRoutes;
