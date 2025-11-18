import React, { useEffect } from "react";
import {
  Box,
  Typography,
  Button,
  Paper,
  Card,
  IconButton,
  Chip,
  Skeleton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
} from "@mui/material";
import {
  Delete,
  History,
  MapOutlined,
  CalendarTodayOutlined,
} from "@mui/icons-material";
import { motion } from "framer-motion";
import { formatDistanceToNow } from "date-fns";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import useAuthStore from "../../../store/authStore";
import {
  getUserSearchHistory,
  deleteSearchHistory,
  clearUserSearchHistory,
} from "../../../utils/api";

const ProfileSearchHistory = ({ history, setHistory, loading, setLoading }) => {
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);
  const [removingId, setRemovingId] = React.useState(null);
  const [clearDialogOpen, setClearDialogOpen] = React.useState(false);
  const [clearing, setClearing] = React.useState(false);

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

  return (
    <>
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
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
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
                Your searches will appear here when you start looking for
                flights, hotels, and places.
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
                        <History
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
                          <Typography variant="caption">{h.date}</Typography>
                          <Typography variant="caption" color="text.secondary">
                            •{" "}
                            {formatDistanceToNow(new Date(h.createdAt), {
                              addSuffix: true,
                            })}
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
                        onClick={() => handleRemoveSearchHistory(h._id)}
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

export default ProfileSearchHistory;
