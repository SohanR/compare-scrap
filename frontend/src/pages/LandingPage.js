import React, { useEffect } from "react";
import {
  Box,
  Button,
  Container,
  Grid,
  Chip,
  Divider,
  Stack,
  Typography,
  Card,
  CardContent,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import {
  FaPlane,
  FaHotel,
  FaChartLine,
  FaCheckCircle,
  FaSearch,
  FaWallet,
  FaSmile,
  FaGlobeAmericas,
  FaCompass,
  FaMapPin,
  FaSuitcaseRolling,
} from "react-icons/fa"; // FaChartLine was missing
import { useNavigate } from "react-router-dom"; // Import useNavigate
import AOS from "aos";
import "aos/dist/aos.css";
import CoverImage from "../asset/cover.png";
import FeaturedDestinations from "../components/FeaturedDestinations";

const StepCard = ({ icon: Icon, title, description, delay }) => (
  <Box
    data-aos="fade-up"
    data-aos-delay={delay}
    sx={{
      textAlign: "left",
      p: 3,
      borderRadius: "18px",
      background:
        "linear-gradient(135deg, rgba(255,255,255,0.94), rgba(245,250,255,0.94))",
      border: "1px solid rgba(255,255,255,0.6)",
      boxShadow: "0 24px 60px rgba(17, 40, 70, 0.1)",
      height: "100%",
    }}
  >
    <Box
      sx={{
        color: "primary.main",
        fontSize: 40,
        mb: 1.5,
        display: "inline-block",
      }}
    >
      <Icon />
    </Box>
    <Typography variant="h6" fontWeight="bold" gutterBottom>
      {title}
    </Typography>
    <Typography variant="body2" color="text.secondary">
      {description}
    </Typography>
  </Box>
);

const BenefitCard = ({ icon: Icon, title, description, delay }) => (
  <Grid item xs={12} sm={6} md={3} data-aos="fade-up" data-aos-delay={delay}>
    <Card
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        borderRadius: "18px",
        boxShadow: "0 20px 50px rgba(15, 76, 117, 0.12)",
        p: 3,
        textAlign: "left",
        background:
          "linear-gradient(145deg, rgba(255,255,255,0.95), rgba(240,248,255,0.9))",
        "&:hover": {
          transform: "translateY(-8px)",
          boxShadow: "0 24px 60px rgba(2, 132, 199, 0.2)",
          transition: "all 0.3s ease",
        },
      }}
    >
      <CardContent>
        <Box sx={{ color: "primary.main", fontSize: 36, mb: 2 }}>
          <Icon />
        </Box>
        <Typography variant="h6" fontWeight="bold" gutterBottom>
          {title}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {description}
        </Typography>
      </CardContent>
    </Card>
  </Grid>
);

