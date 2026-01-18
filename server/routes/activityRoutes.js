import express from "express";
import { getProjectActivities, getAllActivities } from "../controllers/activityController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", protect, getAllActivities);

router.get("/:projectId", protect, getProjectActivities);

export default router;
