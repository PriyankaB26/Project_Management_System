import express from "express";
import {
  createProject,
  getProjects,
  updateProject,
  deleteProject
} from "../controllers/projectController.js";
import { protect } from "../middleware/authMiddleware.js";
import { allowRoles } from "../middleware/roleMiddleware.js";

const router = express.Router();

router.get("/", protect, getProjects);
router.post("/", protect, allowRoles("Admin", "Project Manager"), createProject);
router.put("/:id", protect, allowRoles("Admin", "Project Manager"), updateProject);
router.delete("/:id", protect, allowRoles("Admin"), deleteProject);

export default router;
