import React, { useState, useEffect, useCallback } from "react";
import { Box, Container, Grid, Paper } from "@mui/material";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ProfileSidebar from "../components/profile/ProfileSidebar";
import ProfileTabs from "../components/profile/ProfileTabs";
import useAuthStore from "../store/authStore";
import {
  getUserSearchHistory,
  getUserBookmarks,
  getUserBookmarksByCategory,
  deleteBookmark,
} from "../utils/api";

const ProfilePage = () => {
  const user = useAuthStore((s) => s.user);
  const [tab, setTab] = useState(0);
  const [bookmarks, setBookmarks] = useState([]);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [bookmarkLoading, setBookmarkLoading] = useState(false);
  const userId = user?.id || user?._id;

  // Load search history from API
  useEffect(() => {
    if (userId) {
      fetchSearchHistory();
      fetchBookmarks("all");
    }
  }, [userId]);

  const fetchSearchHistory = async () => {
    setLoading(true);
    try {
      const data = await getUserSearchHistory(userId);
      setHistory(data);
    } catch (err) {
      toast.error("Failed to load search history");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchBookmarks = useCallback(async (category = "all") => {
    if (!userId) return;
    setBookmarkLoading(true);
    try {
      const data =
        category === "all"
          ? await getUserBookmarks(userId)
          : await getUserBookmarksByCategory(userId, category);
      setBookmarks(Array.isArray(data) ? data : []);
    } catch (err) {
      toast.error("Failed to load bookmarks");
      console.error(err);
    } finally {
      setBookmarkLoading(false);
    }
  }, [userId]);

  const handleRemoveBookmark = async (bookmarkId) => {
    try {
      await deleteBookmark(bookmarkId);
      setBookmarks((prev) => prev.filter((b) => b._id !== bookmarkId));
      toast.success("Bookmark removed");
    } catch (err) {
      toast.error(err.message || "Failed to remove bookmark");
    }
  };

  return (
    <>
      <ToastContainer position="top-center" />
      <Box
        sx={{
          minHeight: "80vh",
          py: 4,
          background: "linear-gradient(180deg,#f7fbff,#fff)",
        }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={3}>
            <Grid item xs={12} md={4}>
              <ProfileSidebar
                bookmarks={bookmarks}
                history={history}
                onTabChange={setTab}
              />
            </Grid>

            <Grid item xs={12} md={8}>
              <Paper elevation={3} sx={{ p: 2, borderRadius: 3 }}>
                <ProfileTabs
                  tab={tab}
                  onTabChange={setTab}
                  bookmarks={bookmarks}
                  history={history}
                  setHistory={setHistory}
                  loading={loading}
                  setLoading={setLoading}
                  fetchBookmarks={fetchBookmarks}
                  bookmarkLoading={bookmarkLoading}
                  onRemoveBookmark={handleRemoveBookmark}
                />
              </Paper>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </>
  );
};

export default ProfilePage;
