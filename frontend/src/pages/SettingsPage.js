import React, { useEffect, useState } from "react";
import { Box } from "@mui/material";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import SettingsHeader from "../components/settings/SettingsHeader";
import SettingsTabs from "../components/settings/SettingsTabs";
import useAuthStore from "../store/authStore";
import { getUserSettings } from "../utils/api";
import { toast } from "react-toastify";

const SettingsPage = () => {
  const user = useAuthStore((s) => s.user);
  const [loading, setLoading] = useState(true);
  const [settingsTab, setSettingsTab] = useState(0);

  // Account Settings
  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [visitedPlaces, setVisitedPlaces] = useState([]);

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
        <SettingsHeader />
        <SettingsTabs
          tab={settingsTab}
          onTabChange={setSettingsTab}
          loading={loading}
          name={name}
          setName={setName}
          bio={bio}
          setBio={setBio}
          visitedPlaces={visitedPlaces}
          setVisitedPlaces={setVisitedPlaces}
        />
      </Box>
    </>
  );
};

export default SettingsPage;
