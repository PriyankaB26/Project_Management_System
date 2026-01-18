import express from "express";
import Project from "../models/Project.js";
import Task from "../models/Task.js";
import User from "../models/User.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const projects = await Project.find().select("status");
    const tasks = await Task.find().select("status");
    const users = await User.find().select("name role");

    res.json({
      success: true,
      projects,
      tasks,
      users
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

export default router;
