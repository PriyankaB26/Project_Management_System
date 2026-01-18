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

app.use(cors({
  origin: [
    'https://projectmanagementsystem1.vercel.app',
    'https://projectmanagemen-git-1af747-priyankabarman262005-2479s-projects.vercel.app',
    'https://projectmanagementsystem1-kwmmamaea.vercel.app',
    'http://localhost:3000', // for local development
    'http://localhost:5173'  // for Vite dev server
  ],
  credentials: true
}));
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
