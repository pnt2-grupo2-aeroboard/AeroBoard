import { defineStore } from "pinia";

const useAuthStore = defineStore("auth", {
  state: () => ({
    email: null,
    admin: false,
    token: null,
    refreshToken: null,
  }),
  actions: {
    setUser(user, accessToken, role, refreshToken) {
      this.email = user.email;
      this.admin = role === "admin";
      this.token = accessToken;
      this.refreshToken = refreshToken;
    },
    setTokens(accessToken, refreshToken) {
      this.token = accessToken;
      this.refreshToken = refreshToken;
    },
    clearUser() {
      this.email = null;
      this.admin = false;
      this.token = null;
      this.refreshToken = null;
    },
  },
  getters: {
    userEmail: (state) => state.email,
    isAuthenticated: (state) => !!state.email,
    isAdmin: (state) => state.admin,
  },
  persist: {
    key: "auth",
    storage: sessionStorage,
  },
});

export default useAuthStore;