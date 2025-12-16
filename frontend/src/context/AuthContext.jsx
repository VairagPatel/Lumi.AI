// src/context/AuthContext.jsx
import React, { createContext, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useAuthStore from '../store/useAuthStore';

const AuthContext = createContext({
  user: null,
  isAuthenticated: false,
  login: async () => {},
  googleLogin: async () => {},
  logout: async () => {}
});

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();
  const { 
    user, 
    isAuthenticated,
    login: storeLogin, 
    googleLogin: storeGoogleLogin, 
    logout: storeLogout,
    loadUser 
  } = useAuthStore();

  // Load user from token on mount
  useEffect(() => {
    loadUser();
  }, [loadUser]);

  // Wrapper functions to add navigation
  const login = async (email, password) => {
    await storeLogin({ email, password });
    navigate("/create");
  };

  const googleLogin = async (googleIdToken) => {
    await storeGoogleLogin(googleIdToken);
    navigate("/create");
  };

  const logout = async () => {
    await storeLogout();
    navigate("/auth");
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, googleLogin, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
