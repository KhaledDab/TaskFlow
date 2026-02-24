import axios from 'axios';

const api = axios.create({
  baseURL:'http://localhost:3001/api',
  withCredentials: false,
});

// attach JWT token if exists
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// global handling for auth errors
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err?.response?.status === 401) {
      // token expired
      localStorage.removeItem("token");
    }
    return Promise.reject(err);
  }
);

export default api;
