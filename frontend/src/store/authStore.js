import create from "zustand";

const useAuthStore = create((set) => ({
  token: localStorage.getItem("token") || null,
  user: JSON.parse(localStorage.getItem("user")) || null,
  isLoggedIn: !!localStorage.getItem("token"),

  login: (token, user) => {
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(user));
    set({
      token,
      user,
      isLoggedIn: true,
    });
  },

  logout: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    set({
      token: null,
      user: null,
      isLoggedIn: false,
    });
  },

  setUser: (user) => {
    localStorage.setItem("user", JSON.stringify(user));
    set({ user });
  },
}));

export default useAuthStore;
