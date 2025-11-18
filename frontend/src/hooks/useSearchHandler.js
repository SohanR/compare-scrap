import {
  searchTransportation,
  searchHotels,
  searchThingsToDo,
  searchTipsAndStories,
  createSearchHistory,
} from "../utils/api";
import useAuthStore from "../store/authStore";

const useSearchHandler = ({
  setResults,
  setLoading,
  setError,
  setShowResults,
  setIsSearching,
}) => {
  const user = useAuthStore((state) => state.user);

  const handleSearch = async (searchData) => {
    // Set searching state
    setIsSearching(true);

    // Reset state
    setResults({
      transportation: [],
      hotels: [],
      todo: [],
      tipsAndStories: [],
    });
    setLoading({
      transportation: true,
      hotels: true,
      todo: true,
      tipsAndStories: true,
    });
    setError({
      transportation: null,
      hotels: null,
      todo: null,
      tipsAndStories: null,
    });
    setShowResults(true);

    // Smooth scroll to results
    setTimeout(() => {
      const resultsElement = document.getElementById("results-section");
      if (resultsElement) {
        resultsElement.scrollIntoView({ behavior: "smooth" });
      }
    }, 300);

    // Transportation API
    searchTransportation({
      from: searchData.from,
      to: searchData.to,
      date: searchData.date,
      returnDate: searchData.returnDate,
      tripType: searchData.tripType,
    })
      .then((data) => {
        setResults((prev) => ({
          ...prev,
          transportation: data.transportation || [],
        }));
        setLoading((prev) => ({ ...prev, transportation: false }));
      })
      .catch((err) => {
        setError((prev) => ({ ...prev, transportation: err.message }));
        setLoading((prev) => ({ ...prev, transportation: false }));
      });

    // Hotels API
    searchHotels({
      to: searchData.to,
      date: searchData.date,
    })
      .then((data) => {
        setResults((prev) => ({
          ...prev,
          hotels: data.hotels || [],
        }));
        setLoading((prev) => ({ ...prev, hotels: false }));
      })
      .catch((err) => {
        setError((prev) => ({ ...prev, hotels: err.message }));
        setLoading((prev) => ({ ...prev, hotels: false }));
      });

    // Things to Do API
    searchThingsToDo({
      to: searchData.to,
    })
      .then((data) => {
        setResults((prev) => ({
          ...prev,
          todo: data.todo || [],
        }));
        setLoading((prev) => ({ ...prev, todo: false }));
      })
      .catch((err) => {
        setError((prev) => ({ ...prev, todo: err.message }));
        setLoading((prev) => ({ ...prev, todo: false }));
      });

    // Tips and Stories API
    searchTipsAndStories({
      to: searchData.to,
    })
      .then((data) => {
        setResults((prev) => ({
          ...prev,
          tipsAndStories: data.tipsAndStories || [],
        }));
        setLoading((prev) => ({ ...prev, tipsAndStories: false }));
      })
      .catch((err) => {
        setError((prev) => ({ ...prev, tipsAndStories: err.message }));
        setLoading((prev) => ({ ...prev, tipsAndStories: false }));
      })
      .finally(() => {
        // All APIs completed, re-enable search button
        setIsSearching(false);
      });

    // Save search history if user is logged in
    if (user && user.id) {
      createSearchHistory(user.id, searchData).catch((err) => {
        console.error("Error saving search history:", err);
      });
    }
  };

  return handleSearch;
};

export default useSearchHandler;
