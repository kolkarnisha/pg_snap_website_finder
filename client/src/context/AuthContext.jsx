/**
 * Auth Context
 * ────────────────────────────────────────────────
 * Provides JWT-based authentication state to the
 * entire React application.
 *
 * Storage:
 *  - token → localStorage['pg_token']
 *  - user  → localStorage['pg_user']
 */
import { createContext, useContext, useState, useEffect } from 'react';
import api from '../api/axios.js';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user,  setUser]  = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true); // hydrating from localStorage

  // ── Hydrate from localStorage on mount ─────────────
  useEffect(() => {
    const storedToken = localStorage.getItem('pg_token');
    const storedUser  = localStorage.getItem('pg_user');
    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  // ── Login ────────────────────────────────────────────
  const login = async (email, password) => {
    const { data } = await api.post('/auth/login', { email, password });
    if (data.success) {
      localStorage.setItem('pg_token', data.token);
      localStorage.setItem('pg_user', JSON.stringify(data.user));
      setToken(data.token);
      setUser(data.user);
    }
    return data;
  };

  // ── Register ──────────────────────────────────────────
  const register = async (name, email, password, phone) => {
    const { data } = await api.post('/auth/register', { name, email, password, phone });
    if (data.success) {
      localStorage.setItem('pg_token', data.token);
      localStorage.setItem('pg_user', JSON.stringify(data.user));
      setToken(data.token);
      setUser(data.user);
    }
    return data;
  };

  // ── Logout ────────────────────────────────────────────
  const logout = () => {
    localStorage.removeItem('pg_token');
    localStorage.removeItem('pg_user');
    setToken(null);
    setUser(null);
  };

  const isOwner = user?.role === 'owner';

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout, isOwner }}>
      {children}
    </AuthContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
