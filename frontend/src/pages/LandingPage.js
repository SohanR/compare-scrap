import React, { useEffect } from "react";
import { Box, Container } from "@mui/material";
import {
  FaPlane,
  FaHotel,
  FaChartLine,
  FaCheckCircle,
  FaSearch,
  FaWallet,
  FaSmile,
  FaGlobeAmericas,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import AOS from "aos";
import "aos/dist/aos.css";
import CoverImage from "../asset/cover.png";
import FeaturedDestinations from "../components/FeaturedDestinations";
import HeroSection from "../components/landing/HeroSection";
import ComparisonPillars from "../components/landing/ComparisonPillars";
import HowItWorksSection from "../components/landing/HowItWorksSection";
import BenefitsSection from "../components/landing/BenefitsSection";
import CallToAction from "../components/landing/CallToAction";

const LandingPage = () => {
  const navigate = useNavigate();

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
      description: "We scan flights, hotels, and activities to cover all your needs.",
      delay: 100,
    },
    {
      icon: FaWallet,
      title: "Best Prices",
      description: "Our smart algorithms ensure you get the most value for your money.",
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
      description: "Fare drops, bag rules, layovers, and aircraft comfort in one glance.",
    },
    {
      icon: FaHotel,
      title: "Stay confidence",
      description: "Compare neighborhoods, perks, and cancellation at a glance.",
    },
    {
      icon: FaGlobeAmericas,
      title: "Local moments",
      description: "Curate tours, food stops, and day trips without extra tabs.",
    },
  ];

  const stats = [
    { label: "Trips planned", value: "1.2M+" },
    { label: "Cities covered", value: "4,800+" },
    { label: "Avg. saved", value: "$184/trip" },
  ];

  return (
    <Box>
      <HeroSection
        coverImage={CoverImage}
        explorerVibes={explorerVibes}
        stats={stats}
        onPrimaryClick={() => navigate("/search")}
        onSecondaryClick={() => navigate("/search")}
      />

      <Container maxWidth="lg" sx={{ py: { xs: 6, md: 10 } }}>
        <ComparisonPillars pillars={comparisonPillars} />
        <HowItWorksSection steps={howItWorksSteps} />
        <FeaturedDestinations />
        <BenefitsSection benefits={benefits} />
        <CallToAction onClick={() => navigate("/search")} />
      </Container>
    </Box>
  );
};

export default LandingPage;
