import { signUp, signIn, signOut } from "../services/auth.js";
import { ref } from "vue";

export const useAuth = () => {
  const loading = ref(false);
  const error = ref(null);

  const register = async (email, password) => {
    loading.value = true;
    error.value = null;
    try {
      return await signUp(email, password);
    } catch (err) {
      error.value = err.message;
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const login = async (email, password) => {
    loading.value = true;
    error.value = null;
    try {
      return await signIn(email, password);
    } catch (err) {
      error.value = err.message;
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const logout = async () => {
    loading.value = true;
    error.value = null;
    try {
      await signOut();
    } catch (err) {
      error.value = err.message;
      throw err;
    } finally {
      loading.value = false;
    }
  };

  return { register, login, logout, loading, error };
};