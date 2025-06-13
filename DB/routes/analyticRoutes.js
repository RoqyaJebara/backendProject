import express from 'express';
import { getAnalytics,getAnalyticsSummary,getStudentsProgress } from '../controllers/analyticController.js';


const AnalyticRoutes = express.Router();
AnalyticRoutes.get('/analytics', getAnalytics);
AnalyticRoutes.get("/analytics/summary",getAnalyticsSummary);
AnalyticRoutes.get("/students-progress", getStudentsProgress);

export default AnalyticRoutes;
;