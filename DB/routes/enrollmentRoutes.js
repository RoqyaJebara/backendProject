import express from 'express';

export function enrollmentRoutes(enrollmentController) {
  const enrollmentRoutes = express.Router();

  enrollmentRoutes.post('/enrollments', enrollmentController.enrollCourse);
  enrollmentRoutes.get('/enrollments/:id', enrollmentController.getEnrollment);
  enrollmentRoutes.get('/enrollments', enrollmentController.getEnrollments);
  enrollmentRoutes.get('/enrollment/progress/:userId/:courseId', enrollmentController.getEnrollmentProgress);
  enrollmentRoutes.put('/enrollments/progress', enrollmentController.updateProgress);

  return enrollmentRoutes;
}
