import axios from "axios";

const API_BASE_URL =
  process.env.REACT_APP_API_URL || "http://localhost:5000/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Login API
export async function loginUser({ email, password }) {
  const res = await api.post("/auth/login", { email, password });
  return res.data;
}

// Signup API
export async function signupUser({ name, email, password }) {
  const res = await api.post("/auth/signup", { name, email, password });
  return res.data;
}

export const searchTransportation = async (searchParams) => {
  try {
    const response = await api.post("/search/transportation", searchParams);
    return response.data;
  } catch (error) {
    if (error.response) {
      throw new Error(
        error.response.data.error || "Failed to fetch transportation data"
      );
    }
    throw new Error("Network error occurred");
  }
};

export const searchHotels = async (searchParams) => {
  try {
    const response = await api.post("/search/hotels", searchParams);
    return response.data;
  } catch (error) {
    if (error.response) {
      throw new Error(
        error.response.data.error || "Failed to fetch hotels data"
      );
    }
    throw new Error("Network error occurred");
  }
};

export const searchThingsToDo = async (searchParams) => {
  try {
    const response = await api.post("/search/things-to-do", searchParams);
    return response.data;
  } catch (error) {
    if (error.response) {
      throw new Error(
        error.response.data.error || "Failed to fetch things to do data"
      );
    }
    throw new Error("Network error occurred");
  }
};

export const searchTipsAndStories = async (searchParams) => {
  try {
    const response = await api.post("/search/tips-and-stories", searchParams);
    return response.data;
  } catch (error) {
    if (error.response) {
      throw new Error(
        error.response.data.error || "Failed to fetch tips and stories data"
      );
    }
    throw new Error("Network error occurred");
  }
};

export const formatPrice = (price) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(price);
};

export const formatDate = (date) => {
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

// Search History APIs
export const createSearchHistory = async (userId, searchData) => {
  try {
    const response = await api.post("/search-history", {
      userId,
      from: searchData.from,
      to: searchData.to,
      date: searchData.date,
    });
    return response.data;
  } catch (error) {
    console.error("Failed to save search history:", error.message);
  }
};

export const getUserSearchHistory = async (userId) => {
  try {
    const response = await api.get(`/search-history/${userId}`);
    return response.data.data || [];
  } catch (error) {
    if (error.response) {
      throw new Error(
        error.response.data.error || "Failed to fetch search history"
      );
    }
    throw new Error("Network error occurred");
  }
};

export const deleteSearchHistory = async (historyId) => {
  try {
    const response = await api.delete(`/search-history/${historyId}`);
    return response.data;
  } catch (error) {
    if (error.response) {
      throw new Error(
        error.response.data.error || "Failed to delete search history"
      );
    }
    throw new Error("Network error occurred");
  }
};

export const clearUserSearchHistory = async (userId) => {
  try {
    const response = await api.delete(`/search-history/user/${userId}`);
    return response.data;
  } catch (error) {
    if (error.response) {
      throw new Error(
        error.response.data.error || "Failed to clear search history"
      );
    }
    throw new Error("Network error occurred");
  }
};

// Settings APIs
export const getUserSettings = async (userId) => {
  try {
    const response = await api.get(`/settings/${userId}`);
    return response.data.data;
  } catch (error) {
    if (error.response) {
      throw new Error(error.response.data.error || "Failed to fetch settings");
    }
    throw new Error("Network error occurred");
  }
};

export const updateUserName = async (userId, name) => {
  try {
    const response = await api.put(`/settings/${userId}/name`, { name });
    return response.data.data;
  } catch (error) {
    if (error.response) {
      throw new Error(error.response.data.error || "Failed to update name");
    }
    throw new Error("Network error occurred");
  }
};

export const updateUserBio = async (userId, bio) => {
  try {
    const response = await api.put(`/settings/${userId}/bio`, { bio });
    return response.data.data;
  } catch (error) {
    if (error.response) {
      throw new Error(error.response.data.error || "Failed to update bio");
    }
    throw new Error("Network error occurred");
  }
};

export const updateVisitedPlaces = async (userId, visitedPlaces) => {
  try {
    const response = await api.put(`/settings/${userId}/visited-places`, {
      visitedPlaces,
    });
    return response.data.data;
  } catch (error) {
    if (error.response) {
      throw new Error(
        error.response.data.error || "Failed to update visited places"
      );
    }
    throw new Error("Network error occurred");
  }
};

export const resetPassword = async (
  userId,
  currentPassword,
  newPassword,
  confirmPassword
) => {
  try {
    const response = await api.post(`/settings/${userId}/reset-password`, {
      currentPassword,
      newPassword,
      confirmPassword,
    });
    return response.data;
  } catch (error) {
    if (error.response) {
      throw new Error(error.response.data.error || "Failed to reset password");
    }
    throw new Error("Network error occurred");
  }
};

export const deleteAccount = async (userId, password) => {
  try {
    const response = await api.delete(`/settings/${userId}/delete-account`, {
      data: { password },
    });
    return response.data;
  } catch (error) {
    if (error.response) {
      throw new Error(error.response.data.error || "Failed to delete account");
    }
    throw new Error("Network error occurred");
  }
};

// Bookmark API
export const addBookmark = async (bookmark) => {
  try {
    const response = await api.post("/bookmark", bookmark);
    return response.data;
  } catch (error) {
    if (error.response) {
      throw new Error(
        error.response.data.error || "Failed to save bookmark data"
      );
    }
    throw new Error("Network error occurred");
  }
};

export const deleteBookmark = async (bookmarkId) => {
  try {
    const response = await api.delete(`/bookmark/${bookmarkId}`);
    return response.data;
  } catch (error) {
    if (error.response) {
      throw new Error(
        error.response.data.error || "Failed to delete bookmark"
      );
    }
    throw new Error("Network error occurred");
  }
};

export const getUserBookmarks = async (userId) => {
  try {
    const response = await api.get(`/bookmark/user/${userId}`);
    return response.data.data || [];
  } catch (error) {
    if (error.response) {
      throw new Error(
        error.response.data.error || "Failed to fetch bookmarks"
      );
    }
    throw new Error("Network error occurred");
  }
};

export const getUserBookmarksByCategory = async (userId, category) => {
  try {
    const response = await api.get(
      `/bookmark/user/${userId}/category/${category}`
    );
    return response.data.data || [];
  } catch (error) {
    if (error.response) {
      throw new Error(
        error.response.data.error ||
          "Failed to fetch bookmarks for this category"
      );
    }
    throw new Error("Network error occurred");
  }
};

// Wiki API
export const getWikiSummary = async (destination) => {
  try {
    const response = await fetch(
      `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(
        destination
      )}`
    );
    if (!response.ok) {
      throw new Error("Wiki page not found");
    }
    const data = await response.json();
    return data;
  } catch (error) {
    if (error.message === "Wiki page not found") {
      throw new Error("Wiki page not found for this destination");
    }
    throw new Error("Failed to fetch wiki information");
  }
};
