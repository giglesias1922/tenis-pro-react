// src/contexts/UserContext.js
import React, { createContext, useState, useEffect } from "react";

export const UserContext = createContext();

function parseJwt(token) {
  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );
    return JSON.parse(jsonPayload);
  } catch {
    return null;
  }
}

export const UserProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const decoded = parseJwt(token);
      if (decoded) {
        setUser({
          id: decoded.userId,
          name: decoded.unique_name,
          role: decoded.role,
          imageUrl: decoded.imageUrl, // <-- acá está la url de la imagen
        });
        setIsAuthenticated(true);
      }
    }
  }, []);

  const login = (token) => {
    localStorage.setItem("token", token);
    const decoded = parseJwt(token);
    if (decoded) {
      setUser({
        id: decoded.userId,
        name: decoded.unique_name,
        role: decoded.role,
        imageUrl: decoded.imageUrl,
      });
      setIsAuthenticated(true);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
    setIsAuthenticated(false);
  };

  return (
    <UserContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </UserContext.Provider>
  );
};
