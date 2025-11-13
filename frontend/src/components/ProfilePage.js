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
} from "@mui/material";
import {
  Edit,
  Delete,
  History,
  Bookmark,
  Flight,
  LocalOffer,
  EmojiFlags,
} from "@mui/icons-material";
import { formatDistanceToNow } from "date-fns";
import useAuthStore from "../store/authStore";
import { toast, ToastContainer } from "react-toastify";
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

  // TODO: Load bio from API
  const [bio, setBio] = useState(user?.bio || "");

  // TODO: Load visitedCountries from API
  const [visitedCountries, setVisitedCountries] = useState([
    { code: "🇧🇩", name: "Bangladesh", year: 2023 },
    { code: "🇹🇭", name: "Thailand", year: 2023 },
    { code: "🇻🇳", name: "Vietnam", year: 2022 },
  ]);

  // Load bookmarks and search history from API (to be implemented)
  // TODO: Replace localStorage with API calls
  useEffect(() => {
    try {
      const b = JSON.parse(localStorage.getItem("bookmarks") || "[]");
      setBookmarks(Array.isArray(b) ? b : []);
    } catch {
      setBookmarks([]);
    }
    try {
      const h = JSON.parse(localStorage.getItem("searchHistory") || "[]");
      setHistory(Array.isArray(h) ? h : []);
    } catch {
      setHistory([]);
    }
  }, []);

  const handleRemoveBookmark = (id) => {
    const updated = bookmarks.filter((b) => b.id !== id);
    setBookmarks(updated);
    localStorage.setItem("bookmarks", JSON.stringify(updated));
    toast.success("Bookmark removed");
  };

  const handleClearHistory = () => {
    setHistory([]);
    localStorage.removeItem("searchHistory");
    toast.success("Search history cleared");
  };

  const handleLogout = () => {
    logout();
    toast.info("Logged out");
    // navigation handled by NavBar / route protection
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
                            <Box key={i} sx={{ mt: 1 }}>
                              <Typography variant="body2" fontWeight={700}>
                                {h.query || `${h.from} → ${h.to}`}
                              </Typography>
                              <Typography
                                variant="caption"
                                color="text.secondary"
                              >
                                {formatDistanceToNow(
                                  new Date(h.timestamp || Date.now()),
                                  { addSuffix: true }
                                )}
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
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <Typography variant="subtitle2" color="text.secondary">
                      Your past searches
                    </Typography>
                    <Button
                      onClick={handleClearHistory}
                      color="error"
                      startIcon={<Delete />}
                      size="small"
                    >
                      Clear history
                    </Button>
                  </Box>

                  <List>
                    {history.length === 0 ? (
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ mt: 1 }}
                      >
                        No search history yet.
                      </Typography>
                    ) : (
                      history.map((h, i) => (
                        <React.Fragment key={i}>
                          <ListItem>
                            <ListItemText
                              primary={h.query || `${h.from} → ${h.to}`}
                              secondary={formatDistanceToNow(
                                new Date(h.timestamp || Date.now()),
                                { addSuffix: true }
                              )}
                            />
                            <Button size="small" href="/search">
                              Repeat
                            </Button>
                          </ListItem>
                          <Divider />
                        </React.Fragment>
                      ))
                    )}
                  </List>
                </TabPanel>
              </Paper>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </>
  );
};

export default ProfilePage;
