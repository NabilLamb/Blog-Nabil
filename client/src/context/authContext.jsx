import { useState, useEffect, createContext } from "react";

export const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(
    JSON.parse(localStorage.getItem("user")) || null
  );
  const [error, setError] = useState(null);

  const login = async (inputs) => {
    setError(null);
    try {
      const response = await fetch("http://localhost:8800/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(inputs),
        credentials: "include",
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Login failed");
        return false;
      }

      setCurrentUser(data);
      return true; 
    } catch (error) {
      setError("Server connection error");
      return false; 
    }
  };

  const logout = async () => {
    try {
      await fetch("http://localhost:8800/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });
      setCurrentUser(null);
    } catch (error) {
      setError("Server connection error");
    }
  };

  // Handle localStorage persistence
  useEffect(() => {
    currentUser
      ? localStorage.setItem("user", JSON.stringify(currentUser))
      : localStorage.removeItem("user");
  }, [currentUser]);

  return (
    <AuthContext.Provider
      value={{ currentUser, login, logout, error, setError }}
    >
      {children}
    </AuthContext.Provider>
  );
};
