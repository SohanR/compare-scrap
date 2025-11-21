import React, { useState } from "react";
import {
  Box,
  TextField,
  Button,
  Paper,
  Stack,
  Typography,
  ToggleButton,
  ToggleButtonGroup,
} from "@mui/material";
import ReactDatePicker from "react-datepicker";
import { motion } from "framer-motion";
import "react-datepicker/dist/react-datepicker.css";
import { FaPlane, FaCalendarAlt, FaMapMarkerAlt } from "react-icons/fa";
import Autosuggest from "react-autosuggest";
import airportData from "../utils/airport.json";
import { toast } from "react-toastify";

// Helper: Build airport suggestion list [{ city, iata, name }]
const airportList = Object.entries(airportData)
  .filter(([key, data]) => {
    // Only include if data.iata, data.city, and data.name exist
    const hasIata = !!data.iata;
    const hasCity = !!data.city;
    const hasName = !!data.name;
    if (!hasIata || !hasCity || !hasName) {
    }
    return hasIata && hasCity && hasName;
  })
  .map(([key, data]) => {
    // Use the correct IATA code from data.iata, not the key
    const obj = { city: data.city, iata: data.iata, name: data.name };
    return obj;
  });

const getSuggestions = (value) => {
  const inputValue = value.trim().toLowerCase();

  if (!inputValue) {
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
  return filtered;
};

const getSuggestionValue = (suggestion) => {
  return `${suggestion.city} (${suggestion.iata})`;
};

const renderSuggestion = (suggestion) => {
  return (
    <span>
      {suggestion.city} ({suggestion.name}) [{suggestion.iata}]
    </span>
  );
};

// Custom styles for suggestion hover and selected
const suggestionStyles = {
  suggestion: {
    padding: "12px 16px",
    cursor: "pointer",
    transition: "background 0.2s",
  },
  suggestionHighlighted: {
    background: "#e3f2fd",
  },
  suggestionSelected: {
    background: "#90caf9",
    color: "#1565c0",
  },
};

const SearchForm = ({ onSearch, isSearching }) => {
  const [from, setFrom] = useState("");
  const [fromObj, setFromObj] = useState(null);
  const [fromSuggestions, setFromSuggestions] = useState([]);
  const [to, setTo] = useState("");
  const [toObj, setToObj] = useState(null);
  const [toSuggestions, setToSuggestions] = useState([]);
  const [date, setDate] = useState(new Date());
  const [tripType, setTripType] = useState("oneway");
  const [returnDate, setReturnDate] = useState(null);

  const handleTripType = (event, newType) => {
    if (newType) setTripType(newType);
    if (newType === "oneway") setReturnDate(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!fromObj || !toObj) {
      return;
    }

    const fromCity = fromObj.city?.toLowerCase();
    const toCity = toObj.city?.toLowerCase();
    if (fromCity && toCity && fromCity === toCity) {
      toast.error("Current location and destination cannot be the same.");
      return;
    }

    const payload = {
      from: fromObj,
      to: toObj,
      date: date.toISOString().split("T")[0],
    };
    if (tripType === "twoway" && returnDate) {
      payload.returnDate = returnDate.toISOString().split("T")[0];
    }
    payload.tripType = tripType;
    onSearch(payload);
  };

  // Autosuggest handlers
  const handleFromChange = (event, { newValue }) => {
    setFrom(newValue);
  };
  const handleFromSuggestionsFetch = ({ value }) => {
    const suggestions = getSuggestions(value);
    setFromSuggestions(suggestions);
  };
  const handleFromSuggestionsClear = () => {
    setFromSuggestions([]);
  };

  const handleToChange = (event, { newValue }) => {
    setTo(newValue);
  };
  const handleToSuggestionsFetch = ({ value }) => {
    const suggestions = getSuggestions(value);
    setToSuggestions(suggestions);
  };
  const handleToSuggestionsClear = () => {
    setToSuggestions([]);
  };

  const handleFromSelect = (event, { suggestion, suggestionValue }) => {
    // Use the correct IATA code for lookup
    const fullObj = Object.values(airportData).find(
      (a) => a.iata === suggestion.iata
    );
    setFromObj({
      city: suggestion.city,
      iata: suggestion.iata,
      name: suggestion.name,
      ...fullObj,
    });
  };

  const handleToSelect = (event, { suggestion, suggestionValue }) => {
    // Use the correct IATA code for lookup
    const fullObj = Object.values(airportData).find(
      (a) => a.iata === suggestion.iata
    );

    setToObj({
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

            {/* 1. Toggle for One Way / Two Way (Flights Only) */}
            <Box>
              <Typography variant="subtitle1" sx={{ mb: 1 }}>
                Trip Type (Flights Only)
              </Typography>
              <ToggleButtonGroup
                value={tripType}
                exclusive
                onChange={handleTripType}
                aria-label="trip type"
                size="small"
                sx={{ mb: 2 }}
              >
                <ToggleButton value="oneway" aria-label="one way">
                  One Way
                </ToggleButton>
                <ToggleButton value="twoway" aria-label="two way">
                  Two Way
                </ToggleButton>
              </ToggleButtonGroup>
            </Box>

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
                  renderSuggestion={(suggestion, { query, isHighlighted }) => (
                    <Box
                      sx={{
                        ...suggestionStyles.suggestion,
                        ...(isHighlighted
                          ? suggestionStyles.suggestionHighlighted
                          : {}),
                      }}
                    >
                      <span>
                        {suggestion.city} ({suggestion.name}) [{suggestion.iata}
                        ]
                      </span>
                    </Box>
                  )}
                  renderInputComponent={(inputProps) => (
                    <TextField
                      {...inputProps}
                      fullWidth
                      label="Current Location"
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
                  renderSuggestion={(suggestion, { query, isHighlighted }) => (
                    <Box
                      sx={{
                        ...suggestionStyles.suggestion,
                        ...(isHighlighted
                          ? suggestionStyles.suggestionHighlighted
                          : {}),
                      }}
                    >
                      <span>
                        {suggestion.city} ({suggestion.name}) [{suggestion.iata}
                        ]
                      </span>
                    </Box>
                  )}
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
                      label="Destination"
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
              {/* 2. Return Date Picker for Two Way */}
              {tripType === "twoway" && (
                <Box sx={{ flex: 1, minWidth: "200px" }}>
                  <div className="custom-datepicker-wrapper">
                    <ReactDatePicker
                      selected={returnDate}
                      onChange={(date) => {
                        console.log("Return date changed:", date);
                        setReturnDate(date);
                      }}
                      dateFormat="yyyy-MM-dd"
                      minDate={date || new Date()}
                      customInput={
                        <TextField
                          fullWidth
                          label="Return Date"
                          value={
                            returnDate ? returnDate.toLocaleDateString() : ""
                          }
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
              )}
            </Box>

            <Button
              variant="contained"
              type="submit"
              size="large"
              disabled={isSearching}
              sx={{
                py: 1.5,
                background: "linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)",
                "&:hover": {
                  background:
                    "linear-gradient(45deg, #1976D2 30%, #00B4D8 90%)",
                },
                "&:disabled": {
                  background:
                    "linear-gradient(45deg, #90caf9 30%, #81d4fa 90%)",
                  cursor: "not-allowed",
                },
              }}
            >
              {isSearching ? "Scraping Data..." : "Search"}
            </Button>
          </Stack>
        </form>
      </Paper>
    </motion.div>
  );
};

export default SearchForm;
