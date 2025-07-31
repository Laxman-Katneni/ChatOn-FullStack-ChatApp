import axios from "axios";

export const axiosInstance = axios.create({
  //baseURL: "http://localhost:5001/api", // backend port // to send a req from frontend to backend
  baseURL:
    import.meta.env.MODE === "development"
      ? "http://localhost:5001/api"
      : "/api",
  withCredentials: true, // to send cookies with every single request
});
