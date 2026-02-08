import { supabase } from "@/lib/supabase/client";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export async function apiClient(
  endpoint: string,
  options: RequestInit = {}
) {
  // 1. Get current Supabase session
  const {
    data: { session },
    error,
  } = await supabase.auth.getSession();

  if (error) {
    throw new Error("Failed to get auth session");
  }

  const accessToken = session?.access_token;

  // 2. Make request to backend
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(accessToken && {
        Authorization: `Bearer ${accessToken}`,
      }),
      ...options.headers,
    },
  });

  // 3. Let the caller handle non-OK responses
  return response;
}
