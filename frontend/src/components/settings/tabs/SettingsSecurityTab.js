import React, { useState } from "react";
import {
  Card,
  CardContent,
  Grid,
  Button,
  Alert,
  CircularProgress,
  TextField,
} from "@mui/material";
import { Lock } from "@mui/icons-material";
import { toast } from "react-toastify";
import useAuthStore from "../../../store/authStore";
import { resetPassword } from "../../../utils/api";

const SettingsSecurityTab = () => {
  const user = useAuthStore((s) => s.user);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [resettingPassword, setResettingPassword] = useState(false);

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

  return (
    <Card
      sx={{
        borderRadius: 3,
        boxShadow: "0 8px 24px rgba(0,0,0,0.1)",
      }}
    >
      <CardContent sx={{ p: 4 }}>
        <Alert severity="info" sx={{ mb: 3, borderRadius: 2 }}>
          Keep your account secure by regularly updating your password.
        </Alert>

        <Grid container spacing={3}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Current Password"
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
            <TextField
              fullWidth
              label="New Password"
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
            <TextField
              fullWidth
              label="Confirm Password"
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
                resettingPassword ? <CircularProgress size={20} /> : <Lock />
              }
              onClick={handleResetPassword}
              disabled={resettingPassword}
              sx={{
                background: "linear-gradient(45deg, #667eea 30%, #764ba2 90%)",
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
  );
};

export default SettingsSecurityTab;
