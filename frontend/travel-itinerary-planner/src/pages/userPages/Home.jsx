import React, { useState, useEffect } from "react";
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
  const [location, setLocation] = useState({ latitude: null, longitude: null });
  const [locationError, setLocationError] = useState(null);

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

  // Fetch user's location on component mount
  useEffect(() => {
    const fetchLocation = () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            setLocation({
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
            });
          },
          (error) => {
            setLocationError(error.message);
          }
        );
      } else {
        setLocationError('Geolocation is not supported by this browser.');
      }
    };

    fetchLocation();
  }, []);

  return (
    <div>
      <StickyNavbar />
      <HeroSection onSearch={handleSearch} location={location} />
      
      {locationError ? (
        <p className="text-red-500 text-center mt-4">{locationError}</p>
      ) : location.latitude && location.longitude ? (
        <p className="text-center mt-4">
          Current Location - Latitude: {location.latitude}, Longitude: {location.longitude}
        </p>
      ) : (
        <p className="text-center mt-4">Loading location...</p>
      )}

      <FeaturedHotels hotels={searchActive ? searchedHotels : featuredHotels} />
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
