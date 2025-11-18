import React from "react";
import {
  Typography,
  Grid,
  Paper,
  Box,
  Button,
  Card,
  CardMedia,
  CardContent,
  IconButton,
} from "@mui/material";
import { Delete } from "@mui/icons-material";
import { formatDistanceToNow } from "date-fns";
import { toast } from "react-toastify";
import useAuthStore from "../../../store/authStore";

const ProfileOverview = ({ bookmarks, history }) => {
  const user = useAuthStore((s) => s.user);

  const handleRemoveBookmark = (id) => {
    const updated = bookmarks.filter((b) => b.id !== id);
    localStorage.setItem("bookmarks", JSON.stringify(updated));
    toast.success("Bookmark removed");
  };

  return (
    <>
      <Typography variant="h5" sx={{ fontWeight: 800, mb: 1 }}>
        Hello, {user?.name || "Traveler"} 👋
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
        Welcome to your TravelGo dashboard — your hub for saved deals, search
        history, and quick actions to plan your next trip.
      </Typography>

      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2, borderRadius: 2 }}>
            <Typography variant="subtitle2" color="text.secondary">
              Recent Bookmarks
            </Typography>
            {bookmarks.length === 0 ? (
              <Typography variant="body2" sx={{ mt: 1 }}>
                You don't have any bookmarks yet. Tap the bookmark icon on any
                result to save it.
              </Typography>
            ) : (
              bookmarks.slice(0, 3).map((b) => (
                <Card key={b.id} sx={{ display: "flex", mt: 1 }}>
                  {b.image && (
                    <CardMedia
                      component="img"
                      sx={{ width: 96 }}
                      image={b.image}
                      alt={b.name}
                    />
                  )}
                  <CardContent sx={{ flex: 1 }}>
                    <Typography variant="subtitle2" fontWeight={700}>
                      {b.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {b.type || "item"}
                    </Typography>
                    <Box sx={{ display: "flex", gap: 1, mt: 1 }}>
                      <Button size="small" href={b.link} target="_blank">
                        View
                      </Button>
                      <IconButton
                        size="small"
                        onClick={() => handleRemoveBookmark(b.id)}
                      >
                        <Delete fontSize="small" />
                      </IconButton>
                    </Box>
                  </CardContent>
                </Card>
              ))
            )}
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2, borderRadius: 2 }}>
            <Typography variant="subtitle2" color="text.secondary">
              Recent Searches
            </Typography>
            {history.length === 0 ? (
              <Typography variant="body2" sx={{ mt: 1 }}>
                No recent searches. Try searching for flights and hotels to see
                history here.
              </Typography>
            ) : (
              history.slice(0, 5).map((h, i) => (
                <Box
                  key={i}
                  sx={{
                    mt: 1.5,
                    p: 1.5,
                    bgcolor: "background.default",
                    borderRadius: 1,
                    border: "1px solid",
                    borderColor: "divider",
                  }}
                >
                  <Typography variant="body2" fontWeight={700}>
                    {h.from?.city} → {h.to?.city}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {h.date} •{" "}
                    {formatDistanceToNow(new Date(h.createdAt), {
                      addSuffix: true,
                    })}
                  </Typography>
                </Box>
              ))
            )}
          </Paper>
        </Grid>
      </Grid>
    </>
  );
};

export default ProfileOverview;
