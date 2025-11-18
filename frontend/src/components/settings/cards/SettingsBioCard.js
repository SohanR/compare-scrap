import React from "react";
import { Card, CardContent, Box, Typography, TextField } from "@mui/material";

const SettingsBioCard = ({ bio, setBio }) => {
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
            About You
          </Typography>
        </Box>
        <TextField
          fullWidth
          label="Bio"
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          placeholder="Tell us about yourself..."
          multiline
          rows={4}
          variant="outlined"
          sx={{
            "& .MuiOutlinedInput-root": {
              borderRadius: 2,
            },
          }}
        />
        <Typography
          variant="caption"
          color="text.secondary"
          sx={{ mt: 1, display: "block" }}
        >
          {bio.length}/500 characters
        </Typography>
      </CardContent>
    </Card>
  );
};

export default SettingsBioCard;
