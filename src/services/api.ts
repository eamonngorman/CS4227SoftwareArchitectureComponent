import axios from 'axios';

const API_URL = 'http://localhost:8080/api';

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

export const authApi = {
  login: async (email: string, password: string) => {
    const response = await api.post('/users/login', { username: email, password });
    return response.data;
  },

  register: async (userData: any) => {
    const response = await api.post('/users/register', {
      username: userData.email,
      password: userData.password,
      firstName: userData.firstName,
      lastName: userData.lastName
    });
    return response.data;
  }
}; 