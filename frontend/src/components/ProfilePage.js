import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Container,
  Typography,
  Paper,
  Avatar,
  Button,
  Grid,
  Tabs,
  Tab,
  Card,
  CardMedia,
  CardContent,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Divider,
  Chip,
  Skeleton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
} from "@mui/material";
import {
  Edit,
  Delete,
  History,
  Bookmark,
  Flight,
  LocalOffer,
  EmojiFlags,
  MapOutlined,
  CalendarTodayOutlined,
} from "@mui/icons-material";
import { formatDistanceToNow } from "date-fns";
import { motion } from "framer-motion";
import useAuthStore from "../store/authStore";
import { toast, ToastContainer } from "react-toastify";
import {
  getUserSearchHistory,
  deleteSearchHistory,
  clearUserSearchHistory,
} from "../utils/api";
import "react-toastify/dist/ReactToastify.css";

function TabPanel({ children, value, index }) {
  return value === index ? <Box sx={{ mt: 2 }}>{children}</Box> : null;
}

const ProfilePage = () => {
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const navigate = useNavigate();
  const [tab, setTab] = useState(0);

  const [bookmarks, setBookmarks] = useState([]);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [removingId, setRemovingId] = useState(null);
  const [clearDialogOpen, setClearDialogOpen] = useState(false);
  const [clearing, setClearing] = useState(false);

  const [bio, setBio] = useState(user?.bio || "");
  const [visitedCountries, setVisitedCountries] = useState([
    { code: "🇧🇩", name: "Bangladesh", year: 2023 },
    { code: "🇹🇭", name: "Thailand", year: 2023 },
    { code: "🇻🇳", name: "Vietnam", year: 2022 },
  ]);

  // Load search history from API
  useEffect(() => {
    if (user && user.id) {
      fetchSearchHistory();
    }

    // Load bookmarks from localStorage
    try {
      const b = JSON.parse(localStorage.getItem("bookmarks") || "[]");
      setBookmarks(Array.isArray(b) ? b : []);
    } catch {
      setBookmarks([]);
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

  const handleRemoveSearchHistory = async (historyId) => {
    setRemovingId(historyId);
    try {
      await deleteSearchHistory(historyId);
      setHistory((prev) => prev.filter((h) => h._id !== historyId));
      toast.success("Search removed from history");
    } catch (err) {
      toast.error("Failed to remove search history");
      console.error(err);
    } finally {
      setRemovingId(null);
    }
  };

  const handleClearAllHistory = async () => {
    setClearing(true);
    try {
      await clearUserSearchHistory(user.id);
      setHistory([]);
      setClearDialogOpen(false);
      toast.success("All search history cleared");
    } catch (err) {
      toast.error("Failed to clear search history");
      console.error(err);
    } finally {
      setClearing(false);
    }
  };

  const handleRemoveBookmark = (id) => {
    const updated = bookmarks.filter((b) => b.id !== id);
    setBookmarks(updated);
    localStorage.setItem("bookmarks", JSON.stringify(updated));
    toast.success("Bookmark removed");
  };

  const handleLogout = () => {
    logout();
    toast.info("Logged out");
  };

  const handleEditProfile = () => {
    navigate("/settings");
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
            {/* Left: Profile summary */}
            <Grid item xs={12} md={4}>
              <Paper
                elevation={3}
                sx={{
                  p: 3,
                  borderRadius: 3,
                  display: "flex",
                  flexDirection: "column",
                  height: "100%",
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                  <Avatar
                    sx={{
                      width: 84,
                      height: 84,
                      bgcolor: "primary.main",
                      fontSize: 28,
                    }}
                  >
                    {user?.name?.charAt(0)?.toUpperCase() || "U"}
                  </Avatar>
                  <Box>
                    <Typography variant="h6" sx={{ fontWeight: 800 }}>
                      {user?.name || "Traveler"}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {user?.email || "No email"}
                    </Typography>
                  </Box>
                </Box>

                {/* Bio Section */}
                <Paper
                  sx={{
                    p: 2,
                    mt: 3,
                    bgcolor: "primary.light",
                    borderRadius: 2,
                  }}
                >
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{ fontWeight: 600 }}
                  >
                    YOUR BIO
                  </Typography>
                  <Typography variant="body2" sx={{ mt: 1, minHeight: 40 }}>
                    {bio || "No bio added yet. Add one in settings!"}
                  </Typography>
                </Paper>

                {/* Visited Countries */}
                <Box sx={{ mt: 3 }}>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                      mb: 1.5,
                    }}
                  >
                    <EmojiFlags sx={{ color: "primary.main" }} />
                    <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                      Visited Countries ({visitedCountries.length})
                    </Typography>
                  </Box>
                  <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                    {visitedCountries.length === 0 ? (
                      <Typography variant="caption" color="text.secondary">
                        Start adding countries you've visited!
                      </Typography>
                    ) : (
                      visitedCountries.map((country, idx) => (
                        <Chip
                          key={idx}
                          label={`${country.code} ${country.name}`}
                          size="small"
                          variant="outlined"
                          icon={undefined}
                          sx={{
                            fontSize: "0.75rem",
                            fontWeight: 600,
                            borderColor: "primary.main",
                            color: "primary.main",
                          }}
                        />
                      ))
                    )}
                  </Box>
                </Box>

                <Box
                  sx={{
                    mt: 3,
                    display: "flex",
                    gap: 1,
                    flexDirection: "column",
                  }}
                >
                  <Typography variant="subtitle2" color="text.secondary">
                    Quick stats
                  </Typography>
                  <Box sx={{ display: "flex", gap: 2, mt: 1 }}>
                    <Paper sx={{ p: 1.5, flex: 1, textAlign: "center" }}>
                      <Typography variant="h6" sx={{ fontWeight: 700 }}>
                        {bookmarks.length}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Bookmarks
                      </Typography>
                    </Paper>
                    <Paper sx={{ p: 1.5, flex: 1, textAlign: "center" }}>
                      <Typography variant="h6" sx={{ fontWeight: 700 }}>
                        {history.length}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Searches
                      </Typography>
                    </Paper>
                  </Box>

                  <Box sx={{ display: "flex", gap: 1, mt: 2 }}>
                    <Button
                      variant="contained"
                      startIcon={<Edit />}
                      fullWidth
                      onClick={handleEditProfile}
                    >
                      Edit Profile
                    </Button>
                  </Box>

                  <Divider sx={{ my: 2 }} />

                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mb: 1 }}
                  >
                    Traveler tools
                  </Typography>
                  <Box sx={{ display: "grid", gap: 1 }}>
                    <Button
                      startIcon={<Flight />}
                      variant="text"
                      component="a"
                      href="/search"
                    >
                      Find Flights & Hotels
                    </Button>
                    <Button
                      startIcon={<LocalOffer />}
                      variant="text"
                      component="a"
                      href="/search"
                    >
                      Deals & Alerts
                    </Button>
                    <Button
                      startIcon={<Bookmark />}
                      variant="text"
                      onClick={() => setTab(1)}
                    >
                      My Bookmarks
                    </Button>
                    <Button
                      startIcon={<History />}
                      variant="text"
                      onClick={() => setTab(2)}
                    >
                      Search History
                    </Button>
                  </Box>

                  <Box sx={{ mt: "auto", pt: 2 }}>
                    <Button
                      variant="outlined"
                      color="error"
                      onClick={handleLogout}
                      startIcon={<Delete />}
                      fullWidth
                      sx={{
                        "&:hover": {
                          backgroundColor: "error.main",
                          color: "white",
                        },
                      }}
                    >
                      Logout
                    </Button>
                  </Box>
                </Box>
              </Paper>
            </Grid>

            {/* Right: Tabs - Overview / Bookmarks / History */}
            <Grid item xs={12} md={8}>
              <Paper elevation={3} sx={{ p: 2, borderRadius: 3 }}>
                <Tabs
                  value={tab}
                  onChange={(e, v) => setTab(v)}
                  aria-label="profile tabs"
                >
                  <Tab label="Overview" />
                  <Tab label={`Bookmarks (${bookmarks.length})`} />
                  <Tab label={`Search History (${history.length})`} />
                </Tabs>

                <TabPanel value={tab} index={0}>
                  <Typography variant="h5" sx={{ fontWeight: 800, mb: 1 }}>
                    Hello, {user?.name || "Traveler"} 👋
                  </Typography>
                  <Typography
                    variant="body1"
                    color="text.secondary"
                    sx={{ mb: 2 }}
                  >
                    Welcome to your TravelGo dashboard — your hub for saved
                    deals, search history, and quick actions to plan your next
                    trip.
                  </Typography>

                  <Grid container spacing={2}>
                    <Grid item xs={12} md={6}>
                      <Paper sx={{ p: 2, borderRadius: 2 }}>
                        <Typography variant="subtitle2" color="text.secondary">
                          Recent Bookmarks
                        </Typography>
                        {bookmarks.length === 0 ? (
                          <Typography variant="body2" sx={{ mt: 1 }}>
                            You don't have any bookmarks yet. Tap the bookmark
                            icon on any result to save it.
                          </Typography>
                        ) : (
                          bookmarks.slice(0, 3).map((b) => (
                            <Card key={b.id} sx={{ display: "flex", mt: 1 }}>
                              {b.image && (
                                <CardMedia
                                  component="img"
                                  sx={{ width: 96 }}
                                  image={b.image}
                                  alt={b.name}
                                />
                              )}
                              <CardContent sx={{ flex: 1 }}>
                                <Typography
                                  variant="subtitle2"
                                  fontWeight={700}
                                >
                                  {b.name}
                                </Typography>
                                <Typography
                                  variant="body2"
                                  color="text.secondary"
                                >
                                  {b.type || "item"}
                                </Typography>
                                <Box sx={{ display: "flex", gap: 1, mt: 1 }}>
                                  <Button
                                    size="small"
                                    href={b.link}
                                    target="_blank"
                                  >
                                    View
                                  </Button>
                                  <IconButton
                                    size="small"
                                    onClick={() => handleRemoveBookmark(b.id)}
                                  >
                                    <Delete fontSize="small" />
                                  </IconButton>
                                </Box>
                              </CardContent>
                            </Card>
                          ))
                        )}
                      </Paper>
                    </Grid>

                    <Grid item xs={12} md={6}>
                      <Paper sx={{ p: 2, borderRadius: 2 }}>
                        <Typography variant="subtitle2" color="text.secondary">
                          Recent Searches
                        </Typography>
                        {history.length === 0 ? (
                          <Typography variant="body2" sx={{ mt: 1 }}>
                            No recent searches. Try searching for flights and
                            hotels to see history here.
                          </Typography>
                        ) : (
                          history.slice(0, 5).map((h, i) => (
                            <Box
                              key={i}
                              sx={{
                                mt: 1.5,
                                p: 1.5,
                                bgcolor: "background.default",
                                borderRadius: 1,
                                border: "1px solid",
                                borderColor: "divider",
                              }}
                            >
                              <Typography variant="body2" fontWeight={700}>
                                {h.from?.city} → {h.to?.city}
                              </Typography>
                              <Typography
                                variant="caption"
                                color="text.secondary"
                              >
                                {h.date} •{" "}
                                {formatDistanceToNow(new Date(h.createdAt), {
                                  addSuffix: true,
                                })}
                              </Typography>
                            </Box>
                          ))
                        )}
                      </Paper>
                    </Grid>
                  </Grid>
                </TabPanel>

                <TabPanel value={tab} index={1}>
                  <Box sx={{ display: "grid", gap: 2 }}>
                    {bookmarks.length === 0 ? (
                      <Typography variant="body2" color="text.secondary">
                        No bookmarks yet. Save flights, hotels or places to see
                        them here.
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
                            <IconButton
                              onClick={() => handleRemoveBookmark(b.id)}
                            >
                              <Delete />
                            </IconButton>
                          </Box>
                        </Card>
                      ))
                    )}
                  </Box>
                </TabPanel>

                <TabPanel value={tab} index={2}>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        mb: 3,
                      }}
                    >
                      <Box>
                        <Typography variant="h6" sx={{ fontWeight: 800 }}>
                          Your Search History
                        </Typography>
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{ mt: 0.5 }}
                        >
                          All your searches from TravelGo
                        </Typography>
                      </Box>
                      <Button
                        onClick={() => setClearDialogOpen(true)}
                        color="error"
                        startIcon={<Delete />}
                        size="small"
                        disabled={history.length === 0 || loading}
                      >
                        Clear All
                      </Button>
                    </Box>

                    {loading ? (
                      <Box
                        sx={{
                          display: "flex",
                          flexDirection: "column",
                          gap: 2,
                        }}
                      >
                        {[1, 2, 3].map((i) => (
                          <Skeleton
                            key={i}
                            variant="rectangular"
                            height={80}
                            sx={{ borderRadius: 2 }}
                          />
                        ))}
                      </Box>
                    ) : history.length === 0 ? (
                      <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 0.3 }}
                      >
                        <Paper
                          sx={{
                            p: 4,
                            textAlign: "center",
                            bgcolor: "background.default",
                            border: "2px dashed",
                            borderColor: "divider",
                            borderRadius: 3,
                          }}
                        >
                          <History
                            sx={{
                              fontSize: 48,
                              color: "text.secondary",
                              mb: 2,
                              opacity: 0.5,
                            }}
                          />
                          <Typography
                            variant="h6"
                            color="text.secondary"
                            sx={{ fontWeight: 600, mb: 1 }}
                          >
                            No search history yet
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Your searches will appear here when you start
                            looking for flights, hotels, and places.
                          </Typography>
                          <Button
                            variant="contained"
                            sx={{ mt: 2 }}
                            onClick={() => navigate("/search")}
                          >
                            Start Searching
                          </Button>
                        </Paper>
                      </motion.div>
                    ) : (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.3 }}
                      >
                        <Box sx={{ display: "grid", gap: 2 }}>
                          {history.map((h, index) => (
                            <motion.div
                              key={h._id}
                              className={`search-history-item ${
                                removingId === h._id ? "removing" : ""
                              }`}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              exit={{ opacity: 0, x: 20 }}
                              transition={{
                                duration: 0.3,
                                delay: index * 0.05,
                              }}
                            >
                              <Card
                                className="history-item-hover"
                                sx={{
                                  display: "flex",
                                  alignItems: "center",
                                  p: 2,
                                  border: "1px solid",
                                  borderColor: "divider",
                                }}
                              >
                                <Box
                                  sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    flex: 1,
                                    gap: 2,
                                  }}
                                >
                                  <Box
                                    sx={{
                                      display: "flex",
                                      alignItems: "center",
                                      justifyContent: "center",
                                      width: 50,
                                      height: 50,
                                      borderRadius: 2,
                                      bgcolor: "primary.light",
                                    }}
                                  >
                                    <Flight
                                      sx={{
                                        color: "primary.main",
                                        fontSize: 24,
                                      }}
                                    />
                                  </Box>

                                  <Box sx={{ flex: 1 }}>
                                    <Box
                                      sx={{
                                        display: "flex",
                                        alignItems: "center",
                                        gap: 1,
                                        mb: 0.5,
                                      }}
                                    >
                                      <Chip
                                        label={h.from?.city || "Unknown"}
                                        size="small"
                                        variant="outlined"
                                        icon={<MapOutlined />}
                                      />
                                      <Typography
                                        sx={{
                                          fontWeight: 600,
                                          color: "text.secondary",
                                        }}
                                      >
                                        →
                                      </Typography>
                                      <Chip
                                        label={h.to?.city || "Unknown"}
                                        size="small"
                                        variant="outlined"
                                        icon={<MapOutlined />}
                                      />
                                    </Box>
                                    <Box
                                      sx={{
                                        display: "flex",
                                        alignItems: "center",
                                        gap: 1,
                                      }}
                                    >
                                      <CalendarTodayOutlined
                                        sx={{
                                          fontSize: 14,
                                          color: "text.secondary",
                                        }}
                                      />
                                      <Typography variant="caption">
                                        {h.date}
                                      </Typography>
                                      <Typography
                                        variant="caption"
                                        color="text.secondary"
                                      >
                                        •{" "}
                                        {formatDistanceToNow(
                                          new Date(h.createdAt),
                                          {
                                            addSuffix: true,
                                          }
                                        )}
                                      </Typography>
                                    </Box>
                                  </Box>
                                </Box>

                                <Box
                                  sx={{
                                    display: "flex",
                                    gap: 1,
                                  }}
                                >
                                  <Button
                                    size="small"
                                    variant="contained"
                                    sx={{ textTransform: "none" }}
                                    onClick={() => navigate("/search")}
                                  >
                                    Repeat Search
                                  </Button>
                                  <IconButton
                                    className="delete-button-hover"
                                    size="small"
                                    color="error"
                                    onClick={() =>
                                      handleRemoveSearchHistory(h._id)
                                    }
                                    disabled={removingId === h._id}
                                  >
                                    {removingId === h._id ? (
                                      <CircularProgress size={20} />
                                    ) : (
                                      <Delete />
                                    )}
                                  </IconButton>
                                </Box>
                              </Card>
                            </motion.div>
                          ))}
                        </Box>
                      </motion.div>
                    )}
                  </motion.div>
                </TabPanel>
              </Paper>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Clear All Dialog */}

      <Dialog
        open={clearDialogOpen}
        onClose={() => !clearing && setClearDialogOpen(false)}
        PaperProps={{
          sx: {
            borderRadius: 3,
            backgroundImage:
              "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          },
        }}
      >
        <DialogTitle sx={{ fontWeight: 800, color: "white" }}>
          Clear All Search History?
        </DialogTitle>

        <DialogContent sx={{ color: "white", py: 3 }}>
          <Typography>
            This action cannot be undone. All your search history will be
            permanently deleted.
          </Typography>
        </DialogContent>

        <DialogActions sx={{ p: 2 }}>
          <Button
            onClick={() => setClearDialogOpen(false)}
            disabled={clearing}
            sx={{ color: "white" }}
          >
            Cancel
          </Button>

          <Button
            onClick={handleClearAllHistory}
            disabled={clearing}
            variant="contained"
            color="error"
            startIcon={clearing && <CircularProgress size={20} />}
          >
            {clearing ? "Clearing..." : "Delete All"}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};
export default ProfilePage;
