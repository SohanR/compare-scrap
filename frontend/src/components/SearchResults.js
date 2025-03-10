import React from "react";
import {
  Card,
  CardContent,
  Typography,
  Grid,
  Button,
  Chip,
  Box,
} from "@mui/material";
import FlightIcon from "@mui/icons-material/Flight";
import DirectionsBusIcon from "@mui/icons-material/DirectionsBus";
import HotelIcon from "@mui/icons-material/Hotel";
import LocationOnIcon from "@mui/icons-material/LocationOn";

const SearchResults = ({ type, data }) => {
  const renderTransportation = (item) => (
    <Card className="result-card">
      <CardContent>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Box display="flex" alignItems="center">
            {item.type === "flight" ? <FlightIcon /> : <DirectionsBusIcon />}
            <Typography variant="h6" sx={{ ml: 1 }}>
              {item.provider}
            </Typography>
          </Box>
          <Chip
            label={`৳${item.price}`}
            color="success"
            className="price-tag"
          />
        </Box>
        <Box mt={2}>
          <Typography color="textSecondary">
            Duration: {item.duration}
          </Typography>
          <Typography color="textSecondary">
            Departure: {item.departureTime}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );

  const renderHotel = (hotel) => (
    <Card className="result-card">
      <CardContent>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Box display="flex" alignItems="center">
            <HotelIcon />
            <Typography variant="h6" sx={{ ml: 1 }}>
              {hotel.name}
            </Typography>
          </Box>
          <Chip
            label={`৳${hotel.price}/night`}
            color="success"
            className="price-tag"
          />
        </Box>
        <Typography color="textSecondary" sx={{ mt: 1 }}>
          {hotel.rating} ★ • {hotel.location}
        </Typography>
        <Button
          variant="contained"
          color="primary"
          href={hotel.bookingLink}
          target="_blank"
          sx={{ mt: 2 }}
        >
          Book Now
        </Button>
      </CardContent>
    </Card>
  );

  const renderTouristPlace = (place) => (
    <Card className="result-card">
      <CardContent>
        <Box display="flex" alignItems="center">
          <LocationOnIcon />
          <Typography variant="h6" sx={{ ml: 1 }}>
            {place.name}
          </Typography>
        </Box>
        <Typography color="textSecondary" sx={{ mt: 1 }}>
          {place.description}
        </Typography>
        {place.rating && (
          <Chip label={`${place.rating} ★`} size="small" sx={{ mt: 1 }} />
        )}
      </CardContent>
    </Card>
  );

  return (
    <Grid container spacing={2}>
      {data.map((item, index) => (
        <Grid item xs={12} sm={6} md={4} key={index}>
          {type === "transportation" && renderTransportation(item)}
          {type === "hotels" && renderHotel(item)}
          {type === "places" && renderTouristPlace(item)}
        </Grid>
      ))}
    </Grid>
  );
};

export default SearchResults;
