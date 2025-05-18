import api from './api';

export const login = async (data) => api.post('/auth/login', data);
export const Signup = async (data) => api.post('/auth/signup', data);
export const logout = () => localStorage.removeItem('token');
