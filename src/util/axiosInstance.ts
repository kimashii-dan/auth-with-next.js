/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "axios";
const api = axios.create({
  baseURL: "/api",
  withCredentials: true,
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (
      error.response?.status === 403 ||
      (error.response?.status === 401 && !originalRequest._retry)
    ) {
      originalRequest._retry = true;

      try {
        await axios.post(
          "/api/auth/refresh",
          {},
          {
            withCredentials: true,
          }
        );

        return api(originalRequest);
      } catch (error: any) {
        console.log(error);
        try {
          await axios.post("/api/auth/logout", {}, { withCredentials: true });
        } catch (logoutError) {
          console.error("Failed to delete tokens:", logoutError);
        }
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

export default api;
