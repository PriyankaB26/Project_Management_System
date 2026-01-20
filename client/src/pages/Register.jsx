import React, { useContext, useState } from "react";
import { postData } from "../utils/api";
import { MyContext } from "./Mycontext";
import { useNavigate } from "react-router-dom";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { IoMdEye, IoMdEyeOff } from "react-icons/io";

const Register = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [formFields, setFormFields] = useState({ name: "", email: "", password: "", role: "" });

  const context = useContext(MyContext);
  const navigate = useNavigate();

  const onChangeInput = (e) => setFormFields({ ...formFields, [e.target.name]: e.target.value });

  const validateForm = () => {
    const { name, email, password, role } = formFields;
    if (!name.trim()) return context.openAlertBox("error", "Name is required");
    if (!email.trim()) return context.openAlertBox("error", "Email is required");
    if (!/^\S+@\S+\.\S+$/.test(email)) return context.openAlertBox("error", "Invalid email format");
    if (!role) return context.openAlertBox("error", "Please select a role");
    if (!password) return context.openAlertBox("error", "Password is required");
    if (password.length < 6) return context.openAlertBox("error", "Password must be at least 6 characters");
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
      const res = await postData("/auth/register", formFields);
      if (res.success) {
        context.openAlertBox("success", res.message);
        setTimeout(() => {
          setFormFields({ name: "", email: "", password: "", role: "" });
          navigate("/login");
        }, 1500);
      } else {
        context.openAlertBox("error", res.message || "Registration failed");
      }
    } catch (error) {
      console.error("Register error:", error);
      context.openAlertBox("error", "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="d-flex align-items-center justify-content-center vh-100 auth-pages">
      <div className="card shadow p-4" style={{ maxWidth: "420px", width: "100%" }}>
        <h4 className="text-center mb-4">Create Account</h4>

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Name *</label>
            <input type="text" name="name" value={formFields.name} onChange={onChangeInput} className="form-control" disabled={isLoading} />
          </div>

          <div className="mb-3">
            <label className="form-label">Email *</label>
            <input type="email" name="email" value={formFields.email} onChange={onChangeInput} className="form-control" disabled={isLoading} />
          </div>

          <div className="mb-3">
            <label className="form-label">Role *</label>
            <select name="role" value={formFields.role} onChange={onChangeInput} className="form-select" disabled={isLoading}>
              <option value="">Select role</option>
              <option value="Admin">Admin</option>
              <option value="Project Manager">Project Manager</option>
              <option value="Team Member">Team Member</option>
            </select>
          </div>

          <div className="mb-2">
            <label className="form-label">Password *</label>
            <div className="input-group">
              <input type={showPassword ? "text" : "password"} name="password" value={formFields.password} onChange={onChangeInput} className="form-control" disabled={isLoading} />
              <span className="input-group-text" style={{ cursor: "pointer" }} onClick={() => setShowPassword(!showPassword)}>
                {showPassword ? <IoMdEye /> : <IoMdEyeOff />}
              </span>
            </div>
          </div>

          <div className="d-grid gap-2 my-4">
            <button type="submit" className="btn btn-primary" disabled={isLoading}>
              {isLoading ? <AiOutlineLoading3Quarters className="spinner-border spinner-border-sm" /> : "Sign Up"}
            </button>

            <button type="button" className="btn btn-outline-secondary" disabled={isLoading} onClick={() => setFormFields({ name: "", email: "", password: "", role: "" })}>
              Cancel
            </button>
          </div>

          <p className="text-center mb-0">
            Already have an account?{" "}
            <span className="text-primary" style={{ cursor: "pointer" }} onClick={() => navigate("/login")}>
              Sign In
            </span>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Register;
