import axios from 'axios';

// Base instance configured to point to the API Gateway
export const api = axios.create({
  baseURL: 'http://localhost:8080/api/v1',
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
