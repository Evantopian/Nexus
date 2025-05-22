import React, { createContext, useState, useEffect, useContext } from "react";
import axios from "axios";
import client from "../lib/apollo-client";
import AsyncStorage from "@react-native-async-storage/async-storage"; 
import { PROFILE_QUERY } from "../graphql/user/userQueries";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    client
      .query({
        query: PROFILE_QUERY,
      })
      .then((res) => {
        setUser(res.data.profile);
        // console.log("Fetched User:", res.data.profile);
     })
      .catch((err) => console.error("Profile fetch failed", err))
      .finally(() => setLoading(false));
  }, []);

  const refreshUser = async () => {
    try {
      const res = await client.query({
        query: PROFILE_QUERY,
        fetchPolicy: "no-cache", // Ensures fresh data
      });
      setUser(res.data.profile); // Update user state
      console.log("User info:", res.data.profile); // Log the updated user data
    } catch (err) {
      console.error("Refresh failed", err);
    }
  };

  const login = async (email, password) => {
    const response = await axios.post(
      "/login",
      { email, password },
      { withCredentials: true }
    );
    const token = response.data.token;
    await AsyncStorage.setItem("authToken", token);
    await refreshUser();
  };

  const signup = async (username, email, password) => {
    const response = await axios.post(
      "/signup",
      { username, email, password },
      { withCredentials: true }
    );
    const token = response.data.token;
    await AsyncStorage.setItem("authToken", token); // Use AsyncStorage here
    await refreshUser();
  };

  const logout = async () => {
    const token = await AsyncStorage.getItem("authToken");
    try {
      await axios.post("/logout", {}, { withCredentials: true, headers: {
        Authorization: `Bearer ${token}`,
      },});
      setUser(null);
      await AsyncStorage.removeItem("authToken");
      await client.clearStore();
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, setUser, loading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}