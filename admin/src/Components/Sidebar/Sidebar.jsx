/* eslint-disable jsx-a11y/no-static-element-interactions */
import DashboardIcon from "@mui/icons-material/Dashboard";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import TimelineIcon from "@mui/icons-material/Timeline";
import SearchIcon from "@mui/icons-material/Search";
import TravelExploreIcon from "@mui/icons-material/TravelExplore";
import LogoutIcon from "@mui/icons-material/Logout";
import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { ColorContext } from "../../ColorContext/darkContext";
import useAdminAuthStore from "../../store/adminAuthStore";
import "./Sidebar.scss";

function Sidebar() {
  // color state management using react context
  const { darkMode, dispatch } = useContext(ColorContext);
  const logout = useAdminAuthStore((s) => s.logout);

  return (
    <div className="sidebar">
      <div className="logo">
        <Link to="/" style={{ textDecoration: "none" }}>
          <h3 className="text_none">TravelGo Admin</h3>
        </Link>
      </div>

      <div className="links">
        <ul>
          {/* <p className="spann">Main</p> */}
          <Link to="/" style={{ textDecoration: "none" }}>
            <li>
              <DashboardIcon className="icon" /> Dashboard
            </li>
          </Link>

          <Link to="/Users" style={{ textDecoration: "none" }}>
            <li>
              <PeopleAltIcon className="icon" /> Users
            </li>
          </Link>

          <Link to="/bookmarks" style={{ textDecoration: "none" }}>
            <li>
              <BookmarkIcon className="icon" /> Book marks
            </li>
          </Link>

          <Link to="/click-tracker" style={{ textDecoration: "none" }}>
            <li>
              <TimelineIcon className="icon" /> Click Tracker
            </li>
          </Link>
          <Link to="/search-history" style={{ textDecoration: "none" }}>
            <li>
              <SearchIcon className="icon" /> Search History
            </li>
          </Link>
          <Link to="/top-destination" style={{ textDecoration: "none" }}>
            <li>
              <TravelExploreIcon className="icon" /> Top Destination
            </li>
          </Link>

          {/* <p className="span">Settings</p>

          <li>
            <LogoutIcon className="icon" /> Log Out
          </li> */}
        </ul>
      </div>
    </div>
  );
}

export default Sidebar;
