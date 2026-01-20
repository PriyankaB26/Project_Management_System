import { createContext, useState, useEffect } from "react";
import { fetchDataFromApi } from "../utils/api";

export const MyContext = createContext();

export const MyContextProvider = ({ children }) => {
  const [alert, setAlert] = useState({ type: "", message: "" });
  const [projectsLoading, setProjectsLoading] = useState(true);

  const [isLogin, setIsLogin] = useState(!!localStorage.getItem("accessToken"));
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("userInfo")) || null;
    } catch {
      return null;
    }
  });
  const [role, setRole] = useState(user?.role || "");

  const [projects, setProjects] = useState([]);
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (token) fetchUserDetails();
  }, []);

  const hasRole = (allowedRoles) => {
    if (!role) return false;
    return allowedRoles.includes(role);
  };

  const fetchUserDetails = async () => {
    try {
      const res = await fetchDataFromApi("/auth/user-details");
      if (res?.success) {
        setUser(res.user || res.data.user);
        setRole(res.user?.role || res.data.user?.role);
        localStorage.setItem("userInfo", JSON.stringify(res.user || res.data.user));
      }
    } catch (error) {
      console.error("Error fetching user details:", error);
    }
  };

  const fetchProjects = async () => {
    try {
      setProjectsLoading(true);
      const res = await fetchDataFromApi("/projects");
      setProjects(res?.projects || res?.data?.projects || []);
    } catch (err) {
      setProjects([]);
    } finally {
      setProjectsLoading(false);
    }
  };

  const fetchTasks = async (projectId) => {
    if (!projectId) return;
    try {
      const res = await fetchDataFromApi(`/tasks/${projectId}`);
      if (res.success) {
        setTasks(res.tasks);
      }
    } catch (err) {
      console.error(err);
    }
  };


  const openAlertBox = (type, message) => {
    setAlert({ type, message });
    setTimeout(() => setAlert({ type: "", message: "" }), 3000);
  };

  const can = (action) => {
    switch (action) {
      case "manageUsers":
      case "manageProjects":
      case "manageAllTasks":
        return role === "Admin";

      case "createProject":
      case "addMembers":
      case "manageOwnTasks":
        return role === "Project Manager" || role === "Admin";

      case "viewAssignedTasks":
      case "updateOwnTasks":
        return ["Team Member", "Project Manager", "Admin"].includes(role);

      default:
        return false;
    }
  };

  return (
    <MyContext.Provider
      value={{
        isLogin,
        setIsLogin,
        user,
        setUser,
        role,
        setRole,
        projects,
        setProjects,
        tasks,
        setTasks,
        fetchProjects,
        fetchTasks,
        hasRole,
        projectsLoading,
        alert,
        openAlertBox,
        can,
      }}
    >
      {children}

      {alert.message && (
        <div
          className={`alert alert-${alert.type === "error" ? "danger" : "success"} position-fixed`}
          style={{
            top: "20px",
            right: "20px",
            zIndex: 9999,
            minWidth: "300px",
          }}
        >
          {alert.message}
        </div>
      )}
    </MyContext.Provider>
  );
};
