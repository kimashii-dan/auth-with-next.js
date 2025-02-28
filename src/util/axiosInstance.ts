/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "axios";
import { redirect } from "next/navigation";

const api = axios.create({
  baseURL: "/api",
  withCredentials: true,
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 403 && !originalRequest._retry) {
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
        redirect("/login");
      }
    }

    if (error.response?.status === 401) {
      redirect("/login");
    }

    return Promise.reject(error);
  }
);

export default api;
