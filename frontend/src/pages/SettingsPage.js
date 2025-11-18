import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Container,
  Typography,
  Paper,
  TextField,
  Button,
  Grid,
  Divider,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
  Chip,
  Card,
  CardContent,
  Tabs,
  Tab,
} from "@mui/material";
import {
  Save,
  Delete,
  Lock,
  WarningAmber,
  Edit,
  Add,
  Check,
  Close,
} from "@mui/icons-material";
import { motion } from "framer-motion";
import { toast, ToastContainer } from "react-toastify";
import useAuthStore from "../store/authStore";
import {
  getUserSettings,
  updateUserName,
  updateUserBio,
  updateVisitedPlaces,
  resetPassword,
  deleteAccount,
} from "../utils/api";
import "react-toastify/dist/ReactToastify.css";

function SettingsTabPanel({ children, value, index }) {
  return value === index ? <Box>{children}</Box> : null;
}

const SettingsPage = () => {
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);

  // Account Settings
  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [visitedPlaces, setVisitedPlaces] = useState([]);
  const [newPlace, setNewPlace] = useState({
    code: "",
    name: "",
    year: new Date().getFullYear(),
  });

  // Password Reset
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Delete Account
  const [deletePassword, setDeletePassword] = useState("");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  // States
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [resettingPassword, setResettingPassword] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [settingsTab, setSettingsTab] = useState(0);
  const [editingPlaceIndex, setEditingPlaceIndex] = useState(null);

  // Load settings on mount
  useEffect(() => {
    if (user && user.id) {
      fetchSettings();
    }
  }, [user]);

  const fetchSettings = async () => {
    setLoading(true);
    try {
      const data = await getUserSettings(user.id);
      setName(data.name || "");
      setBio(data.bio || "");
      setVisitedPlaces(data.visitedPlaces || []);
    } catch (err) {
      toast.error("Failed to load settings");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveAccountSettings = async () => {
    if (!name.trim()) {
      toast.error("Name cannot be empty");
      return;
    }

    setSaving(true);
    try {
      await updateUserName(user.id, name);
      await updateUserBio(user.id, bio);
      await updateVisitedPlaces(user.id, visitedPlaces);
      toast.success("Account settings saved successfully");
    } catch (err) {
      toast.error(err.message || "Failed to save settings");
    } finally {
      setSaving(false);
    }
  };

  const handleAddPlace = () => {
    if (!newPlace.code || !newPlace.name) {
      toast.error("Please fill in country code and name");
      return;
    }
    if (editingPlaceIndex !== null) {
      const updated = [...visitedPlaces];
      updated[editingPlaceIndex] = newPlace;
      setVisitedPlaces(updated);
      setEditingPlaceIndex(null);
      toast.success("Country updated");
    } else {
      setVisitedPlaces([...visitedPlaces, newPlace]);
      toast.success("Country added");
    }
    setNewPlace({ code: "", name: "", year: new Date().getFullYear() });
  };

  const handleEditPlace = (index) => {
    setNewPlace(visitedPlaces[index]);
    setEditingPlaceIndex(index);
  };

  const handleRemovePlace = (index) => {
    setVisitedPlaces(visitedPlaces.filter((_, i) => i !== index));
    if (editingPlaceIndex === index) {
      setEditingPlaceIndex(null);
      setNewPlace({ code: "", name: "", year: new Date().getFullYear() });
    }
  };

  const handleResetPassword = async () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      toast.error("Please fill in all password fields");
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("New passwords do not match");
      return;
    }

    if (newPassword.length < 6) {
      toast.error("New password must be at least 6 characters");
      return;
    }

    setResettingPassword(true);
    try {
      await resetPassword(
        user.id,
        currentPassword,
        newPassword,
        confirmPassword
      );
      toast.success("Password reset successfully");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      toast.error(err.message || "Failed to reset password");
    } finally {
      setResettingPassword(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!deletePassword) {
      toast.error("Please enter your password");
      return;
    }

    setDeleting(true);
    try {
      await deleteAccount(user.id, deletePassword);
      toast.success("Account deleted successfully");
      logout();
      setTimeout(() => navigate("/"), 1500);
    } catch (err) {
      toast.error(err.message || "Failed to delete account");
    } finally {
      setDeleting(false);
      setDeleteDialogOpen(false);
    }
  };

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "80vh",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <>
      <ToastContainer position="top-center" />
      <Box
        sx={{
          minHeight: "100vh",
          py: 6,
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        }}
      >
        <Container maxWidth="md">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {/* Header */}
            <Box sx={{ mb: 4 }}>
              <Typography
                variant="h3"
                sx={{ fontWeight: 800, color: "white", mb: 1 }}
              >
                Settings
              </Typography>
              <Typography
                variant="body1"
                sx={{ color: "rgba(255,255,255,0.8)" }}
              >
                Manage your account, security, and preferences
              </Typography>
            </Box>

            {/* Settings Tabs */}
            <Paper
              elevation={0}
              sx={{ borderRadius: 3, overflow: "hidden", mb: 3 }}
            >
              <Tabs
                value={settingsTab}
                onChange={(e, v) => setSettingsTab(v)}
                sx={{
                  background: "rgba(255,255,255,0.95)",
                  "& .MuiTabs-indicator": {
                    backgroundColor: "#667eea",
                    height: 4,
                  },
                  "& .MuiTab-root": {
                    fontWeight: 600,
                    color: "text.secondary",
                    "&.Mui-selected": {
                      color: "#667eea",
                    },
                  },
                }}
              >
                <Tab
                  label="Account Settings"
                  icon={<Edit />}
                  iconPosition="start"
                />
                <Tab label="Security" icon={<Lock />} iconPosition="start" />
                <Tab
                  label="Danger Zone"
                  icon={<WarningAmber />}
                  iconPosition="start"
                />
              </Tabs>
            </Paper>

            {/* Tab 1: Account Settings */}
            <SettingsTabPanel value={settingsTab} index={0}>
              <Grid container spacing={3}>
                {/* Name Card */}
                <Grid item xs={12}>
                  <Card
                    sx={{
                      borderRadius: 3,
                      boxShadow: "0 8px 24px rgba(0,0,0,0.1)",
                    }}
                  >
                    <CardContent sx={{ p: 3 }}>
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 2,
                          mb: 2,
                        }}
                      >
                        <Edit sx={{ color: "primary.main", fontSize: 28 }} />
                        <Typography variant="h6" sx={{ fontWeight: 800 }}>
                          Profile Name
                        </Typography>
                      </Box>
                      <TextField
                        fullWidth
                        label="Full Name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        variant="outlined"
                        sx={{
                          "& .MuiOutlinedInput-root": {
                            borderRadius: 2,
                          },
                        }}
                      />
                    </CardContent>
                  </Card>
                </Grid>

                {/* Bio Card */}
                <Grid item xs={12}>
                  <Card
                    sx={{
                      borderRadius: 3,
                      boxShadow: "0 8px 24px rgba(0,0,0,0.1)",
                    }}
                  >
                    <CardContent sx={{ p: 3 }}>
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 2,
                          mb: 2,
                        }}
                      >
                        <Typography variant="h6" sx={{ fontWeight: 800 }}>
                          About You
                        </Typography>
                      </Box>
                      <TextField
                        fullWidth
                        label="Bio"
                        value={bio}
                        onChange={(e) => setBio(e.target.value)}
                        placeholder="Tell us about yourself..."
                        multiline
                        rows={4}
                        variant="outlined"
                        sx={{
                          "& .MuiOutlinedInput-root": {
                            borderRadius: 2,
                          },
                        }}
                      />
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        sx={{ mt: 1, display: "block" }}
                      >
                        {bio.length}/500 characters
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>

                {/* Visited Countries Card */}
                <Grid item xs={12}>
                  <Card
                    sx={{
                      borderRadius: 3,
                      boxShadow: "0 8px 24px rgba(0,0,0,0.1)",
                    }}
                  >
                    <CardContent sx={{ p: 3 }}>
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 2,
                          mb: 2,
                        }}
                      >
                        <Typography variant="h6" sx={{ fontWeight: 800 }}>
                          Visited Countries ({visitedPlaces.length})
                        </Typography>
                      </Box>

                      {/* Visited Places List */}
                      {visitedPlaces.length > 0 && (
                        <Box sx={{ mb: 3, display: "grid", gap: 2 }}>
                          {visitedPlaces.map((place, idx) => (
                            <motion.div
                              key={idx}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ duration: 0.3 }}
                            >
                              <Paper
                                sx={{
                                  p: 2,
                                  bgcolor: "background.default",
                                  display: "flex",
                                  justifyContent: "space-between",
                                  alignItems: "center",
                                  borderRadius: 2,
                                  border:
                                    editingPlaceIndex === idx
                                      ? "2px solid"
                                      : "1px solid",
                                  borderColor:
                                    editingPlaceIndex === idx
                                      ? "primary.main"
                                      : "divider",
                                }}
                              >
                                <Box>
                                  <Typography
                                    sx={{ fontSize: "1.5rem", mb: 0.5 }}
                                  >
                                    {place.code} {place.name}
                                  </Typography>
                                  <Typography
                                    variant="caption"
                                    color="text.secondary"
                                  >
                                    Visited in {place.year}
                                  </Typography>
                                </Box>
                                <Box sx={{ display: "flex", gap: 1 }}>
                                  <Button
                                    size="small"
                                    variant="outlined"
                                    startIcon={<Edit />}
                                    onClick={() => handleEditPlace(idx)}
                                  >
                                    Edit
                                  </Button>
                                  <Button
                                    size="small"
                                    variant="outlined"
                                    color="error"
                                    startIcon={<Delete />}
                                    onClick={() => handleRemovePlace(idx)}
                                  >
                                    Remove
                                  </Button>
                                </Box>
                              </Paper>
                            </motion.div>
                          ))}
                        </Box>
                      )}

                      {/* Add/Edit Place Form */}
                      <Divider sx={{ my: 2 }} />
                      <Typography
                        variant="subtitle2"
                        sx={{ fontWeight: 700, mb: 2 }}
                      >
                        {editingPlaceIndex !== null
                          ? "Update Country"
                          : "Add New Country"}
                      </Typography>
                      <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                          <TextField
                            fullWidth
                            label="Country Code"
                            value={newPlace.code}
                            onChange={(e) =>
                              setNewPlace({ ...newPlace, code: e.target.value })
                            }
                            placeholder="🇧🇩"
                            sx={{
                              "& .MuiOutlinedInput-root": {
                                borderRadius: 2,
                              },
                            }}
                          />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <TextField
                            fullWidth
                            label="Country Name"
                            value={newPlace.name}
                            onChange={(e) =>
                              setNewPlace({ ...newPlace, name: e.target.value })
                            }
                            placeholder="Bangladesh"
                            sx={{
                              "& .MuiOutlinedInput-root": {
                                borderRadius: 2,
                              },
                            }}
                          />
                        </Grid>
                        <Grid item xs={12}>
                          <TextField
                            fullWidth
                            label="Year Visited"
                            type="number"
                            value={newPlace.year}
                            onChange={(e) =>
                              setNewPlace({
                                ...newPlace,
                                year: parseInt(e.target.value),
                              })
                            }
                            InputProps={{
                              inputProps: {
                                min: 1900,
                                max: new Date().getFullYear(),
                              },
                            }}
                            sx={{
                              "& .MuiOutlinedInput-root": {
                                borderRadius: 2,
                              },
                            }}
                          />
                        </Grid>
                        <Grid item xs={12}>
                          <Box sx={{ display: "flex", gap: 1 }}>
                            <Button
                              variant="contained"
                              fullWidth
                              startIcon={
                                editingPlaceIndex !== null ? <Check /> : <Add />
                              }
                              onClick={handleAddPlace}
                              sx={{
                                background:
                                  "linear-gradient(45deg, #667eea 30%, #764ba2 90%)",
                                borderRadius: 2,
                              }}
                            >
                              {editingPlaceIndex !== null
                                ? "Update Country"
                                : "Add Country"}
                            </Button>
                            {editingPlaceIndex !== null && (
                              <Button
                                variant="outlined"
                                onClick={() => {
                                  setEditingPlaceIndex(null);
                                  setNewPlace({
                                    code: "",
                                    name: "",
                                    year: new Date().getFullYear(),
                                  });
                                }}
                                startIcon={<Close />}
                                sx={{ borderRadius: 2 }}
                              >
                                Cancel
                              </Button>
                            )}
                          </Box>
                        </Grid>
                      </Grid>
                    </CardContent>
                  </Card>
                </Grid>

                {/* Save Button */}
                <Grid item xs={12}>
                  <Button
                    variant="contained"
                    fullWidth
                    size="large"
                    startIcon={
                      saving ? <CircularProgress size={20} /> : <Save />
                    }
                    onClick={handleSaveAccountSettings}
                    disabled={saving}
                    sx={{
                      background:
                        "linear-gradient(45deg, #667eea 30%, #764ba2 90%)",
                      borderRadius: 2,
                      py: 1.5,
                      fontWeight: 700,
                    }}
                  >
                    {saving ? "Saving..." : "Save All Changes"}
                  </Button>
                </Grid>
              </Grid>
            </SettingsTabPanel>

            {/* Tab 2: Security */}
            <SettingsTabPanel value={settingsTab} index={1}>
              <Card
                sx={{
                  borderRadius: 3,
                  boxShadow: "0 8px 24px rgba(0,0,0,0.1)",
                }}
              >
                <CardContent sx={{ p: 4 }}>
                  <Alert severity="info" sx={{ mb: 3, borderRadius: 2 }}>
                    Keep your account secure by regularly updating your
                    password.
                  </Alert>

                  <Grid container spacing={3}>
                    <Grid item xs={12}>
                      <Typography
                        variant="subtitle1"
                        sx={{ fontWeight: 700, mb: 1 }}
                      >
                        Current Password
                      </Typography>
                      <TextField
                        fullWidth
                        type="password"
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        variant="outlined"
                        sx={{
                          "& .MuiOutlinedInput-root": {
                            borderRadius: 2,
                          },
                        }}
                      />
                    </Grid>

                    <Grid item xs={12}>
                      <Typography
                        variant="subtitle1"
                        sx={{ fontWeight: 700, mb: 1 }}
                      >
                        New Password
                      </Typography>
                      <TextField
                        fullWidth
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        variant="outlined"
                        sx={{
                          "& .MuiOutlinedInput-root": {
                            borderRadius: 2,
                          },
                        }}
                      />
                    </Grid>

                    <Grid item xs={12}>
                      <Typography
                        variant="subtitle1"
                        sx={{ fontWeight: 700, mb: 1 }}
                      >
                        Confirm Password
                      </Typography>
                      <TextField
                        fullWidth
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        variant="outlined"
                        sx={{
                          "& .MuiOutlinedInput-root": {
                            borderRadius: 2,
                          },
                        }}
                      />
                    </Grid>

                    <Grid item xs={12}>
                      <Button
                        variant="contained"
                        fullWidth
                        size="large"
                        startIcon={
                          resettingPassword ? (
                            <CircularProgress size={20} />
                          ) : (
                            <Lock />
                          )
                        }
                        onClick={handleResetPassword}
                        disabled={resettingPassword}
                        sx={{
                          background:
                            "linear-gradient(45deg, #667eea 30%, #764ba2 90%)",
                          borderRadius: 2,
                          py: 1.5,
                          fontWeight: 700,
                        }}
                      >
                        {resettingPassword ? "Resetting..." : "Reset Password"}
                      </Button>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </SettingsTabPanel>

            {/* Tab 3: Danger Zone */}
            <SettingsTabPanel value={settingsTab} index={2}>
              <Card
                sx={{
                  borderRadius: 3,
                  border: "2px solid",
                  borderColor: "error.main",
                  background: "rgba(244, 67, 54, 0.02)",
                  boxShadow: "0 8px 24px rgba(244, 67, 54, 0.15)",
                }}
              >
                <CardContent sx={{ p: 4 }}>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 2,
                      mb: 2,
                    }}
                  >
                    <WarningAmber sx={{ fontSize: 32, color: "error.main" }} />
                    <Typography
                      variant="h6"
                      sx={{ fontWeight: 800, color: "error.main" }}
                    >
                      Danger Zone
                    </Typography>
                  </Box>

                  <Divider sx={{ my: 2 }} />

                  <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
                    These actions are permanent and cannot be undone.
                  </Alert>

                  <Typography sx={{ mb: 3, color: "text.secondary" }}>
                    Permanently delete your account and all associated data
                    including bookmarks, search history, and preferences.
                  </Typography>

                  <Button
                    variant="outlined"
                    color="error"
                    fullWidth
                    size="large"
                    startIcon={<Delete />}
                    onClick={() => setDeleteDialogOpen(true)}
                    sx={{
                      borderRadius: 2,
                      py: 1.5,
                      fontWeight: 700,
                      border: "2px solid",
                    }}
                  >
                    Delete My Account
                  </Button>
                </CardContent>
              </Card>
            </SettingsTabPanel>
          </motion.div>
        </Container>
      </Box>

      {/* Delete Account Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => !deleting && setDeleteDialogOpen(false)}
        PaperProps={{
          sx: {
            borderRadius: 3,
            background: "linear-gradient(135deg, #ff6b6b 0%, #ee5a6f 100%)",
          },
        }}
      >
        <DialogTitle
          sx={{ fontWeight: 800, color: "white", fontSize: "1.3rem" }}
        >
          ⚠️ Delete Account?
        </DialogTitle>
        <DialogContent sx={{ color: "white", py: 3 }}>
          <Typography sx={{ mb: 2, fontWeight: 600 }}>
            This action cannot be undone. All your data will be permanently
            deleted.
          </Typography>
          <Typography variant="body2" sx={{ mb: 2 }}>
            Please enter your password to confirm:
          </Typography>
          <TextField
            fullWidth
            label="Password"
            type="password"
            value={deletePassword}
            onChange={(e) => setDeletePassword(e.target.value)}
            variant="outlined"
            sx={{
              mt: 2,
              "& .MuiOutlinedInput-root": {
                color: "white",
                borderRadius: 2,
              },
              "& .MuiInputBase-input::placeholder": {
                color: "rgba(255,255,255,0.7)",
                opacity: 1,
              },
              "& .MuiOutlinedInput-notchedOutline": {
                borderColor: "rgba(255,255,255,0.3)",
              },
            }}
          />
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button
            onClick={() => setDeleteDialogOpen(false)}
            disabled={deleting}
            sx={{ color: "white", fontWeight: 700 }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleDeleteAccount}
            disabled={deleting}
            variant="contained"
            color="error"
            startIcon={deleting && <CircularProgress size={20} />}
            sx={{ fontWeight: 700 }}
          >
            {deleting ? "Deleting..." : "Delete Permanently"}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default SettingsPage;
