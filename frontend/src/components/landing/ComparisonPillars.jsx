import React from "react";
import { Box, Card, Grid, Stack, Typography, useTheme } from "@mui/material";
import { FaSearch, FaSmile, FaWallet } from "react-icons/fa";

const ComparisonPillars = ({ pillars }) => {
  const theme = useTheme();

  return (
    <Box
      sx={{
        mb: { xs: 8, md: 12 },
        p: { xs: 3, md: 4 },
        borderRadius: "20px",
        background: "linear-gradient(150deg, #f5fbff, #ffffff)",
        border: "1px solid #eef4f8",
        boxShadow: "0 20px 60px rgba(15,76,117,0.08)",
      }}
    >
      <Grid container spacing={3} alignItems="center">
        <Grid item xs={12} md={4}>
          <Typography variant="h4" component="h2" fontWeight="bold" gutterBottom data-aos="fade-up">
            Built for travelers who compare everything.
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            Skip the endless tabs. We line up flights, hotels, and experiences with the details that matter before you book.
          </Typography>
          <Stack spacing={1}>
            <Stack direction="row" spacing={1} alignItems="center">
              <FaSearch color={theme.palette.primary.main} />
              <Typography variant="body2" fontWeight={600}>
                Honest filters for stops, bags, and flexibility
              </Typography>
            </Stack>
            <Stack direction="row" spacing={1} alignItems="center">
              <FaWallet color={theme.palette.primary.main} />
              <Typography variant="body2" fontWeight={600}>
                Price insights that explain why a fare is worth it
              </Typography>
            </Stack>
            <Stack direction="row" spacing={1} alignItems="center">
              <FaSmile color={theme.palette.primary.main} />
              <Typography variant="body2" fontWeight={600}>
                Travel picks shared by people who have been there
              </Typography>
            </Stack>
          </Stack>
        </Grid>
        <Grid item xs={12} md={8}>
          <Grid container spacing={3}>
            {pillars.map((pillar, index) => {
              const Icon = pillar.icon;
              return (
                <Grid item xs={12} sm={6} md={4} key={pillar.title}>
                  <Card
                    data-aos="fade-up"
                    data-aos-delay={100 * (index + 1)}
                    sx={{
                      height: "100%",
                      borderRadius: "16px",
                      p: 2.5,
                      boxShadow: "0 18px 50px rgba(15,76,117,0.1)",
                      border: "1px solid #e7f1f7",
                    }}
                  >
                    <Box
                      sx={{
                        width: 50,
                        height: 50,
                        display: "grid",
                        placeItems: "center",
                        borderRadius: "14px",
                        backgroundColor: "rgba(33,150,243,0.14)",
                        color: "primary.main",
                        mb: 2,
                      }}
                    >
                      <Icon />
                    </Box>
                    <Typography variant="h6" fontWeight="bold" gutterBottom>
                      {pillar.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {pillar.description}
                    </Typography>
                  </Card>
                </Grid>
              );
            })}
          </Grid>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ComparisonPillars;
