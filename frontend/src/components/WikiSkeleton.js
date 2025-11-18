import React from "react";
import { Card, CardContent, Skeleton, Box } from "@mui/material";

const WikiSkeleton = () => {
  return (
    <Card
      sx={{
        borderRadius: "16px",
        overflow: "hidden",
        boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
      }}
    >
      <Skeleton variant="rectangular" height={300} sx={{ borderRadius: 0 }} />
      <CardContent sx={{ p: { xs: 2, md: 3 } }}>
        <Skeleton variant="text" height={40} sx={{ mb: 2 }} />
        <Skeleton
          variant="rectangular"
          height={60}
          sx={{ mb: 2, borderRadius: 2 }}
        />
        <Skeleton variant="text" height={20} sx={{ mb: 1 }} />
        <Skeleton variant="text" height={20} sx={{ mb: 1 }} />
        <Skeleton variant="text" height={20} sx={{ mb: 3 }} />
        <Skeleton variant="rectangular" height={50} sx={{ borderRadius: 2 }} />
      </CardContent>
    </Card>
  );
};

export default WikiSkeleton;
