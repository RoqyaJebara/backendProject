import {
  getCourseAnalytics,
  getStudents,
  getInstructors,
  getAllStudentsEnrollments,
} from "../models/analyticModel.js";

export async function getAnalytics(req, res) {
  try {
    const analytics = await getCourseAnalytics();
    res.json(analytics);
  } catch (error) {
    console.error("Error fetching analytics:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}
export async function getAnalyticsSummary(req, res) {
  try {
    const courses = await getCourseAnalytics();
    const students = await getStudents();
    const instructors = await getInstructors();

    res.json({
      courses,
      students: {
        count: students.length,
        names: students.map((s) => s.name),
      },
      instructors: {
        count: instructors.length,
        names: instructors.map((i) => i.name),
      },
    });
  } catch (err) {
    console.error("Error fetching analytics summary:", err);
    res.status(500).json({ error: "Failed to fetch analytics summary" });
  }
}
export async function getStudentsProgress(req, res) {
  try {
    const enrollments = await getAllStudentsEnrollments();
    res.json(enrollments);
  } catch (error) {
    console.error("Error fetching students enrollments and progress:", error);
    res.status(500).json({ error: "Server error" });
  }
}
