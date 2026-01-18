import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { MyContext } from "../pages/Mycontext";
import "./Navbar.css";

const Navbar = () => {
  const { isLogin, setIsLogin, user, setUser, setRole } = useContext(MyContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    setIsLogin(false);
    setUser(null);
    setRole("");
    navigate("/login");
  };

  return (
    <nav className="custom-navbar">
      <div className="nav-container">
        {/* Title */}
        <div
          className="nav-title"
          onClick={() => navigate("/dashboard")}
          style={{ cursor: "pointer" }}
        >
          Project Management Dashboard
        </div>

        {/* Right section */}
        <div className="nav-actions">
          {isLogin ? (
            <>
              <span className="nav-user">
                {user?.name} ({user?.role})
              </span>
              <button className="logout-btn" onClick={handleLogout}>
                Logout
              </button>
            </>
          ) : (
            <button className="login-btn" onClick={() => navigate("/login")}>
              Login
            </button>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
