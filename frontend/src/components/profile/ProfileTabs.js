import React from "react";
import { Tabs, Tab, Box } from "@mui/material";
import ProfileOverview from "./tabs/ProfileOverview";
import ProfileBookmarks from "./tabs/ProfileBookmarks";
import ProfileSearchHistory from "./tabs/ProfileSearchHistory";

function TabPanel({ children, value, index }) {
  return value === index ? <Box sx={{ mt: 2 }}>{children}</Box> : null;
}

const ProfileTabs = ({
  tab,
  onTabChange,
  bookmarks,
  setBookmarks,
  history,
  setHistory,
  loading,
  setLoading,
}) => {
  return (
    <>
      <Tabs
        value={tab}
        onChange={(e, v) => onTabChange(v)}
        aria-label="profile tabs"
      >
        <Tab label="Overview" />
        <Tab label={`Bookmarks (${bookmarks.length})`} />
        <Tab label={`Search History (${history.length})`} />
      </Tabs>

      <TabPanel value={tab} index={0}>
        <ProfileOverview bookmarks={bookmarks} history={history} />
      </TabPanel>

      <TabPanel value={tab} index={1}>
        <ProfileBookmarks bookmarks={bookmarks} setBookmarks={setBookmarks} />
      </TabPanel>

      <TabPanel value={tab} index={2}>
        <ProfileSearchHistory
          history={history}
          setHistory={setHistory}
          loading={loading}
          setLoading={setLoading}
        />
      </TabPanel>
    </>
  );
};

export default ProfileTabs;
