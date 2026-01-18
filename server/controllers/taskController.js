import Task from "../models/Task.js";
import Activity from "../models/Activity.js";
import Project from "../models/Project.js";

export const updateProjectStats = async (projectId) => {
  const total = await Task.countDocuments({ projectId });
  const completed = await Task.countDocuments({
    projectId,
    status: "Completed",
  });

  await Project.findByIdAndUpdate(projectId, {
    totaltasks: total,
    completedtasks: completed,
  });
};

/* ================= CREATE TASK ================= */
export const createTask = async (req, res) => {
  try {
    const task = await Task.create({
      title: req.body.title,
      description: req.body.description,
      status: req.body.status,
      priority: req.body.priority,
      assignedTo: req.body.assignedTo,
      projectId: req.body.projectId,
      createdBy: req.user.userId,
      dueDate: req.body.dueDate,
    });

    // UPDATE PROJECT COUNTS
    await updateProjectStats(task.projectId);

    //  ACTIVITY LOG
    await Activity.create({
      projectId: task.projectId,
      userId: req.user.userId,
      action: "TASK_CREATED",
      message: `Task "${task.title}" was created`,
    });

    res.status(201).json({ success: true, task });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

/* ================= GET TASKS ================= */
export const getTasks = async (req, res) => {
  try {
    const tasks = await Task.find({ projectId: req.params.projectId })
      .populate("assignedTo", "name email");

    res.json({ success: true, tasks });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
export const getAllTasks = async (req, res) => {
  try {
    let tasks = [];

    if (req.user.role === "Admin" || req.user.role === "Project Manager") {
      tasks = await Task.find();
    } else {
      tasks = await Task.find({ assignedTo: req.user.userId });
    }

    res.json({ success: true, tasks });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

/* ================= UPDATE TASK ================= */
export const updateTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    if (
      req.user.role === "Team Member" &&
      task.assignedTo.toString() !== req.user.userId
    ) {
      return res.status(403).json({ message: "Not allowed" });
    }

    const oldStatus = task.status;

    Object.assign(task, req.body);
    await task.save();

    await updateProjectStats(task.projectId);

    if (req.body.status && req.body.status !== oldStatus) {
      await Activity.create({
        projectId: task.projectId,
        userId: req.user.userId,
        action: "TASK_STATUS_UPDATED",
        message: `Task "${task.title}" status changed from ${oldStatus} to ${task.status}`,
      });
    }

    res.json({ success: true, task });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

/* ================= DELETE TASK ================= */
export const deleteTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    await Task.findByIdAndDelete(req.params.id);

    // 🔥 UPDATE PROJECT COUNTS
    await updateProjectStats(task.projectId);

    // 🔔 ACTIVITY LOG
    await Activity.create({
      projectId: task.projectId,
      userId: req.user.userId,
      action: "TASK_DELETED",
      message: `Task "${task.title}" was deleted`,
    });

    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
