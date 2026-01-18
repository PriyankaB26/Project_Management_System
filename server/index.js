import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import authRoutes from "./routes/authRoutes.js";
import connectDB from "./config/db.js";
import activityRoutes from "./routes/activityRoutes.js";
import projectRoutes from "./routes/projectRoutes.js";
import taskRoutes from "./routes/taskRoutes.js";
import userRoutes from "./routes/userRoutes.js"; 
import dashboardRoutes from "./routes/dashboardRoutes.js";

dotenv.config(); 

connectDB();

const app = express();

app.use(cors());
app.use(express.json());
app.use("/api/users", userRoutes);
app.use("/api/dashboard", dashboardRoutes);

app.use("/api/auth", authRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/activities", activityRoutes);
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(` Server running on port ${PORT}`);
});
