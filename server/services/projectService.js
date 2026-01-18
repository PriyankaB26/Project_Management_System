import axios from "axios";

const API = axios.create({
  baseURL: "https://project-management-system-zf4d.onrender.com", 
});

API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");
  if (token) req.headers.Authorization = `Bearer ${token}`;
  return req;
});

export const fetchProjects = () => API.get("/projects");
