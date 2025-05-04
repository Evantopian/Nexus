import React, { createContext, useState, useEffect, useContext } from "react";
import axios from "axios";
import client from "@/lib/apollo-client";
import { PROFILE_QUERY } from "@/graphql/userQueries";

type User = {
  uuid: string;
  username: string;
  email: string;
  profileImg: string | null;
  profileMessage: string | null;
  status: string;
  reputation: number;
  rank: string | null;
  createdAt: string;
  preferences: Preferences;
};

interface Preferences {
  gameType: string;
  playStyle: string;
  region: string;
}

export interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (username: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Fetch user profile on mount using Apollo Client
  useEffect(() => {
    client
      .query<{ profile: User }>({ query: PROFILE_QUERY })
      .then((res) => {
        setUser(res.data.profile);
        // console.log("Fetched User:", res.data.profile);
      })
      .catch((err) => console.error("Profile fetch failed", err))
      .finally(() => setLoading(false));
  }, []);

  const refreshUser = async () => {
    try {
      const res = await client.query<{ profile: User }>({
        query: PROFILE_QUERY,
        fetchPolicy: "no-cache", // Ensures fresh data
      });
      setUser(res.data.profile); // Update user state
      console.log("User info:", res.data.profile); // Log the updated user data
    } catch (err) {
      console.error("Refresh failed", err);
    }
  };

  const login = async (email: string, password: string) => {
    const response = await axios.post(
      "/login",
      { email, password },
      { withCredentials: true }
    );
    const token = response.data.token;
    // Store the token in localStorage or in state
    localStorage.setItem("authToken", token);
    await refreshUser(); // Update user state after login
  };

  const signup = async (username: string, email: string, password: string) => {
    const response = await axios.post(
      "/signup",
      { username, email, password },
      { withCredentials: true }
    );
    const token = response.data.token;
    localStorage.setItem("authToken", token);
    await refreshUser(); // Refresh user state after signup
  };

  const logout = async () => {
    const token = localStorage.getItem("authToken"); // Get the token from localStorage

    try {
      // Include the token in the Authorization header
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
      setUser(null); // Clear user state on logout
      localStorage.removeItem("authToken"); // Optionally clear token from localStorage
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

export function useAuth(): AuthContextType {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
