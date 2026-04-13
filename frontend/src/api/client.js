import axios from 'axios';

const client = axios.create({
  baseURL: '/api',
});

// Request interceptor to attach JWT token
client.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('jwt_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle unauthenticated errors gracefully
client.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('jwt_token');
      // Redirect to login if needed, or let components handle it
      if (window.location.pathname !== '/login' && window.location.pathname !== '/contact') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default client;
