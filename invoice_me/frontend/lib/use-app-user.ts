// lib/use-app-user.ts
"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { apiClient } from "@/lib/api-client";
import { API_ROUTES } from "@/lib/utility/api/routes";

export function useAppUser() {
  const { session } = useAuth();
  const [appUser, setAppUser] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchUser = async () => {
    if (!session?.access_token) return;

    setLoading(true);
    const res = await apiClient(API_ROUTES.me, {
      method: "GET",
    });

    if (res.ok) {
      const data = await res.json();
      setAppUser(data);
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchUser();
  }, [session?.access_token]);

  return {
    appUser,
    loading,
    refreshAppUser: fetchUser,
  };
}
