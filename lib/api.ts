import axios from 'axios';

export const API_URL = process.env.NEXT_PUBLIC_API_URL;
export const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;
// export const

const api = axios.create({
  baseURL: `${API_URL}/api/v1`,
  withCredentials: true,
  // params: { "ngrok-skip-browser-warning": 1 },
  timeout: 900000,
});

// if (typeof window !== "undefined") {
//   api.interceptors.request.use(
//     (config) => {
//       const token = localStorage.getItem("token");
//       if (token) {
//         config.headers.Authorization = `Bearer ${token}`;
//       }
//       return config;
//     },
//     (error) => {
//       // Handle request errors
//       return Promise.reject(error);
//     }
//   );
// }

export default api;
