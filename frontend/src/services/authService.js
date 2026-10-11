import api from './api';

export const login = async (emailOrUsername, password) => {
  const response = await api.post('/auth/login', { usernameOrEmail: emailOrUsername, password });
  if (response.data.token) {
    localStorage.setItem('token', response.data.token);
    localStorage.setItem('user', JSON.stringify(response.data));
  }
  return response.data;
};

export const register = async ({ fullName, email, password }) => {
  // Derive a username from the email (part before @)
  const username = email.split('@')[0].replace(/[^a-zA-Z0-9_]/g, '_');
  const response = await api.post('/auth/register', { username, fullName, email, password });
  return response.data;
};

export const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};

export const getCurrentUser = () => {
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user) : null;
};
