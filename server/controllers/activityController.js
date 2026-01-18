import Activity from "../models/Activity.js";

export const getProjectActivities = async (req, res) => {
  try {
    const { projectId } = req.params;

    const activities = await Activity.find({ projectId })
      .populate("userId", "name role")
      .sort({ createdAt: -1 });

    res.json({ success: true, data: activities });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to fetch activities" });
  }
};

export const getAllActivities = async (req, res) => {
  try {
    const activities = await Activity.find({})
      .populate("userId", "name role")
      .sort({ createdAt: -1 });

    res.json({ success: true, data: activities });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to fetch activities" });
  }
};
