// /* eslint-disable @typescript-eslint/no-explicit-any */
// import axios from "axios";
// import { cookies } from "next/headers";

// const api = axios.create({
//   baseURL: "http://localhost:3000/api",
//   withCredentials: true,
// });

// api.interceptors.response.use(
//   (response) => response,
//   async (error) => {
//     const originalRequest = error.config;

//     if (
//       (error.response?.status === 401 || error.response?.status === 403) &&
//       !originalRequest._retry &&
//       originalRequest.url !== "/auth/refresh"
//     ) {
//       originalRequest._retry = true;

//       const cookieStore = await cookies();
//       const cookieHeader = cookieStore
//         .getAll()
//         .map((cookie) => `${cookie.name}=${cookie.value}`)
//         .join("; ");

//       try {
//         await api.post("/auth/refresh", {
//           headers: { cookie: cookieHeader },
//         });

//         return api(originalRequest);
//       } catch (refreshError: any) {
//         console.error("Refresh token failed:", refreshError);

//         try {
//           await api.post("/users/logout", {
//             headers: { cookie: cookieHeader },
//           });
//         } catch (logoutError) {
//           console.error("Failed to delete tokens:", logoutError);
//         }

//         return Promise.reject(refreshError);
//       }
//     }
//     return Promise.reject(error);
//   }
// );

// export default api;
