import React, { createContext, useState, useEffect, useContext } from "react";
import axios from "axios";
import { PROFILE_QUERY } from "../graphql/userQueries"; // Adjust path if needed

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const login = async (email, password) => {
    const response = await axios.post(
      "/login",
      { email, password },
      { withCredentials: true }
    );
    const token = response.data.token;
    await localStorage.setItem("authToken", token);
    await refreshUser();
  };

  const signup = async (username, email, password) => {
    const response = await axios.post(
      "/signup",
      { username, email, password },
      { withCredentials: true }
    );
    const token = response.data.token;
    await localStorage.setItem("authToken", token);
    await refreshUser();
  };

  const logout = async () => {
    const token = await localStorage.getItem("authToken");

    try {
      await axios.post(
        "/logout",
        {},
        {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("logged out");
      setUser(null);
      await AsyncStorage.removeItem("authToken");
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}