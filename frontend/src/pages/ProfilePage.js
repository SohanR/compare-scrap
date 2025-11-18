import React, { useState, useEffect } from "react";
import { Box, Container, Grid, Paper } from "@mui/material";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ProfileSidebar from "../components/profile/ProfileSidebar";
import ProfileTabs from "../components/profile/ProfileTabs";
import useAuthStore from "../store/authStore";
import { getUserSearchHistory } from "../utils/api";

const ProfilePage = () => {
  const user = useAuthStore((s) => s.user);
  const [tab, setTab] = useState(0);
  const [bookmarks, setBookmarks] = useState([]);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);

  // Load bookmarks from localStorage
  useEffect(() => {
    try {
      const b = JSON.parse(localStorage.getItem("bookmarks") || "[]");
      setBookmarks(Array.isArray(b) ? b : []);
    } catch {
      setBookmarks([]);
    }
  }, []);

  // Load search history from API
  useEffect(() => {
    if (user && user.id) {
      fetchSearchHistory();
    }
  }, [user]);

  const fetchSearchHistory = async () => {
    setLoading(true);
    try {
      const data = await getUserSearchHistory(user.id);
      setHistory(data);
    } catch (err) {
      toast.error("Failed to load search history");
      console.error(err);
    } finally {
      setLoading(false);
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
                  setBookmarks={setBookmarks}
                  history={history}
                  setHistory={setHistory}
                  loading={loading}
                  setLoading={setLoading}
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
