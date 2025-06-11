// src/contexts/UserContext.js
import React, { createContext, useState, useEffect } from "react";
import { parseJwt } from "../helpers/jwtHelper";
export const UserContext = createContext();

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
          email: decoded.email,
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
        email: decoded.email,
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
    <UserContext.Provider value={{ isAuthenticated, user, login, logout }}>
      {children}
    </UserContext.Provider>
  );
};
