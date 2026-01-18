import Project from "../models/Project.js";
import Task from "../models/Task.js";
import Activity from "../models/Activity.js";
/* ================= CREATE PROJECT ================= */
export const createProject = async (req, res) => {
  try {
    let projectManager;

    if (req.user.role === "Admin") {
      if (!req.body.projectManager) {
        return res.status(400).json({
          success: false,
          message: "Project Manager is required",
        });
      }
      projectManager = req.body.projectManager;
    }

    else if (req.user.role === "Project Manager") {
      projectManager = req.user.userId; 
    }

    else {
      return res.status(403).json({
        success: false,
        message: "Not allowed to create project",
      });
    }

    const project = await Project.create({
      name: req.body.name,
      description: req.body.description,
      status: req.body.status,
      priority: req.body.priority,
      deadline: req.body.deadline,

      projectManager,
      createdBy: req.user.userId,
    });

    
    await Activity.create({
      projectId: project._id,
      userId: req.user.userId,
      action: "PROJECT_CREATED",
      message: `Project "${project.name}" was created`,
    });

    res.status(201).json({ success: true, project });

  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

/* ================= GET PROJECTS ================= */
export const getProjects = async (req, res) => {
  try {
    let projects = [];

    if (req.user.role === "Admin" || req.user.role === "Project Manager") {
      
      projects = await Project.find().sort({ createdAt: -1 });
    } 
    else {
      
      const tasks = await Task.find({
        assignedTo: req.user.userId,
      }).select("projectId");

      const projectIds = tasks.map(t => t.projectId);

      projects = await Project.find({
        _id: { $in: projectIds },
      }).sort({ createdAt: -1 });
    }

    const projectsWithStats = await Promise.all(
      projects.map(async (project) => {
        const totaltasks = await Task.countDocuments({ projectId: project._id });
        const completedtasks = await Task.countDocuments({
          projectId: project._id,
          status: "Completed",
        });

        return {
          ...project.toObject(),
          totaltasks,
          completedtasks,
        };
      })
    );

    res.json({ success: true, projects: projectsWithStats });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};


/* ================= UPDATE PROJECT ================= */
export const updateProject = async (req, res) => {
  try {
    const updatedProject = await Project.findByIdAndUpdate(
      req.params.id,
      {
        name: req.body.name,
        description: req.body.description,
        status: req.body.status,
        priority: req.body.priority,
        deadline: req.body.deadline,
      },
      { new: true }
    );

    if (!updatedProject) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    await Activity.create({
      projectId: updatedProject._id,
      userId: req.user.userId,
      action: "PROJECT_UPDATED",
      message: `Project "${updatedProject.name}" was updated`,
    });

    res.json({ success: true, project: updatedProject });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};


/* ================= DELETE PROJECT ================= */
export const deleteProject = async (req, res) => {
  try {
    await Project.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: "Project deleted" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
