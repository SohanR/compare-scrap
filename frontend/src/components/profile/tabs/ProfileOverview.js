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
} from "@mui/material";
import { formatDistanceToNow } from "date-fns";
import useAuthStore from "../../../store/authStore";

const ProfileOverview = ({ bookmarks, history, onRemoveBookmark }) => {
  const user = useAuthStore((s) => s.user);

  const getBookmarkMeta = (b) => {
    const title =
      b?.item?.name ||
      b?.item?.flightName ||
      b?.item?.provider ||
      b?.item?.title ||
      "Saved item";
    const subtitle = b?.category || "bookmark";
    const link = b?.item?.bookingLink || b?.item?.link;
    const image =
      b?.item?.imageUrl ||
      b?.item?.airlineLogos?.[0] ||
      b?.image ||
      null;
    return { title, subtitle, link, image };
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
              bookmarks.slice(0, 3).map((b) => {
                const meta = getBookmarkMeta(b);
                return (
                  <Card key={b._id || meta.title} sx={{ display: "flex", mt: 1 }}>
                    {meta.image && (
                    <CardMedia
                      component="img"
                      sx={{ width: 96 }}
                      image={meta.image}
                      alt={meta.title}
                    />
                  )}
                  <CardContent sx={{ flex: 1 }}>
                    <Typography variant="subtitle2" fontWeight={700}>
                      {meta.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {meta.subtitle}
                    </Typography>
                    <Box sx={{ display: "flex", gap: 1, mt: 1 }}>
                      {meta.link && (
                        <Button size="small" href={meta.link} target="_blank">
                          View
                        </Button>
                      )}
                      {onRemoveBookmark && (
                        <Button
                          size="small"
                          color="secondary"
                          onClick={() => onRemoveBookmark(b._id)}
                        >
                          Remove
                        </Button>
                      )}
                    </Box>
                  </CardContent>
                </Card>
                );
              })
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
