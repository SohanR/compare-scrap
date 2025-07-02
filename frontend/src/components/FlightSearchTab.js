import React, { useState } from "react";
import { Box, Typography, TextField, Button, Stack } from "@mui/material";
import ReactDatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { fetchFlightData } from "../utils/api";
import ResultCard from "./ResultCard";

const FlightSearchTab = () => {
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [departureDate, setDepartureDate] = useState(new Date());
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSearch = async () => {
    setLoading(true);
    setError(null);

    try {
      const searchParams = {
        from,
        to,
        departureDate: departureDate.toISOString().split("T")[0],
      };
      const data = await fetchFlightData(searchParams);
      setResults(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box>
      {/* <Typography variant="h6" fontWeight="bold" gutterBottom>
        Search Flights
      </Typography>
      <Stack spacing={3} sx={{ mb: 4 }}>
        <TextField
          label="From (Airport Name)"
          value={from}
          onChange={(e) => setFrom(e.target.value)}
          fullWidth
          required
        />
        <TextField
          label="To (Airport Name)"
          value={to}
          onChange={(e) => setTo(e.target.value)}
          fullWidth
          required
        />
        <ReactDatePicker
          selected={departureDate}
          onChange={(date) => setDepartureDate(date)}
          dateFormat="yyyy-MM-dd"
          minDate={new Date()}
          customInput={
            <TextField
              label="Departure Date"
              fullWidth
              value={departureDate ? departureDate.toLocaleDateString() : ""}
            />
          }
        />
        <Button
          variant="contained"
          onClick={handleSearch}
          disabled={loading}
          sx={{
            py: 1.5,
            background: "linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)",
            "&:hover": {
              background: "linear-gradient(45deg, #1976D2 30%, #00B4D8 90%)",
            },
          }}
        >
          {loading ? "Searching..." : "Search"}
        </Button>
      </Stack>

      {error && (
        <Typography color="error" variant="body2" gutterBottom>
          {error}
        </Typography>
      )}

      <Box>
        {results.map((result, index) => (
          <ResultCard key={index} item={result} type="transportation" />
        ))}
      </Box> */}
    </Box>
  );
};

export default FlightSearchTab;
