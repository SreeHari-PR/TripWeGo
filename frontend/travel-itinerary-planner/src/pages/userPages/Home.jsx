import React, { useState,useEffect } from "react";
import StickyNavbar from "../../components/User/Navbar";
import HeroSection from "../../components/User/HeroSection";
import Carousel from "../../components/User/Carousel";
import FeaturedHotels from "../../components/User/FeaturedHotels";
import FeaturesSection from "../../components/User/FeaturesSection";
import Footer from "../../components/User/Footer";
import api from "../../services/api";

export default function Dashboard() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [searchedHotels, setSearchedHotels] = useState([]);
  const [featuredHotels, setFeaturedHotels] = useState([]);
  const [searchActive, setSearchActive] = useState(false);

   
  const totalSlides = 3;

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev === totalSlides - 1 ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? totalSlides - 1 : prev - 1));
  };
  useEffect(() => {
    const fetchFeaturedHotels = async () => {
      try {
        const response = await api.get('/users/hotels');
        setFeaturedHotels(response.data.data);
      } catch (err) {
        console.error('Error fetching featured hotels:', err);
      }
    };
    fetchFeaturedHotels();
  }, []);

  const handleSearch = (hotels) => {
    setSearchedHotels(hotels);
    setSearchActive(true); 
  };


  return (
    <div>
      <StickyNavbar />
      <HeroSection onSearch={handleSearch}  />
      
      <FeaturedHotels hotels={searchActive ? searchedHotels : featuredHotels}   />
      <Carousel
        currentSlide={currentSlide}
        nextSlide={nextSlide}
        prevSlide={prevSlide}
        setCurrentSlide={setCurrentSlide}
        totalSlides={totalSlides}
      />
      <FeaturesSection />
      <Footer />
    </div>
  );
}
