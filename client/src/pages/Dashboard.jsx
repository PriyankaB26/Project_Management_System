import { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { MyContext } from "./Mycontext";
import "./Dashboard.css";
import { fetchDataFromApi } from "../utils/api";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";

const Dashboard = () => {
  const { isLogin } = useContext(MyContext);
  const navigate = useNavigate();

  const [projects, setProjects] = useState([]);
  const [users, setUsers] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [activities, setActivities] = useState([]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const res = await fetchDataFromApi("/api/dashboard");
        setProjects(res?.projects || []);
        setUsers(res?.users || []);
        setTasks(res?.tasks || []);
      } catch (err) {
        console.error("Dashboard error:", err);
        setProjects([]);
        setUsers([]);
        setTasks([]);
      }
    };

    fetchDashboardData();
  }, []);

  useEffect(() => {
    const fetchActivities = async () => {
      if (!isLogin) return;

      try {
        const res = await fetchDataFromApi("/api/activities"); 
        if (res.success) setActivities(res.data || []);
      } catch (err) {
        console.error("Activity fetch error:", err);
        setActivities([]);
      }
    };

    fetchActivities();
  }, [isLogin]);
  const active = projects.filter(
    p => p.status?.toLowerCase() === "active"
  ).length;

  const completed = projects.filter(
    p => p.status?.toLowerCase() === "completed"
  ).length;

  const pending = projects.filter(
    p => p.status?.toLowerCase() === "on hold"
  ).length;

  const chartData = [
    { name: "Active", value: active },
    { name: "Pending", value: pending },
    { name: "Completed", value: completed }
  ];

  const COLORS = ["#22c55e", "#facc15", "#3b82f6"];

  return (
    <div className="dashboard-container">
      <div className="dashboard-title-container">
        <h2 className="dashboard-title">Project Overview</h2>
        <button
          className="view-projects-btn"
          onClick={() => navigate(isLogin ? "/projects" : "/login", { state: { from: "/projects" } })}
        >
          View Projects
        </button>
      </div>

      {/* OVERVIEW CARDS */}
      <div className="stats-grid">
        <div className="stat-card active">
          <h3>{active}</h3>
          <p>Active Projects</p>
        </div>

        <div className="stat-card pending">
          <h3>{pending}</h3>
          <p>Pending Projects</p>
        </div>

        <div className="stat-card completed">
          <h3>{completed}</h3>
          <p>Completed Projects</p>
        </div>

        <div className="stat-card total">
          <h3>{projects.length}</h3>
          <p>Total Projects</p>
        </div>
      </div>

      <div className="dashboard-bottom">
        <div className="users-section">
          <h3>Team Members</h3>
          {users.map(user => (
            <div key={user._id} className="user-row">
              <span>{user.name}</span>
              <span className="role">{user.role}</span>
            </div>
          ))}
        </div>

        <div className="chart-section">
          <h3>Project Status</h3>
          <PieChart width={300} height={300}>
            <Pie
              data={chartData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              innerRadius={70}
              outerRadius={100}
            >
              {chartData.map((_, index) => (
                <Cell key={index} fill={COLORS[index]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </div>


      </div>
      {/* ACTIVITY LOG STRIP */}
      {isLogin && (
        <div className="activity-log-section">
          <div className="activity-log-title">Activity Log</div>
          <div className="activity-log-list">
            {activities.length > 0 ? (
              activities.map(activity => (
                <div key={activity._id} className="activity-row">
                  <div className="activity-user">
                    <div className="activity-name">{activity.userId?.name || "Unknown"}</div>
                    <div className="activity-role">({activity.userId?.role || "N/A"})</div>
                  </div>
                  <span className="activity-action">{activity.action}: {activity.message}</span>
                  <span className="activity-time">
                    {new Date(activity.createdAt).toLocaleString()}
                  </span>
                </div>
              ))
            ) : (
              <div className="no-activity">No activities yet.</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};


export default Dashboard;
