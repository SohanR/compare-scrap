import React, { useState } from "react";
import { Grid, Button, CircularProgress } from "@mui/material";
import { Save } from "@mui/icons-material";
import { toast } from "react-toastify";
import useAuthStore from "../../../store/authStore";
import {
  updateUserName,
  updateUserBio,
  updateVisitedPlaces,
} from "../../../utils/api";
import SettingsNameCard from "../cards/SettingsNameCard";
import SettingsBioCard from "../cards/SettingsBioCard";
import SettingsVisitedCountriesCard from "../cards/SettingsVisitedCountriesCard";

const SettingsAccountTab = ({
  name,
  setName,
  bio,
  setBio,
  visitedPlaces,
  setVisitedPlaces,
}) => {
  const user = useAuthStore((s) => s.user);
  const [saving, setSaving] = useState(false);

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

  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <SettingsNameCard name={name} setName={setName} />
      </Grid>

      <Grid item xs={12}>
        <SettingsBioCard bio={bio} setBio={setBio} />
      </Grid>

      <Grid item xs={12}>
        <SettingsVisitedCountriesCard
          visitedPlaces={visitedPlaces}
          setVisitedPlaces={setVisitedPlaces}
        />
      </Grid>

      <Grid item xs={12}>
        <Button
          variant="contained"
          fullWidth
          size="large"
          startIcon={saving ? <CircularProgress size={20} /> : <Save />}
          onClick={handleSaveAccountSettings}
          disabled={saving}
          sx={{
            background: "linear-gradient(45deg, #667eea 30%, #764ba2 90%)",
            borderRadius: 2,
            py: 1.5,
            fontWeight: 700,
          }}
        >
          {saving ? "Saving..." : "Save All Changes"}
        </Button>
      </Grid>
    </Grid>
  );
};

export default SettingsAccountTab;
