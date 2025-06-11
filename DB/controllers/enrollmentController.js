// controllers/enrollmentController.js

class EnrollmentController {
  constructor(enrollmentModel) {
    this.enrollmentModel = enrollmentModel;

    // Bind methods if you want to use them as route handlers directly
    this.enrollCourse = this.enrollCourse.bind(this);
    this.getEnrollment = this.getEnrollment.bind(this);
    this.updateProgress = this.updateProgress.bind(this);
    this.getEnrollments = this.getEnrollments.bind(this);
    this.getEnrollmentProgress = this.getEnrollmentProgress.bind(this);
  }

  async enrollCourse(req, res) {
    try {
      const { userId, courseId } = req.body;
      if (!userId || !courseId) {
        return res
          .status(400)
          .json({ error: "UserId and courseId are required" });
      }

      const enrollment = await this.enrollmentModel.createEnrollment(
        userId,
        courseId
      );
      res.status(201).json(enrollment);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Failed to enroll in course" });
    }
  }

  async getEnrollment(req, res) {
    try {
      const { id } = req.params;
      const enrollment = await this.enrollmentModel.getEnrollmentById(id);
      if (!enrollment) {
        return res.status(404).json({ error: "Enrollment not found" });
      }
      res.json(enrollment);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Failed to get enrollment details" });
    }
  }

  async updateProgress(req, res) {
    try {
      // نستخدم userId و courseId من body كما في طلبك
      const { progress, userId, courseId } = req.body;

      // التحقق من صحة قيمة التقدم
      if (progress === undefined || progress < 0 || progress > 100) {
        return res
          .status(400)
          .json({ error: "Progress must be between 0 and 100" });
      }

      if (!userId || !courseId) {
        return res.status(400).json({ error: "Missing userId or courseId" });
      }

      // استدعاء موديل تحديث التقدم
      // افترضت أن الدالة updateProgress في الموديل تأخذ هذه القيم بهذا الترتيب
      const updated = await this.enrollmentModel.updateProgress(
        progress,
        userId,
        courseId
      );

      if (!updated) {
        return res.status(404).json({ error: "Enrollment not found" });
      }

      // نرجع التحديث الذي حصل
      return res.json(updated);
    } catch (err) {
      console.error("Error in updateProgress:", err);
      return res.status(500).json({ error: "Failed to update progress" });
    }
  }

  // Get all enrollments
  async getEnrollments(req, res) {
    try {
      const enrollments = await this.enrollmentModel.getAll();
      res.status(200).json(enrollments);
    } catch (error) {
      res.status(500).json({
        message: "Error fetching enrollments",
        error: error.message,
      });
    }
  }

  async getEnrollmentProgress(req, res) {
  try {
    const { userId, courseId } = req.params; 
    const enrollment = await this.enrollmentModel.getProgress(userId, courseId);
    res.status(200).json(enrollment);
  } catch (error) {
    res.status(500).json({
      message: "Error fetching enrollment progress",
      error: error.message,
    });
  }
}
}
export default EnrollmentController;
