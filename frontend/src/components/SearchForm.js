import React, { useState } from "react";
import {
  Box,
  TextField,
  Button,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import ReactDatePicker from "react-datepicker";
import { motion } from "framer-motion";
import "react-datepicker/dist/react-datepicker.css";
import { FaPlane, FaCalendarAlt, FaMapMarkerAlt } from "react-icons/fa";
import Autosuggest from "react-autosuggest";
import airportData from "../utils/airport.json";

// Helper: Build airport suggestion list [{ city, iata, name }]
console.log("Raw airportData:", airportData);
const airportList = Object.entries(airportData)
  .filter(([key, data]) => {
    // Log the object before filtering
    console.log("Before filter:", { key, data });
    // Only include if data.iata, data.city, and data.name exist
    const hasIata = !!data.iata;
    const hasCity = !!data.city;
    const hasName = !!data.name;
    if (!hasIata || !hasCity || !hasName) {
      console.log(`Filtered out: ${key}`, data);
    }
    return hasIata && hasCity && hasName;
  })
  .map(([key, data]) => {
    // Use the correct IATA code from data.iata, not the key
    const obj = { city: data.city, iata: data.iata, name: data.name };
    console.log("Mapped airport object (using data.iata):", obj);
    return obj;
  });

console.log("Final airportList:", airportList);

const getSuggestions = (value) => {
  const inputValue = value.trim().toLowerCase();
  console.log(
    "getSuggestions called with value:",
    value,
    "inputValue:",
    inputValue
  );
  if (!inputValue) {
    console.log("No input value, returning []");
    return [];
  }
  const filtered = airportList
    .filter(
      (a) =>
        a.city.toLowerCase().includes(inputValue) ||
        a.name.toLowerCase().includes(inputValue) ||
        a.iata.toLowerCase().includes(inputValue)
    )
    .slice(0, 8);
  console.log("Suggestions for input:", inputValue, "are:", filtered);
  return filtered;
};

const getSuggestionValue = (suggestion) => {
  console.log("getSuggestionValue called with:", suggestion);
  return `${suggestion.city} (${suggestion.iata})`;
};

const renderSuggestion = (suggestion) => {
  console.log("renderSuggestion called with:", suggestion);
  return (
    <span>
      {suggestion.city} ({suggestion.name}) [{suggestion.iata}]
    </span>
  );
};

const SearchForm = ({ onSearch, loading }) => {
  const [from, setFrom] = useState("");
  const [fromObj, setFromObj] = useState(null);
  const [fromSuggestions, setFromSuggestions] = useState([]);
  const [to, setTo] = useState("");
  const [toObj, setToObj] = useState(null);
  const [toSuggestions, setToSuggestions] = useState([]);
  const [date, setDate] = useState(new Date());

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(
      "Form submitted. FromObj:",
      fromObj,
      "ToObj:",
      toObj,
      "Date:",
      date
    );
    if (!fromObj || !toObj) {
      console.log("Form submission aborted: fromObj or toObj missing");
      return;
    }
    const payload = {
      from: fromObj,
      to: toObj,
      date: date.toISOString().split("T")[0],
    };
    console.log("Calling onSearch with payload:", payload);
    onSearch(payload);
  };

  // Autosuggest handlers
  const handleFromChange = (event, { newValue }) => {
    console.log("From input changed:", newValue);
    setFrom(newValue);
  };
  const handleFromSuggestionsFetch = ({ value }) => {
    console.log("Fetching fromSuggestions for value:", value);
    const suggestions = getSuggestions(value);
    setFromSuggestions(suggestions);
    console.log("Set fromSuggestions:", suggestions);
  };
  const handleFromSuggestionsClear = () => {
    console.log("Clearing fromSuggestions");
    setFromSuggestions([]);
  };

  const handleToChange = (event, { newValue }) => {
    console.log("To input changed:", newValue);
    setTo(newValue);
  };
  const handleToSuggestionsFetch = ({ value }) => {
    console.log("Fetching toSuggestions for value:", value);
    const suggestions = getSuggestions(value);
    setToSuggestions(suggestions);
    console.log("Set toSuggestions:", suggestions);
  };
  const handleToSuggestionsClear = () => {
    console.log("Clearing toSuggestions");
    setToSuggestions([]);
  };

  const handleFromSelect = (event, { suggestion, suggestionValue }) => {
    console.log(
      "From suggestion selected:",
      suggestion,
      "Value:",
      suggestionValue
    );
    // Use the correct IATA code for lookup
    const fullObj = Object.values(airportData).find(
      (a) => a.iata === suggestion.iata
    );
    console.log("Full object from JSON for fromObj:", fullObj);
    setFromObj({
      city: suggestion.city,
      iata: suggestion.iata,
      name: suggestion.name,
      ...fullObj,
    });
    console.log("Set fromObj:", {
      city: suggestion.city,
      iata: suggestion.iata,
      name: suggestion.name,
      ...fullObj,
    });
  };

  const handleToSelect = (event, { suggestion, suggestionValue }) => {
    console.log(
      "To suggestion selected:",
      suggestion,
      "Value:",
      suggestionValue
    );
    // Use the correct IATA code for lookup
    const fullObj = Object.values(airportData).find(
      (a) => a.iata === suggestion.iata
    );
    console.log("Full object from JSON for toObj:", fullObj);
    setToObj({
      city: suggestion.city,
      iata: suggestion.iata,
      name: suggestion.name,
      ...fullObj,
    });
    console.log("Set toObj:", {
      city: suggestion.city,
      iata: suggestion.iata,
      name: suggestion.name,
      ...fullObj,
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Paper
        elevation={3}
        sx={{
          p: 4,
          background: "rgba(255, 255, 255, 0.95)",
          backdropFilter: "blur(10px)",
          borderRadius: "16px",
        }}
      >
        <form onSubmit={handleSubmit}>
          <Stack spacing={3}>
            <Typography variant="h5" fontWeight="bold" color="primary">
              Find Your Perfect Trip
            </Typography>

            <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
              <Box sx={{ flex: 1, minWidth: "200px" }}>
                <Autosuggest
                  suggestions={fromSuggestions}
                  onSuggestionsFetchRequested={handleFromSuggestionsFetch}
                  onSuggestionsClearRequested={handleFromSuggestionsClear}
                  getSuggestionValue={getSuggestionValue}
                  renderSuggestion={renderSuggestion}
                  onSuggestionSelected={handleFromSelect}
                  inputProps={{
                    value: from,
                    onChange: handleFromChange,
                    placeholder: "From (City or Airport)",
                    required: true,
                    style: { width: "100%", paddingLeft: 32 },
                  }}
                  theme={{
                    input:
                      "MuiInputBase-input MuiOutlinedInput-input MuiInputBase-inputAdornedStart",
                    suggestionsContainer: "autosuggest-suggestions-container",
                    suggestion: "autosuggest-suggestion",
                    suggestionHighlighted: "autosuggest-suggestion-highlighted",
                  }}
                  renderInputComponent={(inputProps) => (
                    <TextField
                      {...inputProps}
                      fullWidth
                      label="From"
                      InputProps={{
                        startAdornment: (
                          <FaMapMarkerAlt style={{ marginRight: 8 }} />
                        ),
                      }}
                    />
                  )}
                />
              </Box>

              <Box sx={{ flex: 1, minWidth: "200px" }}>
                <Autosuggest
                  suggestions={toSuggestions}
                  onSuggestionsFetchRequested={handleToSuggestionsFetch}
                  onSuggestionsClearRequested={handleToSuggestionsClear}
                  getSuggestionValue={getSuggestionValue}
                  renderSuggestion={renderSuggestion}
                  onSuggestionSelected={handleToSelect}
                  inputProps={{
                    value: to,
                    onChange: handleToChange,
                    placeholder: "To (City or Airport)",
                    required: true,
                    style: { width: "100%", paddingLeft: 32 },
                  }}
                  theme={{
                    input:
                      "MuiInputBase-input MuiOutlinedInput-input MuiInputBase-inputAdornedStart",
                    suggestionsContainer: "autosuggest-suggestions-container",
                    suggestion: "autosuggest-suggestion",
                    suggestionHighlighted: "autosuggest-suggestion-highlighted",
                  }}
                  renderInputComponent={(inputProps) => (
                    <TextField
                      {...inputProps}
                      fullWidth
                      label="To"
                      InputProps={{
                        startAdornment: <FaPlane style={{ marginRight: 8 }} />,
                      }}
                    />
                  )}
                />
              </Box>

              <Box sx={{ flex: 1, minWidth: "200px" }}>
                <div className="custom-datepicker-wrapper">
                  <ReactDatePicker
                    selected={date}
                    onChange={(date) => {
                      console.log("Date changed:", date);
                      setDate(date);
                    }}
                    dateFormat="yyyy-MM-dd"
                    minDate={new Date()}
                    customInput={
                      <TextField
                        fullWidth
                        label="Date"
                        value={date ? date.toLocaleDateString() : ""}
                        InputProps={{
                          startAdornment: (
                            <FaCalendarAlt style={{ marginRight: 8 }} />
                          ),
                        }}
                      />
                    }
                  />
                </div>
              </Box>
            </Box>

            <Button
              variant="contained"
              type="submit"
              size="large"
              disabled={loading}
              sx={{
                py: 1.5,
                background: "linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)",
                "&:hover": {
                  background:
                    "linear-gradient(45deg, #1976D2 30%, #00B4D8 90%)",
                },
              }}
            >
              {loading ? "Searching..." : "Search"}
            </Button>
          </Stack>
        </form>
      </Paper>
    </motion.div>
  );
};

export default SearchForm;
