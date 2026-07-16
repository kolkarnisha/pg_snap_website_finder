/**
 * Axios instance for all API calls.
 * ────────────────────────────────────────────────
 * - Base URL from VITE_API_URL env (defaults to /api)
 * - Request interceptor: injects Bearer token
 * - Response interceptor: handles 401 auto-logout
 */
import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  headers: { 'Content-Type': 'application/json' },
  timeout: 15000,
});

// ── Request interceptor — attach JWT ─────────────
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('pg_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ── Response interceptor — handle 401 ────────────
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Clear stale session silently
      localStorage.removeItem('pg_token');
      localStorage.removeItem('pg_user');
    }
    return Promise.reject(error);
  }
);

export default api;
