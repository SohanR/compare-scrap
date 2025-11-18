import React, { useState } from "react";
import {
  Card,
  CardContent,
  Box,
  Typography,
  Divider,
  TextField,
  Button,
  Paper,
  Grid,
  Chip,
} from "@mui/material";
import { Add, Check, Close, Delete, Edit } from "@mui/icons-material";
import { motion } from "framer-motion";
import { toast } from "react-toastify";

const SettingsVisitedCountriesCard = ({ visitedPlaces, setVisitedPlaces }) => {
  const [newPlace, setNewPlace] = useState({
    code: "",
    name: "",
    year: new Date().getFullYear(),
  });
  const [editingPlaceIndex, setEditingPlaceIndex] = useState(null);

  const handleAddPlace = () => {
    if (!newPlace.code || !newPlace.name) {
      toast.error("Please fill in country code and name");
      return;
    }
    if (editingPlaceIndex !== null) {
      const updated = [...visitedPlaces];
      updated[editingPlaceIndex] = newPlace;
      setVisitedPlaces(updated);
      setEditingPlaceIndex(null);
      toast.success("Country updated");
    } else {
      setVisitedPlaces([...visitedPlaces, newPlace]);
      toast.success("Country added");
    }
    setNewPlace({ code: "", name: "", year: new Date().getFullYear() });
  };

  const handleEditPlace = (index) => {
    setNewPlace(visitedPlaces[index]);
    setEditingPlaceIndex(index);
  };

  const handleRemovePlace = (index) => {
    setVisitedPlaces(visitedPlaces.filter((_, i) => i !== index));
    if (editingPlaceIndex === index) {
      setEditingPlaceIndex(null);
      setNewPlace({ code: "", name: "", year: new Date().getFullYear() });
    }
  };

  return (
    <Card
      sx={{
        borderRadius: 3,
        boxShadow: "0 8px 24px rgba(0,0,0,0.1)",
      }}
    >
      <CardContent sx={{ p: 3 }}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 2,
            mb: 2,
          }}
        >
          <Typography variant="h6" sx={{ fontWeight: 800 }}>
            Visited Countries ({visitedPlaces.length})
          </Typography>
        </Box>

        {/* Visited Places List */}
        {visitedPlaces.length > 0 && (
          <Box sx={{ mb: 3, display: "grid", gap: 2 }}>
            {visitedPlaces.map((place, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Paper
                  sx={{
                    p: 2,
                    bgcolor: "background.default",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    borderRadius: 2,
                    border:
                      editingPlaceIndex === idx ? "2px solid" : "1px solid",
                    borderColor:
                      editingPlaceIndex === idx ? "primary.main" : "divider",
                  }}
                >
                  <Box>
                    <Typography sx={{ fontSize: "1.5rem", mb: 0.5 }}>
                      {place.code} {place.name}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Visited in {place.year}
                    </Typography>
                  </Box>
                  <Box sx={{ display: "flex", gap: 1 }}>
                    <Button
                      size="small"
                      variant="outlined"
                      startIcon={<Edit />}
                      onClick={() => handleEditPlace(idx)}
                    >
                      Edit
                    </Button>
                    <Button
                      size="small"
                      variant="outlined"
                      color="error"
                      startIcon={<Delete />}
                      onClick={() => handleRemovePlace(idx)}
                    >
                      Remove
                    </Button>
                  </Box>
                </Paper>
              </motion.div>
            ))}
          </Box>
        )}

        {/* Add/Edit Place Form */}
        <Divider sx={{ my: 2 }} />
        <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 2 }}>
          {editingPlaceIndex !== null ? "Update Country" : "Add New Country"}
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Country Code"
              value={newPlace.code}
              onChange={(e) =>
                setNewPlace({ ...newPlace, code: e.target.value })
              }
              placeholder="🇧🇩"
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: 2,
                },
              }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Country Name"
              value={newPlace.name}
              onChange={(e) =>
                setNewPlace({ ...newPlace, name: e.target.value })
              }
              placeholder="Bangladesh"
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: 2,
                },
              }}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Year Visited"
              type="number"
              value={newPlace.year}
              onChange={(e) =>
                setNewPlace({
                  ...newPlace,
                  year: parseInt(e.target.value),
                })
              }
              InputProps={{
                inputProps: {
                  min: 1900,
                  max: new Date().getFullYear(),
                },
              }}
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: 2,
                },
              }}
            />
          </Grid>
          <Grid item xs={12}>
            <Box sx={{ display: "flex", gap: 1 }}>
              <Button
                variant="contained"
                fullWidth
                startIcon={editingPlaceIndex !== null ? <Check /> : <Add />}
                onClick={handleAddPlace}
                sx={{
                  background:
                    "linear-gradient(45deg, #667eea 30%, #764ba2 90%)",
                  borderRadius: 2,
                }}
              >
                {editingPlaceIndex !== null ? "Update Country" : "Add Country"}
              </Button>
              {editingPlaceIndex !== null && (
                <Button
                  variant="outlined"
                  onClick={() => {
                    setEditingPlaceIndex(null);
                    setNewPlace({
                      code: "",
                      name: "",
                      year: new Date().getFullYear(),
                    });
                  }}
                  startIcon={<Close />}
                  sx={{ borderRadius: 2 }}
                >
                  Cancel
                </Button>
              )}
            </Box>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

export default SettingsVisitedCountriesCard;
