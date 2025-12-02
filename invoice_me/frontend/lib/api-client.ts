

export async function apiClient(endpoint: string, options: RequestInit = {}) {
    const accessToken = localStorage.getItem('access_token');

    const response = await fetch(endpoint, {
        ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(accessToken && { 'Authorization': `Bearer ${accessToken}` }),
      ...options.headers,
    },
    })

    return response
}