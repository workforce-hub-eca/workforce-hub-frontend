import axios from 'axios';

export const api = axios.create({
  baseURL: '/api/v1', 
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
