import { create } from "zustand";

const storedToken = localStorage.getItem("admin_token");
const storedUser = localStorage.getItem("admin_user");

const useAdminAuthStore = create((set) => ({
  token: storedToken || null,
  user: storedUser ? JSON.parse(storedUser) : null,
  isLoggedIn: !!storedToken,
  login: (token, user) => {
    localStorage.setItem("admin_token", token);
    localStorage.setItem("admin_user", JSON.stringify(user));
    set({ token, user, isLoggedIn: true });
  },
  logout: () => {
    localStorage.removeItem("admin_token");
    localStorage.removeItem("admin_user");
    set({ token: null, user: null, isLoggedIn: false });
  },
}));

export default useAdminAuthStore;
