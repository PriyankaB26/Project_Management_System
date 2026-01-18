import Project from "../models/Project.js";
import Task from "../models/Task.js";

export const getDashboardStats = async (req, res) => {
  try {
    const activeProjects = await Project.countDocuments({ status: "Active" });

    const pendingTasks = await Task.countDocuments({ status: "Pending" });
    const completedTasks = await Task.countDocuments({ status: "Completed" });

    res.json({
      success: true,
      data: {
        activeProjects,
        pendingTasks,
        completedTasks,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Dashboard data error" });
  }
};
