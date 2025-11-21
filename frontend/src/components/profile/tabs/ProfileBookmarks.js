import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Card,
  Button,
  IconButton,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Divider,
  Skeleton,
} from "@mui/material";
import { Delete } from "@mui/icons-material";
import FlightCard from "../../FlightCard";
import ResultCard from "../../ResultCard";
import PlaceCard from "../../PlaceCard";

const categoryOptions = [
  { value: "all", label: "All" },
  { value: "transportation", label: "Flights" },
  { value: "hotels", label: "Hotels" },
  { value: "todo", label: "Things to Do" },
  { value: "tipsAndStories", label: "Tips & Stories" },
  { value: "other", label: "Other" },
];

const ProfileBookmarks = ({
  bookmarks,
  fetchBookmarks,
  loading,
  onRemoveBookmark,
}) => {
  const [category, setCategory] = useState("all");

  useEffect(() => {
    if (fetchBookmarks) {
      fetchBookmarks(category);
    }
  }, [category, fetchBookmarks]);

  const renderBookmarkCard = (bookmark) => {
    const overlayRemove = (
      <Box
        sx={{
          position: "absolute",
          top: 8,
          right: 8,
          zIndex: 2,
          bgcolor: "rgba(255,255,255,0.9)",
          borderRadius: "50%",
          boxShadow: 1,
        }}
      >
        <IconButton onClick={() => onRemoveBookmark?.(bookmark._id)} size="small">
          <Delete fontSize="small" />
        </IconButton>
      </Box>
    );

    const wrapperStyles = { position: "relative" };

    if (bookmark.category === "transportation") {
      return (
        <Box key={bookmark._id} sx={wrapperStyles}>
          {overlayRemove}
          <FlightCard item={bookmark.item} showBookmark={false} />
        </Box>
      );
    }

    if (bookmark.category === "hotels") {
      return (
        <Box key={bookmark._id} sx={wrapperStyles}>
          {overlayRemove}
          <ResultCard
            item={bookmark.item}
            type="hotel"
            showBookmark={false}
          />
        </Box>
      );
    }

    if (bookmark.category === "todo" || bookmark.category === "tipsAndStories") {
      return (
        <Box key={bookmark._id} sx={wrapperStyles}>
          {overlayRemove}
          <PlaceCard place={bookmark.item} showBookmark={false} />
        </Box>
      );
    }

    const fallbackTitle =
      bookmark.item?.name ||
      bookmark.item?.flightName ||
      bookmark.item?.title ||
      "Saved item";
    const fallbackLink = bookmark.item?.bookingLink || bookmark.item?.link;

    return (
      <Card key={bookmark._id} sx={{ p: 2, position: "relative" }}>
        {overlayRemove}
        <Typography variant="subtitle1" fontWeight={700}>
          {fallbackTitle}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
          {bookmark.category || "other"}
        </Typography>
        {fallbackLink && (
          <Button size="small" variant="outlined" href={fallbackLink} target="_blank">
            Open
          </Button>
        )}
      </Card>
    );
  };

  return (
    <Box sx={{ display: "grid", gap: 2 }}>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: 2,
        }}
      >
        <Typography variant="h6" fontWeight={700}>
          Saved Bookmarks
        </Typography>
        <FormControl size="small" sx={{ minWidth: 180 }}>
          <InputLabel id="bookmark-category-label">Category</InputLabel>
          <Select
            labelId="bookmark-category-label"
            value={category}
            label="Category"
            onChange={(e) => setCategory(e.target.value)}
          >
            {categoryOptions.map((opt) => (
              <MenuItem key={opt.value} value={opt.value}>
                {opt.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      <Divider />

      {loading ? (
        <Box sx={{ display: "grid", gap: 2 }}>
          {[1, 2, 3].map((i) => (
            <Skeleton
              key={i}
              variant="rectangular"
              height={140}
              animation="wave"
              sx={{ borderRadius: 2 }}
            />
          ))}
        </Box>
      ) : bookmarks.length === 0 ? (
        <Typography variant="body2" color="text.secondary">
          No bookmarks yet. Save flights, hotels or places to see them here.
        </Typography>
      ) : (
        bookmarks.map((b) => renderBookmarkCard(b))
      )}
    </Box>
  );
};

export default ProfileBookmarks;
