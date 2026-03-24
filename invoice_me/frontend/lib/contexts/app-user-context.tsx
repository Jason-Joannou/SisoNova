"use client";

import { createContext, useContext, useEffect, useState, useCallback, ReactNode } from "react";
import { useAuth } from "@/lib/auth-context";
import { apiClient } from "@/lib/api-client";
import { API_ROUTES } from "@/lib/utility/api/routes";

type AppUserContextType = {
  appUser: any | null;
  loading: boolean;
  refreshAppUser: () => Promise<void>;
};

const AppUserContext = createContext<AppUserContextType | undefined>(undefined);

export function AppUserProvider({ children }: { children: ReactNode }) {
  const { session } = useAuth();
  const [appUser, setAppUser] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchUser = useCallback(async () => {
    const userId = session?.user?.id;
    if (!session?.access_token || !userId) {
      setLoading(false);
      return;
    }

    try {
      const res = await apiClient(API_ROUTES.user(userId));
      if (res.ok) {
        const data = await res.json();
        setAppUser(data);
      }
    } catch (error) {
      console.error("Failed to fetch app user:", error);
    } finally {
      setLoading(false);
    }
  }, [session?.user?.id, session?.access_token]);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  return (
    <AppUserContext.Provider value={{ appUser, loading, refreshAppUser: fetchUser }}>
      {children}
    </AppUserContext.Provider>
  );
}

export const useAppUser = () => {
  const context = useContext(AppUserContext);
  if (!context) throw new Error("useAppUser must be used within AppUserProvider");
  return context;
};