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
const airportList = Object.entries(airportData)
  .filter(
    ([code, data]) =>
      code.length === 3 && // Only IATA codes (3 letters)
      data.city &&
      data.name
  )
  .map(([iata, data]) => ({
    city: data.city,
    iata,
    name: data.name,
  }));

const getSuggestions = (value) => {
  const inputValue = value.trim().toLowerCase();
  if (!inputValue) return [];
  return airportList
    .filter(
      (a) =>
        a.city.toLowerCase().includes(inputValue) ||
        a.name.toLowerCase().includes(inputValue) ||
        a.iata.toLowerCase().includes(inputValue)
    )
    .slice(0, 8);
};

const getSuggestionValue = (suggestion) =>
  `${suggestion.city} (${suggestion.iata})`;

const renderSuggestion = (suggestion) => (
  <span>
    {suggestion.city} ({suggestion.name}) [{suggestion.iata}]
  </span>
);

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
    if (!fromObj || !toObj) return;
    onSearch({
      from: fromObj,
      to: toObj,
      date: date.toISOString().split("T")[0],
    });
  };

  // Autosuggest handlers
  const handleFromChange = (event, { newValue, method }) => {
    setFrom(newValue);
    if (method === "type") setFromObj(null); // clear obj if typing
  };
  const handleFromSuggestionsFetch = ({ value }) =>
    setFromSuggestions(getSuggestions(value));
  const handleFromSuggestionsClear = () => setFromSuggestions([]);
  const handleFromSelect = (event, { suggestionValue, suggestion }) => {
    setFrom(suggestionValue);
    setFromObj({ city: suggestion.city, iata: suggestion.iata });
  };

  const handleToChange = (event, { newValue, method }) => {
    setTo(newValue);
    if (method === "type") setToObj(null);
  };
  const handleToSuggestionsFetch = ({ value }) =>
    setToSuggestions(getSuggestions(value));
  const handleToSuggestionsClear = () => setToSuggestions([]);
  const handleToSelect = (event, { suggestionValue, suggestion }) => {
    setTo(suggestionValue);
    setToObj({ city: suggestion.city, iata: suggestion.iata });
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
                    onChange={(date) => setDate(date)}
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
