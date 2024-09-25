// src/pages/Dashboard.js
import React, { useState } from "react";
import {
  FaBed,
  FaPhone,
  FaCreditCard,
  FaMapMarkerAlt,
  FaStar,
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa";
import StickyNavbar from "../components/Navbar";

export default function Dashboard() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const totalSlides = 3;

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % totalSlides);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides);
  };

  return (
    <>
    <div className="min-h-screen bg-gray-100">
      <StickyNavbar />
      {/* Hero Section */}
      <section className="bg-[#002233] text-white py-20">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold mb-4">Find Your Perfect Stay</h1>
          <p className="mb-8">Discover amazing hotels at the best prices</p>
          <div className="bg-white text-gray-800 rounded-lg shadow-lg">
            <div className="p-6">
              <form className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label
                    htmlFor="destination"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Destination
                  </label>
                  <input
                    id="destination"
                    placeholder="Where are you going?"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#0066FF] focus:border-[#0066FF]"
                  />
                </div>
                <div>
                  <label
                    htmlFor="check-in"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Check-in
                  </label>
                  <input
                    id="check-in"
                    type="date"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#0066FF] focus:border-[#0066FF]"
                  />
                </div>
                <div>
                  <label
                    htmlFor="check-out"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Check-out
                  </label>
                  <input
                    id="check-out"
                    type="date"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#0066FF] focus:border-[#0066FF]"
                  />
                </div>
                <div>
                  <label
                    htmlFor="guests"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Guests
                  </label>
                  <select
                    id="guests"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#0066FF] focus:border-[#0066FF]"
                  >
                    <option>Select</option>
                    <option value="1">1 Guest</option>
                    <option value="2">2 Guests</option>
                    <option value="3">3 Guests</option>
                    <option value="4">4+ Guests</option>
                  </select>
                </div>
              </form>
            </div>
            <div className="bg-gray-50 px-4 py-3 sm:px-6 rounded-b-lg">
              <button className="w-full bg-[#0066FF] hover:bg-[#0055cc] text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
                Search Hotels
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Carousel Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8 text-center">Featured Offers</h2>
          <div className="relative">
            <div className="overflow-hidden">
              <div
                className="flex transition-transform duration-300 ease-in-out"
                style={{ transform: `translateX(-${currentSlide * 100}%)` }}
              >
                {[
                  { title: "Luxury Beach Resort", location: "Maldives", price: "$299" },
                  { title: "Mountain Retreat", location: "Swiss Alps", price: "$199" },
                  { title: "City Center Hotel", location: "New York", price: "$249" },
                ].map((offer, index) => (
                  <div key={index} className="w-full flex-shrink-0">
                    <div className="mx-auto max-w-2xl bg-white rounded-lg shadow-lg overflow-hidden">
                      <img
                        src={`/placeholder.svg?height=300&width=600&text=Offer+${index + 1}`}
                        alt={offer.title}
                        className="w-full h-64 object-cover"
                      />
                      <div className="p-6">
                        <h3 className="text-xl font-semibold mb-2">{offer.title}</h3>
                        <p className="flex items-center mb-2">
                          <FaMapMarkerAlt className="w-4 h-4 mr-2 text-gray-500" />
                          {offer.location}
                        </p>
                        <p className="flex items-center mb-4">
                          <FaStar className="w-4 h-4 mr-2 text-yellow-400" />
                          4.8 (350 reviews)
                        </p>
                        <div className="flex justify-between items-center">
                          <span className="font-bold text-xl">{offer.price}/night</span>
                          <button className="bg-[#0066FF] hover:bg-[#0055cc] text-white font-bold py-2 px-4 rounded">
                            Book Now
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <button
              className="absolute top-1/2 left-4 transform -translate-y-1/2 bg-white p-2 rounded-full shadow-md hover:bg-gray-100"
              onClick={prevSlide}
            >
              <FaChevronLeft className="h-6 w-6 text-gray-600" />
            </button>
            <button
              className="absolute top-1/2 right-4 transform -translate-y-1/2 bg-white p-2 rounded-full shadow-md hover:bg-gray-100"
              onClick={nextSlide}
            >
              <FaChevronRight className="h-6 w-6 text-gray-600" />
            </button>
          </div>
          <div className="flex justify-center mt-4">
            {[...Array(totalSlides)].map((_, index) => (
              <button
                key={index}
                className={`mx-1 w-3 h-3 rounded-full ${currentSlide === index ? "bg-[#0066FF]" : "bg-gray-300"
                  }`}
                onClick={() => setCurrentSlide(index)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Featured Hotels Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8">Featured Hotels</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1, 2, 3].map((hotel) => (
              <div key={hotel} className="bg-white rounded-lg shadow-lg overflow-hidden">
                <img
                  src={`/placeholder.svg?height=200&width=400&text=Hotel+${hotel}`}
                  alt={`Hotel ${hotel}`}
                  className="w-full h-48 object-cover"
                />
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-2">Luxury Hotel {hotel}</h3>
                  <p className="flex items-center mb-2">
                    <FaMapMarkerAlt className="w-4 h-4 mr-2 text-gray-500" />
                    City {hotel}, Country
                  </p>
                  <p className="flex items-center mb-4">
                    <FaStar className="w-4 h-4 mr-2 text-yellow-400" />
                    4.5 (200 reviews)
                  </p>
                  <div className="flex justify-between items-center">
                    <span className="font-bold">$199/night</span>
                    <button className="bg-[#0066FF] hover:bg-[#0055cc] text-white font-bold py-2 px-4 rounded">
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
{/* Features Section */ }
<section className="py-16">
  <div className="container mx-auto px-4">
    <h2 className="text-3xl font-bold mb-8 text-center">Why Choose Us</h2>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      <div className="text-center">
        <FaBed className="w-12 h-12 mx-auto mb-4 text-blue-600" />
        <h3 className="font-bold mb-2">Wide Selection</h3>
        <p>Choose from thousands of hotels worldwide</p>
      </div>
      <div className="text-center">
        <FaPhone className="w-12 h-12 mx-auto mb-4 text-blue-600" />
        <h3 className="font-bold mb-2">24/7 Support</h3>
        <p>Our customer service team is always here to help</p>
      </div>
      <div className="text-center">
        <FaCreditCard className="w-12 h-12 mx-auto mb-4 text-blue-600" />
        <h3 className="font-bold mb-2">Best Price Guarantee</h3>
        <p>Find a lower price? We'll match it!</p>
      </div>
    </div>
  </div>
</section>
{/* Footer */ }
<footer className="bg-gray-800 text-white py-8">
  <div className="container mx-auto px-4">
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      <div>
        <h3 className="font-bold mb-4">About Us</h3>
        <p>We're dedicated to helping you find the perfect hotel for your travels.</p>
      </div>
      <div>
        <h3 className="font-bold mb-4">Quick Links</h3>
        <ul className="space-y-2">
          <li><a href="#" className="hover:underline">Search Hotels</a></li>
          <li><a href="#" className="hover:underline">Special Offers</a></li>
          <li><a href="#" className="hover:underline">Contact Us</a></li>
        </ul>
      </div>
      <div>
        <h3 className="font-bold mb-4">Newsletter</h3>
        <p className="mb-2">Subscribe for exclusive deals and offers</p>
        <form className="flex">
          <input type="email" placeholder="Your email" className="flex-grow px-3 py-2 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
          <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-r-md">Subscribe</button>
        </form>
      </div>
    </div>
    <div className="mt-8 text-center">
      <p>&copy; 2023 Hotel Booking App. All rights reserved.</p>
    </div>
  </div>
</footer>
</>
)}