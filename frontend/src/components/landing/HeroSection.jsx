import React from "react";
import {
  Box,
  Button,
  Card,
  Chip,
  Container,
  Divider,
  Grid,
  Stack,
  Typography,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import {
  FaCompass,
  FaGlobeAmericas,
  FaMapPin,
  FaPlane,
  FaSuitcaseRolling,
} from "react-icons/fa";

const HeroSection = ({
  coverImage,
  smallImage,
  explorerVibes,
  stats,
  onPrimaryClick,
  onSecondaryClick,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <Box
      sx={{
        position: "relative",
        overflow: "hidden",
        background:
          "linear-gradient(135deg, #0d1242 0%, #0f6e7c 50%, #14b3c6 100%)",
        color: "white",
        py: { xs: 8, md: 12 },
      }}
    >
      <Box
        sx={{
          position: "absolute",
          inset: 0,
          backgroundImage: `url(${coverImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          opacity: 0.14,
          filter: "saturate(1.1) contrast(1.1)",
        }}
      />
      <Box
        sx={{
          position: "absolute",
          top: -120,
          right: -80,
          width: 320,
          height: 320,
          background:
            "radial-gradient(circle, rgba(255,255,255,0.35), transparent 60%)",
          filter: "blur(6px)",
        }}
      />
      <Container maxWidth="lg" sx={{ position: "relative", zIndex: 2 }}>
        <Grid container spacing={6} alignItems="center">
          <Grid item xs={12} md={7} data-aos="fade-right">
            <Stack spacing={3}>
              <Chip
                label="Travel smarter, not harder"
                sx={{
                  alignSelf: "flex-start",
                  backgroundColor: "rgba(255,255,255,0.12)",
                  color: "white",
                  borderRadius: "12px",
                  px: 1.5,
                  fontWeight: 700,
                  letterSpacing: 0.4,
                }}
              />
              <Typography
                variant={isMobile ? "h3" : "h2"}
                component="h1"
                fontWeight="bold"
                lineHeight={1.05}
              >
                Design the trip you want, with live comparisons in one place.
              </Typography>
              <Typography variant="h6" sx={{ maxWidth: 640, opacity: 0.92 }}>
                Flights, stays, and experiences brought together with clear
                options, real-time prices, and tools made for people who
                actually travel.
              </Typography>
              <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                <Button
                  variant="contained"
                  size="large"
                  onClick={onPrimaryClick}
                  sx={{
                    py: 1.6,
                    px: 4,
                    borderRadius: "16px",
                    fontWeight: "bold",
                    fontSize: "1rem",
                    background:
                      "linear-gradient(120deg, #ffcc70 0%, #ff885b 50%, #ff5c8d 100%)",
                    boxShadow: "0 18px 40px rgba(255, 136, 91, 0.35)",
                    "&:hover": {
                      background:
                        "linear-gradient(120deg, #ffd27f 0%, #ff9770 50%, #ff6da0 100%)",
                    },
                  }}
                >
                  Start comparing
                </Button>
                <Button
                  variant="outlined"
                  size="large"
                  onClick={onSecondaryClick}
                  sx={{
                    py: 1.5,
                    px: 3.5,
                    borderRadius: "16px",
                    color: "white",
                    borderColor: "rgba(255,255,255,0.4)",
                    "&:hover": {
                      borderColor: "white",
                      backgroundColor: "rgba(255,255,255,0.08)",
                    },
                  }}
                >
                  Explore trips
                </Button>
              </Stack>

              <Stack direction="row" spacing={1} flexWrap="wrap" mt={1}>
                {explorerVibes.map((vibe) => (
                  <Chip
                    key={vibe}
                    label={vibe}
                    icon={<FaCompass />}
                    sx={{
                      backgroundColor: "rgba(255,255,255,0.12)",
                      color: "white",
                      borderRadius: "28px",
                      mb: 1,
                    }}
                  />
                ))}
              </Stack>

              <Grid container spacing={2} mt={1}>
                {stats.map((stat) => (
                  <Grid item xs={12} sm={4} key={stat.label}>
                    <Box
                      sx={{
                        p: 2.5,
                        borderRadius: "14px",
                        backgroundColor: "rgba(255,255,255,0.08)",
                        border: "1px solid rgba(255,255,255,0.12)",
                      }}
                    >
                      <Typography variant="h5" fontWeight="bold">
                        {stat.value}
                      </Typography>
                      <Typography variant="body2" sx={{ opacity: 0.82 }}>
                        {stat.label}
                      </Typography>
                    </Box>
                  </Grid>
                ))}
              </Grid>
            </Stack>
          </Grid>
          <Grid item xs={12} md={5} data-aos="fade-left">
            <Card
              sx={{
                borderRadius: "20px",
                overflow: "hidden",
                background:
                  "linear-gradient(140deg, rgba(255,255,255,0.95), rgba(240,248,255,0.92))",
                boxShadow: "0 35px 80px rgba(10, 46, 78, 0.35)",
                position: "relative",
                p: 3,
              }}
            >
              <Box
                sx={{
                  height: 220,
                  borderRadius: "14px",
                  backgroundImage: `url(${smallImage})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  position: "relative",
                  overflow: "hidden",
                }}
              >
                <Box
                  sx={{
                    position: "absolute",
                    inset: 0,
                    background:
                      "linear-gradient(180deg, rgba(0,0,0,0.1), rgba(0,0,0,0.45))",
                  }}
                />
                <Typography
                  variant="subtitle2"
                  sx={{
                    position: "absolute",
                    top: 16,
                    left: 16,
                    px: 1.5,
                    py: 0.5,
                    borderRadius: "10px",
                    backgroundColor: "rgba(255,255,255,0.85)",
                    color: "primary.main",
                    fontWeight: 700,
                  }}
                >
                  Live price pulse
                </Typography>
                <Box
                  sx={{
                    position: "absolute",
                    bottom: 16,
                    left: 16,
                    right: 16,
                    color: "white",
                  }}
                >
                  <Typography variant="h6" fontWeight="bold">
                    Barcelona this month
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.9 }}>
                    Trending 12% lower vs. seasonal average
                  </Typography>
                </Box>
              </Box>
              <Box sx={{ mt: 3 }}>
                <Stack
                  direction="row"
                  alignItems="center"
                  spacing={1}
                  sx={{ mb: 1 }}
                >
                  <FaSuitcaseRolling color={theme.palette.primary.main} />
                  <Typography variant="subtitle1" fontWeight="bold">
                    Build your mix
                  </Typography>
                </Stack>
                <Typography variant="body2" color="text.secondary">
                  Flights, stays, transfers, and experiences stack together so
                  you can book the exact combo you want without extra tabs.
                </Typography>
                <Divider sx={{ my: 2 }} />
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <Stack spacing={1.2}>
                      <Stack direction="row" spacing={1} alignItems="center">
                        <FaPlane color={theme.palette.primary.main} />
                        <Typography variant="body2" fontWeight={700}>
                          Fare alerts
                        </Typography>
                      </Stack>
                      <Stack direction="row" spacing={1} alignItems="center">
                        <FaMapPin color={theme.palette.primary.main} />
                        <Typography variant="body2" fontWeight={700}>
                          Smart routes
                        </Typography>
                      </Stack>
                    </Stack>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Stack spacing={1.2}>
                      <Stack direction="row" spacing={1} alignItems="center">
                        <FaGlobeAmericas color={theme.palette.primary.main} />
                        <Typography variant="body2" fontWeight={700}>
                          Stays with perks
                        </Typography>
                      </Stack>
                      <Stack direction="row" spacing={1} alignItems="center">
                        <FaCompass color={theme.palette.primary.main} />
                        <Typography variant="body2" fontWeight={700}>
                          Local picks
                        </Typography>
                      </Stack>
                    </Stack>
                  </Grid>
                </Grid>
              </Box>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default HeroSection;
