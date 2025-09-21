import axios, { AxiosError, AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';

// Simple API client without complex type definitions
const isServer = typeof window === 'undefined';

// Create axios instance
const createApiClient = (): AxiosInstance => {
  const baseURL = isServer
    ? process.env.API_BASE_URL || 'http://localhost:8000'
    : process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

  const instance = axios.create({
    baseURL,
    headers: {
      'Content-Type': 'application/json',
    },
    timeout: 30000, // 30 seconds
    withCredentials: true,
  });

  // Request interceptor
  instance.interceptors.request.use(
    (config) => {
      // Add auth token if exists
      if (!isServer && typeof window !== 'undefined') {
        try {
          const token = localStorage.getItem('token');
          if (token && config.headers) {
            config.headers.Authorization = `Bearer ${token}`;
          }
        } catch (error) {
          console.warn('Error accessing localStorage:', error);
        }
      }
      return config;
    },
    (error: AxiosError) => {
      return Promise.reject(error);
    }
  );

  // Response interceptor
  instance.interceptors.response.use(
    (response) => response,
    (error: AxiosError) => {
      if (error.response) {
        console.error('API Error Response:', {
          status: error.response.status,
          data: error.response.data,
        });
      } else if (error.request) {
        console.error('API Request Error:', error.request);
      } else {
        console.error('API Error:', error.message);
      }
      return Promise.reject(error);
    }
  );

  return instance;
};

// Create and export the API client
export const api = createApiClient();
