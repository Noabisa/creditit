// services/api.js (example)
import axios from 'axios';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL + '/api',
});

// Attach token to every request if available
api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');  // or wherever you store it
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
