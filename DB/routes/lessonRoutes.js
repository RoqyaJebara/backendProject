import express from "express";
import {deleteLesson, updateLesson, createLesson ,getLessons,getLesson} from "../controllers/lessonController.js";


const lessonRoutes = express.Router();

lessonRoutes.get("/:moduleId", getLessons);
lessonRoutes.get("/lesson/:id", getLesson);
lessonRoutes.post("/:moduleId", createLesson);
lessonRoutes.put("/:id", updateLesson);
lessonRoutes.delete("/:id", deleteLesson);

export default lessonRoutes;
