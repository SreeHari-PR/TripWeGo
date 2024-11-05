import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaStar, FaMapMarkerAlt, FaPhone, FaEnvelope, FaGlobe, FaClock, FaCalendar, FaWifi, FaCar, FaCoffee, FaBroom, FaSpa, FaUtensils, FaConciergeBell } from 'react-icons/fa';
import { toast } from 'react-hot-toast';
import api from '../../services/api';
import StickyNavbar from '../../components/User/Navbar';
import DateRangePicker from '../../components/User/DateRangePicker';

const HotelDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [hotel, setHotel] = useState(null);
  const [activeTab, setActiveTab] = useState('rooms');
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [selectedRooms, setSelectedRooms] = useState({});
  const [dateRange, setDateRange] = useState([null, null]);

  const handleDateChange = (update) => {
    setDateRange(update);
  };
 
  useEffect(() => {
    const fetchHotel = async () => {
      try {
        const response = await api.get(`/users/hotels/${id}`);
        setHotel(response.data.hotel);
      } catch (error) {
        toast.error('Error fetching hotel details');
      }
    };
    fetchHotel();
  }, [id]);
  
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
  
  const getServiceIcon = (service) => {
    switch (service.toLowerCase()) {
      case 'wifi':
        return <FaWifi className="w-6 h-6" />;
      case 'parking':
        return <FaCar className="w-6 h-6" />;
      case 'room service':
        return <FaConciergeBell className="w-6 h-6" />;
      case 'housekeeping':
        return <FaBroom className="w-6 h-6" />;
      case 'spa':
        return <FaSpa className="w-6 h-6" />;
      case 'restaurant':
        return <FaUtensils className="w-6 h-6" />;
      default:
        return <FaCoffee className="w-6 h-6" />;
    }
  };

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
    setSelectedRooms(prev => ({
      ...prev,
      [room.type]: !prev[room.type]
    }));
  };

  const handleBookNow = async () => {
    try {
      const [checkIn, checkOut] = dateRange;

      if (!checkIn || !checkOut) {
        toast.error('Please select check-in and check-out dates');
        return;
      }

      const selectedRoomTypes = Object.entries(selectedRooms)
        .filter(([_, isSelected]) => isSelected)
        .map(([roomType]) => roomType);

      if (selectedRoomTypes.length === 0) {
        toast.error('Please select at least one room type');
        return;
      }

      const totalAmount = selectedRoomTypes.reduce((total, roomType) => {
        const room = hotel.roomTypes.find(r => r.type === roomType);
        return total + (room ? room.price : 0);
      }, 0);

      const response = await api.post(`/users/create-order`, {
        amount: totalAmount * 100,
        currency: 'INR',
        hotelId: hotel._id,
        roomTypes: selectedRoomTypes,
        checkIn: checkIn.toISOString(),
        checkOut: checkOut.toISOString()
      });
  
      console.log('Order response:', response.data);
      const { order } = response.data;
  
      const options = {
        key: "rzp_test_rwud39pugiL6zo",
        amount: order.amount,
        currency: order.currency,
        name: 'Hotel Booking',
        description: `Booking rooms: ${selectedRoomTypes.join(', ')}`,
        order_id: order.id,
        handler: async function (response) {
          const { razorpay_payment_id, razorpay_order_id, razorpay_signature } = response;
          const token = localStorage.getItem('token'); 
          console.log(token);

          await api.post(
            '/users/verify-payment',
            {
              paymentId: razorpay_payment_id,
              orderId: razorpay_order_id,
              signature: razorpay_signature,
              hotelId: hotel._id,
              roomTypes: selectedRoomTypes,
              checkInDate: checkIn.toISOString(), 
              checkOutDate: checkOut.toISOString(),
              amount: totalAmount,
            },
            {
              headers: {
                Authorization: `${token}`
              }
            }
          );
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
      console.error('Error during payment initiation:', error); 
      toast.error('Failed to initiate payment');
    }
  };
  

  if (!hotel) {
    return <div>Loading hotel details...</div>;
  }

  return (
    <div>
      <StickyNavbar />
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2">
            <div className="bg-white shadow-lg rounded-lg overflow-hidden">
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <h1 className="text-3xl font-bold text-gray-800">{hotel.name}</h1>
                    <p className="flex items-center mt-2 text-gray-600">
                      <FaMapMarkerAlt className="w-4 h-4 mr-1" />
                      {hotel.location.city}
                    </p>
                  </div>
                  <div className="bg-blue-100 text-blue-800 text-lg font-semibold px-3 py-1 rounded-full flex items-center">
                    <FaStar className="w-4 h-4 mr-1 text-yellow-400" />
                    {hotel.rating}
                  </div>
                </div>
                <div className="relative">
                  {hotel.images && hotel.images.gallery && hotel.images.gallery.length > 0 && (
                    <>
                      <img
                        src={hotel.images.gallery[currentImageIndex]}
                        alt={`${hotel.name} - Gallery Image ${currentImageIndex + 1}`}
                        className="rounded-lg object-cover w-full h-64 md:h-96"
                      />
                      <button
                        className="absolute top-1/2 left-2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full"
                        onClick={prevImage}
                      >
                        &#10094;
                      </button>
                      <button
                        className="absolute top-1/2 right-2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full"
                        onClick={nextImage}
                      >
                        &#10095;
                      </button>
                    </>
                  )}
                </div>
                <p className="mt-4 text-gray-700">{hotel.description}</p>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white shadow-lg rounded-lg overflow-hidden">
              <div className="p-6">
                <h2 className="text-xl font-semibold mb-4">Contact Information</h2>
                <div className="space-y-2">
                  <p className="flex items-center">
                    <FaPhone className="w-4 h-4 mr-2 text-gray-600" />
                    {hotel.contactInfo.phone}
                  </p>
                  <p className="flex items-center">
                    <FaEnvelope className="w-4 h-4 mr-2 text-gray-600" />
                    {hotel.contactInfo.email}
                  </p>
                  <p className="flex items-center">
                    <FaGlobe className="w-4 h-4 mr-2 text-gray-600" />
                    {hotel.contactInfo.website}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white shadow-lg rounded-lg overflow-hidden">
              <div className="p-6">
                <h2 className="text-xl font-semibold mb-4">Check-in/Check-out</h2>
                <div className="space-y-2">
                  <p className="flex items-center">
                    <FaClock className="w-4 h-4 mr-2 text-gray-600" />
                    Check-in: {hotel.checkInTime}
                  </p>
                  <p className="flex items-center">
                    <FaCalendar className="w-4 h-4 mr-2 text-gray-600" />
                    Check-out: {hotel.checkOutTime}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white shadow-lg rounded-lg overflow-hidden">
              <div className="p-6">
                <h2 className="text-xl font-semibold mb-4">Select Dates</h2>
                <DateRangePicker onDateChange={handleDateChange} />
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8">
          <div className="flex border-b">
            <button
              className={`py-2 px-4 ${activeTab === 'rooms' ? 'border-b-2 border-blue-500 text-blue-500' : 'text-gray-500'}`}
              onClick={() => setActiveTab('rooms')}
            >
              Room Types
            </button>
            <button
              className={`py-2 px-4 ${activeTab === 'services' ? 'border-b-2 border-blue-500 text-blue-500' : 'text-gray-500'}`}
              onClick={() => setActiveTab('services')}
            >
              Services
            </button>
          </div>

          {activeTab === 'rooms' && (
            <div className="mt-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
                {hotel.roomTypes.map((room, index) => (
                  <div key={index} className="bg-white shadow-lg rounded-lg overflow-hidden">
                    <div className="p-4">
                      <h3 className="text-xl font-semibold mb-2">{room.type}</h3>
                      <p className="text-gray-600 mb-2">{room.description}</p>
                      <p className="text-gray-600 mb-2">Max Guests: {room.maxGuests}</p>
                      <p className="font-semibold mb-4">₹{room.price}</p>
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={selectedRooms[room.type] || false}
                          onChange={() => handleRoomSelection(room)}
                          className="form-checkbox h-5 w-5 text-blue-600"
                        />
                        <span className="ml-2 text-gray-700">Select</span>
                      </label>
                    </div>
                  </div>
                ))}
              </div>
              <button
                className="mt-6 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition duration-300 w-full"
                onClick={handleBookNow}
              >
                Book Selected Rooms
              </button>
            </div>
          )}

          {activeTab === 'services' && (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-4">
              {hotel.services.map((service, index) => (
                <div key={index} className="flex items-center p-4 bg-gray-100 rounded-lg">
                  {getServiceIcon(service)}
                  <span className="ml-2">{service}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HotelDetails;