import React, { useState, useEffect } from "react";
import StickyNavbar from "../../components/User/Navbar";
import HeroSection from "../../components/User/HeroSection";
import FeaturedHotels from "../../components/User/FeaturedHotels";
import FeaturesSection from "../../components/User/FeaturesSection";
import Footer from "../../components/User/Footer";
import api from "../../services/api";

export default function Dashboard() {
  const [searchedHotels, setSearchedHotels] = useState([]);
  const [featuredHotels, setFeaturedHotels] = useState([]);
  const [searchActive, setSearchActive] = useState(false);
  const [location, setLocation] = useState({ latitude: null, longitude: null });
  const [locationError, setLocationError] = useState(null);


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
      <FeaturedHotels hotels={searchActive ? searchedHotels : featuredHotels} />
      
      <FeaturesSection />
      <Footer />
    </div>
  );
}
