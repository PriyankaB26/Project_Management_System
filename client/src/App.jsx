import "./App.css";
import { Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import { useContext } from "react";
import { MyContext } from "./pages/Mycontext";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Projects from "./pages/Projects";
import Tasks from "./pages/Tasks";
import Dashboard from "./pages/Dashboard";
function App() {
  const { isLogin } = useContext(MyContext);
  return (
    <div className="app-container">
      <Navbar />

      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" />} />

        <Route
          path="/dashboard"
          element={<Dashboard />}
        />

          <Route
            path="/projects"
            element={isLogin ? <Projects /> : <Navigate to="/login" />}
          />

        <Route path="/tasks/:projectId" element={isLogin ? <Tasks /> : <Navigate to="/login" />} />

        {/* Auth routes */}
        <Route path="/login" element={isLogin ? <Navigate to="/dashboard" /> : <Login />} />
        <Route path="/register" element={isLogin ? <Navigate to="/dashboard" /> : <Register />} />
      </Routes>
    </div>
  );
}

export default App;
