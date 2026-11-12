import axios from "axios";
import config from "../config/index.js";
import useAuthStore from "../stores/authStore.js";

const api = axios.create({
  baseURL: config.supabaseUrl,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
    apikey: config.supabaseAnonKey,
    Authorization: `Bearer ${config.supabaseAnonKey}`,
  },
  timeout: 5000,
});

// Antes de cada pedido: si hay sesión, manda el token del usuario
api.interceptors.request.use((requestConfig) => {
  const auth = useAuthStore();
  if (auth.token) {
    requestConfig.headers.Authorization = `Bearer ${auth.token}`;
  } else {
    requestConfig.headers.Authorization = `Bearer ${config.supabaseAnonKey}`;
  }
  return requestConfig;
});

// Cliente aparte, sin interceptores, para renovar la sesión
const authClient = axios.create({
  baseURL: config.supabaseUrl,
  headers: {
    "Content-Type": "application/json",
    apikey: config.supabaseAnonKey,
  },
  timeout: 5000,
});

let refreshing = null;

const refreshSession = async () => {
  const auth = useAuthStore();
  const { data } = await authClient.post("/auth/v1/token?grant_type=refresh_token", {
    refresh_token: auth.refreshToken,
  });
  auth.setTokens(data.access_token, data.refresh_token);
};

// Después de cada respuesta: si el token venció (401), lo renueva y reintenta una vez
api.interceptors.response.use(
  (response) => response,
  async (err) => {
    const auth = useAuthStore();
    const original = err.config;

    if (err.response?.status !== 401 || !original || original._retry || !auth.refreshToken) {
      throw err;
    }
    original._retry = true;

    try {
      refreshing ??= refreshSession().finally(() => (refreshing = null));
      await refreshing;
      return api(original);
    } catch {
      auth.clearUser();
      throw err;
    }
  },
);

export default api

export const extraerMsg = (err) => {
  const data = err.response?.data
  if (data?.code === "42501") return "No tenes permisos para realizar esta accion"
  return data?.message ?? data?.error ?? err.message ?? "Error no esperado"
}