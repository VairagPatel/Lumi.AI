// src/context/AuthContext.jsx
import React, { createContext, useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode"; // ✅ correct for v4+

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  // Load token from localStorage on refresh
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setUser({ email: decoded.sub || decoded.username });
      } catch (err) {
        console.error("Invalid token in storage:", err);
        localStorage.removeItem("token");
      }
    }
  }, []);

  // ✅ Normal login
  const login = async (email, password, tokenFromGoogle = null) => {
    try {
      let token = tokenFromGoogle;

      if (!token) {
        const res = await fetch("http://localhost:8080/api/v1/auth/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username: email, password }),
        });

        if (!res.ok) throw new Error("Login failed");
        const data = await res.json();
        token = data.token;
      }

      localStorage.setItem("token", token);
      const decoded = jwtDecode(token);
      setUser({ email: decoded.sub || decoded.username });

      navigate("/");
    } catch (err) {
      console.error("Login error:", err);
      alert("Login failed!");
    }
  };

  // ✅ Google login reuses same function
  const googleLogin = async (googleIdToken) => {
    try {
      const res = await fetch("http://localhost:8080/api/v1/auth/google", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: googleIdToken }),
      });

      if (!res.ok) throw new Error("Google login failed");
      const data = await res.json();

      await login(null, null, data.token);
    } catch (err) {
      console.error("Google login failed:", err);
      alert("Google login failed");
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
    navigate("/auth");
  };

  return (
    <AuthContext.Provider value={{ user, login, googleLogin, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
