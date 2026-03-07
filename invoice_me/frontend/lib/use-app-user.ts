// lib/use-app-user.ts
"use client";

import { useEffect, useState, useCallback } from "react";
import { useAuth } from "@/lib/auth-context";
import { apiClient } from "@/lib/api-client";
import { API_ROUTES } from "@/lib/utility/api/routes";

export function useAppUser() {
  const { session } = useAuth();
  const [appUser, setAppUser] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  // Memoize fetchUser so it can be called safely in useEffect or manually
  const fetchUser = useCallback(async () => {
    // We need both the token for the header and the ID for the URL
    const userId = session?.user?.id;
    if (!session?.access_token || !userId) {
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      // Call the dynamic RESTful route: /users/{userId}
      const res = await apiClient(API_ROUTES.user(userId), {
        method: "GET",
      });

      if (res.ok) {
        const data = await res.json();
        setAppUser(data);
      }
    } catch (error) {
      console.error("Failed to fetch app user:", error);
    } finally {
      setLoading(false);
    }
  }, [session]);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  return {
    appUser,
    loading,
    refreshAppUser: fetchUser,
    userId: session?.user?.id, // Useful to have this available for other components
  };
}