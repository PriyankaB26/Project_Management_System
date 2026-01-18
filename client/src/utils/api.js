import axios from "axios";

const apiUrl = "http://localhost:5000";

export const refreshAccessToken = async () => {
  const refreshToken = localStorage.getItem("refreshToken");
  if (!refreshToken) {
    throw new Error("No refresh token available");
  }

  try {
    const response = await axios.post(`${apiUrl}/api/auth/refresh-token`, {
      refreshToken,
    });

    if (response.data.success) {
      localStorage.setItem("accessToken", response.data.accessToken);
      return response.data.accessToken;
    } else {
      throw new Error("Failed to refresh token");
    }
  } catch (error) {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("userInfo");
    window.location.href = "/login";
    throw error;
  }
};


export const fetchDataFromApi = async (endpoint, options = {}) => {
  try {
    const token = localStorage.getItem("accessToken");
    const res = await axios.get(`${apiUrl}${endpoint}`, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      ...options,
    });
    return res.data;
  } catch (error) {
    console.error("fetchDataFromApi error:", error.response?.data || error.message);
    return { success: false, message: error.response?.data?.message || error.message };
  }
};


export const postData = async (url, data, options = {}) => {
  try {
    const token = localStorage.getItem("accessToken");
    const res = await axios.post(`${apiUrl}${url}`, data, {
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      ...options,
    });
    return res.data;
  } catch (error) {
    console.error("postData error:", error.response?.data || error);
    throw new Error(error.response?.data?.message || "Network error");
  }
};

// PUT
export const putData = async (url, data, options = {}) => {
  try {
    const token = localStorage.getItem("accessToken");
    const res = await axios.put(`${apiUrl}${url}`, data, {
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      ...options,
    });
    return res.data;
  } catch (error) {
    console.error("putData error:", error.response?.data || error);
    throw new Error(error.response?.data?.message || "Network error");
  }
};

// DELETE
export const deleteData = async (url) => {
  try {
    const token = localStorage.getItem("accessToken");
    const res = await axios.delete(`${apiUrl}${url}`, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
    return res.data;
  } catch (error) {
    console.error("deleteData error:", error.response?.data || error);
    throw new Error(error.response?.data?.message || "Network error");
  }
};
