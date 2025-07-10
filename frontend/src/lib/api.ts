const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

async function callApi(endpoint: string, method: string, data?: any, token?: string) {
  const headers: HeadersInit = {
    "Content-Type": "application/json",
  };
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const config: RequestInit = {
    method,
    headers,
  };

  if (data) {
    config.body = JSON.stringify(data);
  }

  const url = `${API_BASE_URL}/api${endpoint.startsWith("/") ? endpoint : `/${endpoint}`}`;
  const response = await fetch(url, config);
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || "Something went wrong");
  }
  return response.json();
}

export const api = {
  auth: {
    login: (email: string) => callApi("/login", "POST", { email }),
    getIdentity: (token: string) => callApi("/refresh", "POST", { token }), // Using refresh to validate token and get identity
    logout: () => {
      // For logout, we just clear the token client-side
      localStorage.removeItem("token");
      localStorage.removeItem("tokenIdentifier");
      return Promise.resolve(true);
    },
  },
  sows: {
    createSow: (sowData: any, token: string) => callApi("/sows", "POST", sowData, token),
    getSows: (token: string) => callApi("/sows", "GET", undefined, token),
    getSow: (sowId: string, token: string) => callApi(`/sows/${sowId}`, "GET", undefined, token),
    updateSow: (sowId: string, sowData: any, token: string) => callApi(`/sows/${sowId}`, "PUT", sowData, token),
    deleteSow: (sowId: string, token: string) => callApi(`/sows/${sowId}`, "DELETE", undefined, token),
  },
};
