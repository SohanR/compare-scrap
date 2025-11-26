import React from "react";
import { Box, FormControl, InputLabel, MenuItem, Select } from "@mui/material";

const SortControl = ({ options, value, onChange }) => {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "flex-end",
        mb: 3,
      }}
    >
      <FormControl
        size="small"
        variant="outlined"
        sx={{
          minWidth: 240,
          bgcolor: "rgba(255,255,255,0.92)",
          borderRadius: "12px",
          px: 1,
          boxShadow: "0 8px 20px rgba(0,0,0,0.06)",
          "& .MuiOutlinedInput-root": {
            borderRadius: "12px",
            "& fieldset": { borderColor: "rgba(0,0,0,0.12)" },
            "&:hover fieldset": { borderColor: "rgba(0,0,0,0.25)" },
            "&.Mui-focused fieldset": { borderColor: "#2196f3" },
          },
          "& .MuiInputLabel-root": {
            fontWeight: 600,
            color: "text.primary",
            backgroundColor: "rgba(255,255,255,0.92)",
            px: 0.5,
            borderRadius: "6px",
            mt: "-4px",
          },
        }}
      >
        <InputLabel id="sort-label">Sort By</InputLabel>
        <Select
          labelId="sort-label"
          label="Sort By"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          sx={{
            "& .MuiSelect-select": { display: "flex", alignItems: "center" },
          }}
        >
          {options.map((opt) => (
            <MenuItem key={opt.value} value={opt.value}>
              {opt.label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );
};

export default SortControl;
