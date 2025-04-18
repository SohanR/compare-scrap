import axios from "axios";

const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

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
