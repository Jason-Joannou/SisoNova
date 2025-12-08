import { getCookie, setCookie } from "./utils";
import { TokenResponse } from "./types/auth";

export async function apiClient(endpoint: string, options: RequestInit = {}) {
  const API_BASE_URL =
    process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

  const accessToken = getCookie("access_token");

  let response = await fetch(endpoint, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(accessToken && { Authorization: `Bearer ${accessToken}` }),
      ...options.headers,
    },
  });

  // If access token expired (401), try to refresh
  if (response.status === 401) {
    const refreshResponse = await fetch(`${API_BASE_URL}/auth/refresh`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include", // sends httpOnly refresh cookie automatically
    });

    if (refreshResponse.ok) {
      const data = (await refreshResponse.json()) as TokenResponse;
      const newAccessToken = data.access_token;

      // Update access token in cookie
      setCookie("access_token", newAccessToken);

      // Retry original request with new token
      response = await fetch(endpoint, {
        ...options,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${newAccessToken}`,
          ...options.headers,
        },
      });
    } else {
      // Refresh failed, redirect to login or handle logout
      console.log("Refresh failed, user must log in again");
      throw new Error("Session expired. Please log in again.");
    }
  }

  return response;
}