const LandingPage = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const navigate = useNavigate(); // Initialize useNavigate

  useEffect(() => {
    AOS.init({ duration: 800, once: true });
  }, []);

  const howItWorksSteps = [
    {
      icon: FaSearch,
      title: "Tell us where & when",
      description: "Pick your airports, dates, and vibe in under a minute.",
      delay: 100,
    },
    {
      icon: FaChartLine,
      title: "Instantly compare",
      description: "Live prices across flights, stays, and experiences.",
      delay: 200,
    },
    {
      icon: FaWallet,
      title: "Book smart & relax",
      description: "Lock the best combo and keep every confirmation together.",
      delay: 300,
    },
  ];

  const benefits = [
    {
      icon: FaCheckCircle,
      title: "Comprehensive",
      description:
        "We scan flights, hotels, and activities to cover all your needs.",
      delay: 100,
    },
    {
      icon: FaWallet,
      title: "Best Prices",
      description:
        "Our smart algorithms ensure you get the most value for your money.",
      delay: 200,
    },
    {
      icon: FaSmile,
      title: "Human friendly",
      description: "Clean comparisons, zero overwhelm, and helpful tips.",
      delay: 300,
    },
    {
      icon: FaPlane,
      title: "Built for travelers",
      description: "Flexible filters for long hauls, layovers, and extras.",
      delay: 400,
    },
  ];

  const explorerVibes = [
    "Weekend escape",
    "Island hopping",
    "Cities after dark",
    "Work-from-anywhere",
    "Family friendly",
    "Adventure-first",
  ];

  const comparisonPillars = [
    {
      icon: FaPlane,
      title: "Flight clarity",
      description:
        "Fare drops, bag rules, layovers, and aircraft comfort in one glance.",
    },
    {
      icon: FaHotel,
      title: "Stay confidence",
      description:
        "Compare neighborhoods, perks, and cancellation at a glance.",
    },
    {
      icon: FaGlobeAmericas,
      title: "Local moments",
      description:
        "Curate tours, food stops, and day trips without extra tabs.",
    },
  ];

  const stats = [
    { label: "Trips planned", value: "1.2M+" },
    { label: "Cities covered", value: "4,800+" },
    { label: "Avg. saved", value: "$184/trip" },
  ];

  return (
    <Box>
      {/* Hero Section */}
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
            backgroundImage: `url(${CoverImage})`,
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
                    onClick={() => navigate("/search")}
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
                    GET SET GOOOOO!!
                  </Button>
                </Stack>

                <Stack direction="row" spacing={1} flexWrap="wrap" mt={1}>
                  {explorerVibes.map((vibe, index) => (
                    <Chip
                      key={index}
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
                  {stats.map((stat, index) => (
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
                    backgroundImage: `url(${CoverImage})`,
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
                          <FaHotel color={theme.palette.primary.main} />
                          <Typography variant="body2" fontWeight={700}>
                            Stay perks
                          </Typography>
                        </Stack>
                        <Stack direction="row" spacing={1} alignItems="center">
                          <FaGlobeAmericas color={theme.palette.primary.main} />
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

      <Container maxWidth="lg" sx={{ py: { xs: 6, md: 10 } }}>
        {/* Comparison Pillars */}
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
              <Typography
                variant="h4"
                component="h2"
                fontWeight="bold"
                gutterBottom
                data-aos="fade-up"
              >
                Built for travelers who compare everything.
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                Skip the endless tabs. We line up flights, hotels, and
                experiences with the details that matter before you book.
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
                {comparisonPillars.map((pillar, index) => {
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

        {/* How It Works Section */}
        <Box sx={{ mb: { xs: 8, md: 12 } }}>
          <Typography
            variant="h4"
            component="h2"
            align="center"
            fontWeight="bold"
            gutterBottom
            sx={{ mb: 4 }}
            data-aos="fade-up"
          >
            Plan in minutes, not days
          </Typography>
          <Grid container spacing={3}>
            {howItWorksSteps.map((step, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <StepCard {...step} />
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* Featured Destinations Section */}
        <FeaturedDestinations />

        {/* Why Choose Us Section */}
        <Box sx={{ mb: { xs: 8, md: 12 } }}>
          <Typography
            variant="h4"
            component="h2"
            align="center"
            fontWeight="bold"
            gutterBottom
            sx={{ mb: 6 }}
            data-aos="fade-up"
          >
            Why travelers stay with us
          </Typography>
          <Grid container spacing={4}>
            {benefits.map((benefit, index) => (
              <BenefitCard key={index} {...benefit} />
            ))}
          </Grid>
        </Box>

        {/* Call to Action */}
        <Box
          data-aos="fade-up"
          data-aos-delay="100"
          sx={{
            textAlign: "center",
            p: { xs: 4, md: 5 },
            borderRadius: "18px",
            background: "linear-gradient(120deg, #0d6e7a, #12a3ba)",
            color: "white",
            boxShadow: "0 25px 60px rgba(13,110,122,0.3)",
          }}
        >
          <Typography
            variant="h4"
            component="h3"
            gutterBottom
            fontWeight="bold"
          >
            Ready to Plan Your Next Trip?
          </Typography>
          <Typography
            variant="body1"
            color="rgba(255,255,255,0.86)"
            paragraph
            sx={{ maxWidth: 640, mx: "auto" }}
          >
            Compare with confidence, pick with clarity, and keep every piece of
            your journey in one place.
          </Typography>
          <Button
            variant="contained"
            color="secondary"
            size="large"
            onClick={() => navigate("/search")}
            sx={{
              py: 2,
              px: 4,
              borderRadius: "14px",
              bgcolor: "white",
              color: "primary.main",
              fontWeight: 700,
              boxShadow: "0 14px 35px rgba(255,255,255,0.2)",
              "&:hover": {
                bgcolor: "rgba(255,255,255,0.9)",
              },
            }}
          >
            Get Set GOOOOOO
          </Button>
        </Box>
      </Container>
    </Box>
  );
};

export default LandingPage;
