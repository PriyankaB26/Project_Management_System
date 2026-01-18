import express from "express";
import {
  createTask,
  getTasks,
  updateTask,
  deleteTask,
  getAllTasks
} from "../controllers/taskController.js";
import { protect } from "../middleware/authMiddleware.js";
import { allowRoles } from "../middleware/roleMiddleware.js";

const router = express.Router();

router.get("/", protect, getAllTasks);
router.get("/:projectId", protect, getTasks);

router.post("/", protect, allowRoles("Admin", "Project Manager"), createTask);
router.put("/:id", protect, updateTask);
router.delete("/:id", protect, allowRoles("Admin"), deleteTask);
export default router;
