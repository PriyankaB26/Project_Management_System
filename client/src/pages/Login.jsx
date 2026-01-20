import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { MyContext } from "./Mycontext";
import { postData } from "../utils/api";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { IoMdEye, IoMdEyeOff } from "react-icons/io";

const Login = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [formFields, setFormFields] = useState({ email: "", password: "" });

  const context = useContext(MyContext);
  const navigate = useNavigate();

  const onChangeInput = (e) => setFormFields({ ...formFields, [e.target.name]: e.target.value });

  const validateForm = () => {
    const { email, password } = formFields;

    if (!email.trim()) {
      context.openAlertBox("error", "Email is required");
      return false;
    }

    const emailRegex = /^\S+@\S+\.\S+$/;
    if (!emailRegex.test(email)) {
      context.openAlertBox("error", "Invalid email format");
      return false;
    }

    if (!password) {
      context.openAlertBox("error", "Password is required");
      return false;
    }

    if (password.length < 6) {
      context.openAlertBox("error", "Password must be at least 6 characters");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    if (!validateForm()) {
      setIsLoading(false);
      return;
    }

    try {
      const res = await postData("/auth/login", formFields);


      if (res?.success) {
        context.openAlertBox("success", res.message);

        localStorage.setItem("accessToken", res.data.accessToken);
        localStorage.setItem("refreshToken", res.data.refreshToken);
        localStorage.setItem("userInfo", JSON.stringify(res.data.user));

        context.setIsLogin(true);
        context.setUser(res.data.user);
        context.setRole(res.data.user.role);

        const from = location.state?.from || "/projects";
        navigate(from);
      } else {
        context.openAlertBox("error", res.message || "Login failed");
      }
    } catch (error) {
      console.error("Login error:", error);
      context.openAlertBox("error", error.message || "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="d-flex align-items-center justify-content-center vh-100 auth-pages">
      <div className="card shadow p-4" style={{ maxWidth: "400px", width: "100%" }}>
        <h4 className="text-center mb-4">Sign In</h4>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Email *</label>
            <input
              type="email"
              name="email"
              value={formFields.email}
              onChange={onChangeInput}
              className="form-control"
              disabled={isLoading}
            />
          </div>

          <div className="mb-2">
            <label className="form-label">Password *</label>
            <div className="input-group">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formFields.password}
                onChange={onChangeInput}
                className="form-control"
                disabled={isLoading}
              />
              <span className="input-group-text" style={{ cursor: "pointer" }} onClick={() => setShowPassword(!showPassword)}>
                {showPassword ? <IoMdEye /> : <IoMdEyeOff />}
              </span>
            </div>
          </div>

          <div className="d-grid gap-2 mb-3">
            <button className="btn btn-primary" disabled={isLoading}>
              {isLoading ? <AiOutlineLoading3Quarters className="spinner-border spinner-border-sm" /> : "Log In"}
            </button>
            <button
              type="button"
              className="btn btn-outline-secondary"
              disabled={isLoading}
              onClick={() => setFormFields({ email: "", password: "" })}
            >
              Cancel
            </button>
          </div>

          <p className="text-center mb-0">
            Not registered?{" "}
            <span className="text-primary" style={{ cursor: "pointer" }} onClick={() => navigate("/register")}>
              Sign Up
            </span>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;
