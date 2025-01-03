import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

import { toast } from 'react-hot-toast';
import StickyNavbar from '../../components/User/Navbar';
import DateRangePicker from '../../components/User/DateRangePicker';
import ReviewComponent from '../../components/User/ReviewComponent';
import HotelGallery from '../../components/User/HotelGallery';
import HotelInfo from '../../components/User/HotelInfo';
import RoomList from '../../components/User/RoomList';
import ServiceList from '../../components/User/ServiceList';
import ManagerDetails from '../../components/User/ManagerDetails';
import { hotelService } from '../../services/User/hotelService';

const HotelDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [hotel, setHotel] = useState(null);
  const [activeTab, setActiveTab] = useState('rooms');
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [selectedRooms, setSelectedRooms] = useState({});
  const [dateRange, setDateRange] = useState([null, null]);
  const [mapData, setMapData] = useState(null);
  const [reviews, setReviews] = useState([]);

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const handleDateChange = (update) => {
    setDateRange(update);
  };

  const apikey = "iETwQYsrfk3ODVgnbxKjf8PgOKJxXnqH9CyNwtlT";

  const fetchHotel = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const hotelData = await hotelService.getHotelDetails(id);
      console.log(hotelData,'djkahjk')
      setHotel(hotelData);

      const reviewsData = await hotelService.getHotelReviews(id);
      setReviews(reviewsData);

      const olaResponse = await fetch(`https://api.olamaps.io/places/v1/geocode?address=${encodeURIComponent(hotelData.location.city)}&language=English&api_key=${apikey}`);
      const olaData = await olaResponse.json();
      setMapData(olaData);
    } catch (error) {
      console.error('Error fetching hotel details:', error);
      setError('Failed to load hotel details. Please try again.');
      toast.error('Error fetching hotel details');
    } finally {
      setIsLoading(false);
    }
  }, [id, apikey]);

  useEffect(() => {
    fetchHotel();
  }, [fetchHotel]);

  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    script.onload = () => {
      console.log('Razorpay script loaded successfully');
    };
    script.onerror = () => {
      console.error('Failed to load Razorpay script');
      toast.error('Failed to load Razorpay. Please try again.');
    };
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const nextImage = () => {
    if (hotel) {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % hotel.images.gallery.length);
    }
  };

  const prevImage = () => {
    if (hotel) {
      setCurrentImageIndex((prevIndex) => (prevIndex - 1 + hotel.images.gallery.length) % hotel.images.gallery.length);
    }
  };

  const handleRoomSelection = (room) => {
    setSelectedRooms((prev) => ({
      ...prev,
      [room.type]: !prev[room.type],
    }));
  };

  const handleBookNow = async () => {
    try {
      const [checkIn, checkOut] = dateRange;
  
      if (!checkIn || !checkOut) {
        toast.error('Please select check-in and check-out dates');
        return;
      }
  
      if (checkOut <= checkIn) {
        toast.error('Check-out date should be after check-in date');
        return;
      }
  
      const selectedRoomTypes = Object.keys(selectedRooms).filter(
        (roomType) => selectedRooms[roomType]
      );
  
      if (selectedRoomTypes.length === 0) {
        toast.error('Please select at least one room type');
        return;
      }
  
      // Calculate the number of days
      const oneDay = 24 * 60 * 60 * 1000; // Milliseconds in a day
      const numberOfDays = Math.round((checkOut - checkIn) / oneDay);
  
      if (numberOfDays <= 0) {
        toast.error('Invalid date range');
        return;
      }
  
      // Calculate the total amount
      const totalAmount = selectedRoomTypes.reduce((total, roomType) => {
        const room = hotel.roomTypes.find((r) => r.type === roomType);
        return total + (room ? room.price * numberOfDays : 0);
      }, 0);
  
      const orderData = {
        amount: totalAmount * 100, // Convert to paisa for Razorpay
        currency: 'INR',
        hotelId: hotel._id,
        roomTypes: selectedRoomTypes,
        checkIn: checkIn.toISOString(),
        checkOut: checkOut.toISOString(),
      };
  
      const order = await hotelService.createOrder(orderData);
  
      const options = {
        key: "rzp_test_rwud39pugiL6zo",
        amount: order.amount,
        currency: order.currency,
        name: 'Hotel Booking',
        description: `Booking rooms: ${selectedRoomTypes.join(', ')}`,
        order_id: order.id,
        handler: async function (response) {
          const { razorpay_payment_id, razorpay_order_id, razorpay_signature } = response;
  
          await hotelService.verifyPayment({
            paymentId: razorpay_payment_id,
            orderId: razorpay_order_id,
            signature: razorpay_signature,
            hotelId: hotel._id,
            roomTypes: selectedRoomTypes,
            checkInDate: checkIn.toISOString(),
            checkOutDate: checkOut.toISOString(),
            amount: totalAmount,
          });
  
          toast.success('Payment Successful! Booking confirmed.');
          navigate('/bookings');
        },
        prefill: {
          name: 'Trip We Go',
          email: 'TripWeGo@gmail.com',
          contact: '9876543210',
        },
      };
  
      if (window.Razorpay) {
        const rzp = new window.Razorpay(options);
        rzp.open();
      } else {
        toast.error('Failed to load Razorpay. Please try again.');
      }
    } catch (error) {
      console.error('Error during booking:', error);
      toast.error('Failed to initiate payment');
    }
  };
  

  const handleAddReview = async (newReview) => {
    try {
      const updatedReviews = await hotelService.addHotelReview(id, newReview);
      setReviews(updatedReviews);
      toast.success('Review added successfully');
    } catch (error) {
      toast.error('Error adding review');
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-100">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-100">
        <div className="text-red-500 text-xl">{error}</div>
      </div>
    );
  }

  if (!hotel || !mapData) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-100">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="bg-gray-100 min-h-screen">
      <StickyNavbar />
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white shadow-2xl rounded-3xl overflow-hidden">
          <HotelGallery
            images={hotel.images.gallery}
            currentImageIndex={currentImageIndex}
            prevImage={prevImage}
            nextImage={nextImage}
            hotel={hotel}
          />

          <div className="p-8">
            <p className="text-gray-700 text-lg mb-8">{hotel.description}</p>
            <HotelInfo hotel={hotel} mapData={mapData} />
          </div>
        </div>

        <div className="mt-12">
          <div className="flex border-b-2 border-gray-200 mb-8">
            <button
              className={`py-3 px-6 font-semibold text-lg ${activeTab === 'rooms' ? 'text-blue-500 border-b-2 border-blue-500' : 'text-gray-500'}`}
              onClick={() => setActiveTab('rooms')}
            >
              Room Types
            </button>
            <button
              className={`py-3 px-6 font-semibold text-lg ${activeTab === 'services' ? 'text-blue-500 border-b-2 border-blue-500' : 'text-gray-500'}`}
              onClick={() => setActiveTab('services')}
            >
              Services
            </button>
            <button
              className={`py-3 px-6 font-semibold text-lg ${activeTab === 'reviews' ? 'text-blue-500 border-b-2 border-blue-500' : 'text-gray-500'}`}
              onClick={() => setActiveTab('reviews')}
            >
              Reviews
            </button>
            <button
              className={`py-3 px-6 font-semibold text-lg ${activeTab === 'manager' ? 'text-blue-500 border-b-2 border-blue-500' : 'text-gray-500'}`}
              onClick={() => setActiveTab('manager')}
            >
              Manager
            </button>
          </div>

          {activeTab === 'rooms' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <RoomList
                  rooms={hotel.roomTypes}
                  selectedRooms={selectedRooms}
                  handleRoomSelection={handleRoomSelection}
                />
              </div>
              <div>
                <div className="bg-white shadow-lg rounded-2xl p-6 sticky top-4">
                  <h2 className="text-2xl font-semibold mb-4">Select Dates</h2>
                  <DateRangePicker onDateChange={handleDateChange} />
                  <button
                    className="mt-6 bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition duration-300 w-full text-lg font-semibold"
                    onClick={handleBookNow}
                  >
                    Book Selected Rooms
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'services' && (
            <ServiceList services={hotel.services} />
          )}

          {activeTab === 'reviews' && (
            <ReviewComponent
              hotelId={id}
              reviews={reviews}
              onAddReview={handleAddReview}
            />
          )}
           {activeTab === 'manager' && (
            <ManagerDetails
              manager={hotel.managerId}
            />
          )}
        </div>
      </div>
    </div>

  );
};

export default HotelDetails;

