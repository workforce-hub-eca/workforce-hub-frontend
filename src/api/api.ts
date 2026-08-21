import axios from 'axios';

// Base instance configured to point to the API Gateway
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

export const api = axios.create({
  baseURL: `${API_BASE_URL}/api/v1`,
  headers: {
    'Content-Type': 'application/json',
  },
});

// We can add request/response interceptors here for global error handling if needed
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Standardize error handling or trigger global events
    return Promise.reject(error);
  }
);
