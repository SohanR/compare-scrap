import React, { useState } from "react";
import {
  Card,
  CardContent,
  Box,
  Typography,
  Divider,
  Alert,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  CircularProgress,
} from "@mui/material";
import { Delete, WarningAmber } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import useAuthStore from "../../../store/authStore";
import { deleteAccount } from "../../../utils/api";

const SettingsDangerTab = () => {
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deletePassword, setDeletePassword] = useState("");
  const [deleting, setDeleting] = useState(false);

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

  return (
    <>
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
            Permanently delete your account and all associated data including
            bookmarks, search history, and preferences.
          </Typography>

          <Button
            variant="contained"
            color="error"
            fullWidth
            size="large"
            startIcon={<Delete />}
            onClick={() => setDeleteDialogOpen(true)}
            sx={{
              borderRadius: 2,
              py: 1.5,
              fontWeight: 700,
            }}
          >
            Delete My Account
          </Button>
        </CardContent>
      </Card>

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

export default SettingsDangerTab;
