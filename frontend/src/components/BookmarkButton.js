import React from "react";
import { IconButton, Tooltip } from "@mui/material";
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const BookmarkButton = ({
  sx,
  withToastContainer = false,
  onBookmark,
  payload,
}) => {
  const handleClick = (event) => {
    // Allow parent components to stop card clicks when bookmarking
    event?.stopPropagation?.();
    if (onBookmark) {
      onBookmark(payload);
      return;
    }
    toast.success("Added to bookmark");
  };

  return (
    <>
      {withToastContainer && <ToastContainer position="top-center" />}
      <Tooltip title="Add to bookmark" arrow>
        <IconButton color="primary" onClick={handleClick} sx={sx}>
          <BookmarkBorderIcon />
        </IconButton>
      </Tooltip>
    </>
  );
};

export default BookmarkButton;
