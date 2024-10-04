import React, { useState } from "react";
import StickyNavbar from "../../components/User/Navbar";
import HeroSection from "../../components/User/HeroSection";
import Carousel from "../../components/User/Carousel";
import FeaturedHotels from "../../components/User/FeaturedHotels";
import FeaturesSection from "../../components/User/FeaturesSection";
import Footer from "../../components/User/Footer";

export default function Dashboard() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const totalSlides = 3;

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev === totalSlides - 1 ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? totalSlides - 1 : prev - 1));
  };

  return (
    <div>
      <StickyNavbar />
      <HeroSection />
      <Carousel
        currentSlide={currentSlide}
        nextSlide={nextSlide}
        prevSlide={prevSlide}
        setCurrentSlide={setCurrentSlide}
        totalSlides={totalSlides}
      />
      <FeaturedHotels />
      <FeaturesSection />
      <Footer />
    </div>
  );
}
