import React from "react";
import { IconButton, Tooltip } from "@mui/material";
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";
import BookmarkAddedIcon from "@mui/icons-material/BookmarkAdded";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const BookmarkButton = ({
  sx,
  withToastContainer = false,
  onBookmark,
  payload,
  bookmarked = false,
  disabled = false,
}) => {
  const handleClick = async (event) => {
    // Allow parent components to stop card clicks when bookmarking
    event?.stopPropagation?.();
    if (bookmarked || disabled) return;
    if (onBookmark) {
      const result = await onBookmark(payload);
      if (result === false) return;
      return;
    }
    toast.success("Added to bookmark");
  };

  return (
    <>
      {withToastContainer && <ToastContainer position="top-center" />}
      <Tooltip title="Add to bookmark" arrow>
        <IconButton
          color="primary"
          onClick={handleClick}
          sx={sx}
          disabled={bookmarked || disabled}
        >
          {bookmarked ? <BookmarkAddedIcon /> : <BookmarkBorderIcon />}
        </IconButton>
      </Tooltip>
    </>
  );
};

export default BookmarkButton;
