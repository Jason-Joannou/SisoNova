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
  UserUpdate,
} from "./types/user-information";
import { API_ROUTES } from "./utility/api/routes";

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const initializeAuth = async () => {
      const token = localStorage.getItem("access_token");

      if (token) {
        // Token exists, fetch user profile
        try {
          const response = await fetch(`${API_ROUTES.userProfile}`, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          });

          if (response.ok) {
            const userData = await response.json();
            console.log("User data:", userData);
            setUser(userData);
            setIsAuthenticated(true);
          } else {
            // Token is invalid, clear everything
            logout();
          }
        } catch (error) {
          console.error("Error fetching user profile:", error);
          logout();
        }
      }

      setLoading(false);
    };

    initializeAuth();
  }, []);

  const login = async (credentials: UserAuthentication) => {
    try {
      setLoading(true);
      const response = await fetch(`${API_ROUTES.login}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(credentials),
      });

      const data = await response.json();
      if (!response.ok) {
        setLoading(false);
        throw new Error(data.detail || "Login failed");
      }

      const { access_token, refresh_token, user } = data as AuthenticatedUser;

      localStorage.setItem("access_token", access_token);
      localStorage.setItem("refresh_token", refresh_token);

      // Add to cookies for middleware access
      document.cookie = `access_token=${access_token}; path=/`;
      document.cookie = `refresh_token=${refresh_token}; path=/`;

      setUser(user);
      setIsAuthenticated(true);
      setLoading(false);

      // Redirect to dashboard
      router.push("/dashboard");
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  };

  const register = async (userData: UserAuthentication) => {
    try {
      setLoading(true);
      const response = await fetch(`${API_ROUTES.register}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });

      const data = await response.json();
      if (!response.ok) {
        setLoading(false);
        throw new Error(data.detail || "Registration failed");
      }

      const { access_token, refresh_token, user } = data as AuthenticatedUser;

      localStorage.setItem("access_token", access_token);
      localStorage.setItem("refresh_token", refresh_token);

      // Add to cookies for middleware access
      document.cookie = `access_token=${access_token}; path=/`;
      document.cookie = `refresh_token=${refresh_token}; path=/`;

      setUser(user);
      setIsAuthenticated(true);
      setLoading(false);

      // Redirect to dashboard
      router.push("/dashboard");
    } catch (error) {
      console.error("Registration error:", error);
      throw error;
    }
  };

  const logout = () => {
    setLoading(true);
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    setUser(null);
    setIsAuthenticated(false);
    setLoading(false);
    router.push("/login");
  };

  const refreshUser = async () => {
    try {
      setLoading(true);

      const response = await fetch(`${API_ROUTES.userProfile}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
      });

      const data = await response.json();
      if (!response.ok) {
        console.log("Failed to fetch user profile");
        throw new Error(JSON.stringify(data));
      }

      const { email, business_profile } = data as UserProfile;
      setUser({ email, business_profile });
      setIsAuthenticated(true);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching user profile:", error);
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        login,
        register,
        logout,
        loading,
        refreshUser,
      }}
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
