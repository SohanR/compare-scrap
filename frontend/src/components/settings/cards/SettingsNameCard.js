import React from "react";
import { Card, CardContent, Box, Typography, TextField } from "@mui/material";
import { Edit } from "@mui/icons-material";

const SettingsNameCard = ({ name, setName }) => {
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
          <Edit sx={{ color: "primary.main", fontSize: 28 }} />
          <Typography variant="h6" sx={{ fontWeight: 800 }}>
            Profile Name
          </Typography>
        </Box>
        <TextField
          fullWidth
          label="Full Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          variant="outlined"
          sx={{
            "& .MuiOutlinedInput-root": {
              borderRadius: 2,
            },
          }}
        />
      </CardContent>
    </Card>
  );
};

export default SettingsNameCard;
