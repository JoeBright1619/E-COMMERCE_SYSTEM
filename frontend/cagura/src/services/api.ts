import axios from 'axios';

// The base URL for the backend ASP.NET API
const API_URL = 'https://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for adding the JWT token to headers
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('cagura_token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle standard API envelope { success, message, data }
api.interceptors.response.use(
  (response) => {
    // If the response follows our {success, message, data} envelope, unwrap the data
    if (response.data && typeof response.data.success !== 'undefined') {
      if (response.data.success) {
        return response.data.data;
      }
      return Promise.reject(new Error(response.data.message || 'API Error'));
    }
    return response.data;
  },
  (error) => {
    const message = error.response?.data?.message || error.message || 'An unexpected error occurred';
    return Promise.reject(new Error(message));
  }
);

export default api;
