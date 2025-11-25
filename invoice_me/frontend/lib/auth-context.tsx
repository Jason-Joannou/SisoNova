"use client";

import { AuthContextProps } from "./types/auth";
import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { useRouter } from "next/navigation";
import {
  UserAuthentication,
  AuthenticatedUser,
  UserProfile,
} from "./types/user-information";

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Check if user has valid token on mount
    const token = localStorage.getItem("access_token");

    if (token) {
      setIsAuthenticated(true);
    }
    setLoading(false);
  }, []);

  const login = async (credentials: UserAuthentication) => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(credentials),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.detail || "Registration failed");
      }

      const { access_token, refresh_token, user } = data as AuthenticatedUser;

      localStorage.setItem("access_token", access_token);
      localStorage.setItem("refresh_token", refresh_token);

      setUser(user);
      setIsAuthenticated(true);

      // Redirect to dashboard
      router.push("/dashboard");
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  };

  const register = async (userData: UserAuthentication) => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.detail || "Registration failed");
      }

      const { access_token, refresh_token, user } = data as AuthenticatedUser;

      localStorage.setItem("access_token", access_token);
      localStorage.setItem("refresh_token", refresh_token);

      setUser(user);
      setIsAuthenticated(true);

      // Redirect to dashboard
      router.push("/dashboard");
    } catch (error) {
      console.error("Registration error:", error);
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    setUser(null);
    setIsAuthenticated(false);
    router.push("/login");
  };

  return (
    <AuthContext.Provider
      value={{ user, isAuthenticated, login, register, logout, loading }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
