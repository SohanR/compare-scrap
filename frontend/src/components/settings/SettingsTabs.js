import React, { useState } from "react";
import {
  Box,
  Container,
  Paper,
  Tabs,
  Tab,
  CircularProgress,
} from "@mui/material";
import { Edit, Lock, WarningAmber } from "@mui/icons-material";
import SettingsAccountTab from "./tabs/SettingsAccountTab";
import SettingsSecurityTab from "./tabs/SettingsSecurityTab";
import SettingsDangerTab from "./tabs/SettingsDangerTab";

function TabPanel({ children, value, index }) {
  return value === index ? <Box>{children}</Box> : null;
}

const SettingsTabs = ({
  tab,
  onTabChange,
  loading,
  name,
  setName,
  bio,
  setBio,
  visitedPlaces,
  setVisitedPlaces,
}) => {
  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "60vh",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="md">
      {/* Settings Tabs */}
      <Paper elevation={0} sx={{ borderRadius: 3, overflow: "hidden", mb: 3 }}>
        <Tabs
          value={tab}
          onChange={(e, v) => onTabChange(v)}
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
          <Tab label="Account Settings" icon={<Edit />} iconPosition="start" />
          <Tab label="Security" icon={<Lock />} iconPosition="start" />
          <Tab
            label="Danger Zone"
            icon={<WarningAmber />}
            iconPosition="start"
          />
        </Tabs>
      </Paper>

      {/* Tab 1: Account Settings */}
      <TabPanel value={tab} index={0}>
        <SettingsAccountTab
          name={name}
          setName={setName}
          bio={bio}
          setBio={setBio}
          visitedPlaces={visitedPlaces}
          setVisitedPlaces={setVisitedPlaces}
        />
      </TabPanel>

      {/* Tab 2: Security */}
      <TabPanel value={tab} index={1}>
        <SettingsSecurityTab />
      </TabPanel>

      {/* Tab 3: Danger Zone */}
      <TabPanel value={tab} index={2}>
        <SettingsDangerTab />
      </TabPanel>
    </Container>
  );
};

export default SettingsTabs;
