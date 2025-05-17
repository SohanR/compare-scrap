import React, { useState } from "react";
import {
  Box,
  TextField,
  Button,
  Paper,
  Stack,
  Typography,
  RadioGroup,
  FormControlLabel,
  Radio,
} from "@mui/material";
import ReactDatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { fetchFlightData } from "../utils/api";

const FlightSearch = () => {
  const [tripType, setTripType] = useState("one-way");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [departureDate, setDepartureDate] = useState(new Date());
  const [returnDate, setReturnDate] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSearch = async () => {
    setLoading(true);
    setError(null);

    try {
      const searchParams = {
        tripType,
        from,
        to,
        departureDate: departureDate.toISOString().split("T")[0],
        ...(tripType === "round-trip" && {
          returnDate: returnDate?.toISOString().split("T")[0],
        }),
      };
      const data = await fetchFlightData(searchParams);
      console.log("Flight Data:", data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Paper
      elevation={3}
      sx={{
        p: 4,
        background: "rgba(255, 255, 255, 0.95)",
        backdropFilter: "blur(10px)",
        borderRadius: "16px",
      }}
    >
      <Typography variant="h5" fontWeight="bold" color="primary" gutterBottom>
        Search Flights
      </Typography>

      <RadioGroup
        row
        value={tripType}
        onChange={(e) => setTripType(e.target.value)}
        sx={{ mb: 3 }}
      >
        <FormControlLabel value="one-way" control={<Radio />} label="One Way" />
        <FormControlLabel
          value="round-trip"
          control={<Radio />}
          label="Round Trip"
        />
      </RadioGroup>

      <Stack spacing={3}>
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
        <Typography variant="body2" color="text.secondary">
          Note: Flights only work with airport-to-airport searches.
        </Typography>

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

        {tripType === "round-trip" && (
          <ReactDatePicker
            selected={returnDate}
            onChange={(date) => setReturnDate(date)}
            dateFormat="yyyy-MM-dd"
            minDate={departureDate}
            customInput={
              <TextField
                label="Return Date"
                fullWidth
                value={returnDate ? returnDate.toLocaleDateString() : ""}
              />
            }
          />
        )}

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

        {error && (
          <Typography color="error" variant="body2">
            {error}
          </Typography>
        )}
      </Stack>
    </Paper>
  );
};

export default FlightSearch;
