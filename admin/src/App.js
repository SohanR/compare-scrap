/* eslint-disable react/no-unstable-nested-components */
import { useContext } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { ColorContext } from "./ColorContext/darkContext";
import Home from "./Components/Home/Home";
import DataTable from "./Components/DataTable/DataTable";
import Sidebar from "./Components/Sidebar/Sidebar";
import Navbar from "./Components/Navbar/Navbar";
import Login from "./Pages/Login/Login";
import Users from "./Pages/UserLists/Users";
import Bookmarks from "./Pages/Bookmarks/Bookmarks";
import SearchHistory from "./Pages/SearchHistory/SearchHistory";
import Destinations from "./Pages/Destinations/Destinations";
import useAdminAuthStore from "./store/adminAuthStore";
import "./app.scss";

function App() {
  // color state management using react context
  const { darkMode } = useContext(ColorContext);

  // create protected route
  /**
   * The ProtectedRoute function checks if a user is logged in and redirects to the login page if not,
   * otherwise it renders the children components.
   * @returns The children component is being returned.
   */
  function ProtectedRoute({ children }) {
    const isLoggedIn = useAdminAuthStore((s) => s.isLoggedIn);
    if (!isLoggedIn) {
      return <Navigate to="/login" />;
    }

    return children;
  }

  const Shell = ({ children }) => (
    <div className="home">
      <Sidebar />
      <div className="home_main">
        <Navbar />
        <div className="bg_color" />
        {children}
      </div>
    </div>
  );

  return (
    <div className={darkMode ? "App dark" : "App"}>
      <BrowserRouter>
        <Routes>
          <Route path="/">
            <Route path="login" element={<Login />} />
            <Route
              index
              element={
                <ProtectedRoute>
                  <Home />
                </ProtectedRoute>
              }
            />
            <Route
              path="users"
              element={
                <ProtectedRoute>
                  <Shell>
                    <Users />
                  </Shell>
                </ProtectedRoute>
              }
            />
            <Route
              path="bookmarks"
              element={
                <ProtectedRoute>
                  <Shell>
                    <Bookmarks />
                  </Shell>
                </ProtectedRoute>
              }
            />
            <Route
              path="click-tracker"
              element={
                <ProtectedRoute>
                  <Shell>
                    <DataTable />
                  </Shell>
                </ProtectedRoute>
              }
            />
            <Route
              path="search-history"
              element={
                <ProtectedRoute>
                  <Shell>
                    <SearchHistory />
                  </Shell>
                </ProtectedRoute>
              }
            />
            <Route
              path="top-destination"
              element={
                <ProtectedRoute>
                  <Shell>
                    <Destinations />
                  </Shell>
                </ProtectedRoute>
              }
            />
          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
