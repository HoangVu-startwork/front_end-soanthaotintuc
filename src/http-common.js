import axios from "axios";

// Create initial axios instance without Authorization header
const api = axios.create({
  baseURL: process.env.REACT_APP_API,
  headers: {
    "Content-type": "application/json",
  },
});

// Update the initial token in axios instance from Local Storage
const updateTokenInApi = () => {
  const token = window.localStorage.getItem("token");
  api.defaults.headers.common["Authorization"] = `${token}`;
};
// Call the original update function
updateTokenInApi();
// Track token changes in Local Storage
window.addEventListener("storage", (event) => {
  if (event.key === "token") {
    // Update token value when token changes in Local Storage
    window.localStorage.removeItem('token');
    window.location.replace("/");
    // Update tokens in axios instance
    updateTokenInApi();
  }
});

export default api;