import React from "react";
import {
  Box,
  Typography,
  Card,
  CardMedia,
  CardContent,
  Button,
  IconButton,
} from "@mui/material";
import { Delete } from "@mui/icons-material";
import { toast } from "react-toastify";

const ProfileBookmarks = ({ bookmarks, setBookmarks }) => {
  const handleRemoveBookmark = (id) => {
    const updated = bookmarks.filter((b) => b.id !== id);
    setBookmarks(updated);
    localStorage.setItem("bookmarks", JSON.stringify(updated));
    toast.success("Bookmark removed");
  };

  return (
    <Box sx={{ display: "grid", gap: 2 }}>
      {bookmarks.length === 0 ? (
        <Typography variant="body2" color="text.secondary">
          No bookmarks yet. Save flights, hotels or places to see them here.
        </Typography>
      ) : (
        bookmarks.map((b) => (
          <Card
            key={b.id}
            sx={{ display: "flex", alignItems: "center", gap: 2 }}
          >
            {b.image && (
              <CardMedia
                component="img"
                sx={{
                  width: 140,
                  height: 84,
                  objectFit: "cover",
                }}
                image={b.image}
                alt={b.name}
              />
            )}
            <CardContent sx={{ flex: 1 }}>
              <Typography variant="subtitle1" fontWeight={700}>
                {b.name}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {b.type} • {b.price ? `৳${b.price}` : ""}
              </Typography>
            </CardContent>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: 1,
                pr: 2,
              }}
            >
              <Button
                size="small"
                variant="contained"
                href={b.link}
                target="_blank"
              >
                Open
              </Button>
              <IconButton onClick={() => handleRemoveBookmark(b.id)}>
                <Delete />
              </IconButton>
            </Box>
          </Card>
        ))
      )}
    </Box>
  );
};

export default ProfileBookmarks;
