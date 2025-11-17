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

export const searchTravel = async (searchParams) => {
  try {
    const response = await api.post("/search", searchParams);
    return response.data;
  } catch (error) {
    if (error.response) {
      throw new Error(
        error.response.data.error || "Failed to fetch travel data"
      );
    }
    throw new Error("Network error occurred");
  }
};

export const fetchFlightData = async (searchParams) => {
  try {
    const response = await api.post("/flight_data", searchParams);
    return response.data;
  } catch (error) {
    if (error.response) {
      throw new Error(
        error.response.data.error || "Failed to fetch flight data"
      );
    }
    throw new Error("Network error occurred");
  }
};

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
