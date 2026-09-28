import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('faq_ai_token');
    if (token) {
      authAPI.getMe()
        .then(res => {
          setUser(res.user);
        })
        .catch(() => {
          localStorage.removeItem('faq_ai_token');
          setUser(null);
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (email, password) => {
    const res = await authAPI.login({ email, password });
    localStorage.setItem('faq_ai_token', res.token);
    setUser(res.user);
    return res.user;
  };

  const register = async (name, email, password, role) => {
    const res = await authAPI.register({ name, email, password, role });
    localStorage.setItem('faq_ai_token', res.token);
    setUser(res.user);
    return res.user;
  };

  const loginWithGoogle = async (googleData) => {
    const res = await authAPI.googleLogin(googleData);
    localStorage.setItem('faq_ai_token', res.token);
    setUser(res.user);
    return res.user;
  };

  const logout = () => {
    localStorage.removeItem('faq_ai_token');
    setUser(null);
  };

  const updateUserProfile = (updatedUser) => {
    setUser(prev => ({ ...prev, ...updatedUser }));
  };

  const value = {
    user,
    loading,
    login,
    register,
    loginWithGoogle,
    logout,
    updateUserProfile,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'Admin',
    isCreator: user?.role === 'Content Creator' || user?.role === 'Admin'
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
