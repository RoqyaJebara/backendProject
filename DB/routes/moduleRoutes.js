import express from "express";

import {deleteModule,updateModule,createModule,getModules,getModule} from "../controllers/moduleController.js";

const moduleRoutes = express.Router();
moduleRoutes.get("/:courseId", getModules);
moduleRoutes.get("/module/:Id", getModule);
moduleRoutes.post("/:courseId", createModule);
moduleRoutes.put("/:id", updateModule);
moduleRoutes.delete("/:id",deleteModule);

export default moduleRoutes;
