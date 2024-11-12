import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Star, MapPin, Phone, Mail, Globe, Clock, Calendar, Wifi, Car, Coffee,Bell, ChevronLeft, ChevronRight, Users, Lamp, Shirt } from 'lucide-react';
import { toast } from 'react-hot-toast';
import api from '../../services/api';
import StickyNavbar from '../../components/User/Navbar';
import DateRangePicker from '../../components/User/DateRangePicker';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

const HotelDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [hotel, setHotel] = useState(null);
  const [activeTab, setActiveTab] = useState('rooms');
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [selectedRooms, setSelectedRooms] = useState({});
  const [dateRange, setDateRange] = useState([null, null]);
  const [mapData, setMapData] = useState(null);

  const handleDateChange = (update) => {
    setDateRange(update);
  };

  const apikey = "iETwQYsrfk3ODVgnbxKjf8PgOKJxXnqH9CyNwtlT";

  useEffect(() => {
    const fetchHotel = async () => {
      try {
        const response = await api.get(`/users/hotels/${id}`);
        setHotel(response.data.hotel);
        
        const olaResponse = await fetch(`https://api.olamaps.io/places/v1/geocode?address=${encodeURIComponent(response.data.hotel.location.city)}&language=English&api_key=${apikey}`);
        const olaData = await olaResponse.json();
        setMapData(olaData);
      } catch (error) {
        toast.error('Error fetching hotel details');
      }
    };
    fetchHotel();
  }, [id, apikey]);

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
      case 'wifi': return <Wifi className="w-6 h-6" />;
      case 'parking': return <Car className="w-6 h-6" />;
      case 'room service': return <Bell className="w-6 h-6" />;
      case 'housekeeping': return <Lamp className="w-6 h-6" />;
      case 'laundry service': return <Shirt className="w-6 h-6" />;
      default: return <Coffee className="w-6 h-6" />;
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

      const totalAmount = selectedRoomTypes.reduce((total, roomType) => {
        const room = hotel.roomTypes.find((r) => r.type === roomType);
        return total + (room ? room.price : 0);
      }, 0);

      const response = await api.post(`/users/create-order`, {
        amount: totalAmount * 100, 
        currency: 'INR',
        hotelId: hotel._id,
        roomTypes: selectedRoomTypes, 
        checkIn: checkIn.toISOString(),
        checkOut: checkOut.toISOString(),
      });

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
                Authorization: `${token}`,
              },
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
      console.error('Error during booking:', error);
      toast.error('Failed to initiate payment');
    }
  };

  if (!hotel || !mapData) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-100">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  const mapLocation = mapData.geocodingResults[0].geometry.location;

  return (
    <div className="bg-gray-100 min-h-screen">
      <StickyNavbar />
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white shadow-2xl rounded-3xl overflow-hidden">
          <div className="relative h-[60vh]">
            {hotel.images && hotel.images.gallery && hotel.images.gallery.length > 0 && (
              <>
                <img
                  src={hotel.images.gallery[currentImageIndex]}
                  alt={`${hotel.name} - Gallery Image ${currentImageIndex + 1}`}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent">
                  <div className="absolute bottom-0 left-0 right-0 p-8">
                    <h1 className="text-5xl font-bold text-white mb-4">{hotel.name}</h1>
                    <div className="flex items-center text-white space-x-4">
                      <div className="flex items-center">
                        <MapPin className="w-5 h-5 mr-2" />
                        <span className="text-lg">{hotel.location.city}</span>
                      </div>
                      <div className="bg-blue-500 text-white px-3 py-1 rounded-full flex items-center">
                        <Star className="w-4 h-4 mr-1" />
                        <span className="text-lg font-semibold">{hotel.rating}</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="absolute top-1/2 left-4 transform -translate-y-1/2">
                  <button
                    className="bg-white bg-opacity-50 hover:bg-opacity-75 rounded-full p-2 transition duration-300"
                    onClick={prevImage}
                  >
                    <ChevronLeft className="w-8 h-8 text-gray-800" />
                  </button>
                </div>
                <div className="absolute top-1/2 right-4 transform -translate-y-1/2">
                  <button
                    className="bg-white bg-opacity-50 hover:bg-opacity-75 rounded-full p-2 transition duration-300"
                    onClick={nextImage}
                  >
                    <ChevronRight className="w-8 h-8 text-gray-800" />
                  </button>
                </div>
              </>
            )}
          </div>
          
          <div className="p-8">
            <p className="text-gray-700 text-lg mb-8">{hotel.description}</p>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <h2 className="text-3xl font-semibold mb-6">Location</h2>
                <div className="h-96 rounded-2xl overflow-hidden mb-6 shadow-lg">
                  <MapContainer 
                    center={[mapLocation.lat, mapLocation.lng]} 
                    zoom={15} 
                    style={{ height: '100%', width: '100%' }}
                  >
                    <TileLayer
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    />
                    <Marker position={[mapLocation.lat, mapLocation.lng]}>
                      <Popup>{hotel.name}</Popup>
                    </Marker>
                  </MapContainer>
                </div>
                <p className="text-gray-600 text-lg">{mapData.geocodingResults[0].formatted_address}</p>
              </div>
              
              <div className="space-y-6">
                <div className="bg-gray-50 rounded-2xl p-6 shadow-md">
                  <h2 className="text-2xl font-semibold mb-4">Contact Information</h2>
                  <div className="space-y-3">
                    <p className="flex items-center text-gray-700">
                      <Phone className="w-5 h-5 mr-3 text-blue-500" />
                      {hotel.contactInfo.phone}
                    </p>
                    <p className="flex items-center text-gray-700">
                      <Mail className="w-5 h-5 mr-3 text-blue-500" />
                      {hotel.contactInfo.email}
                    </p>
                    <p className="flex items-center text-gray-700">
                      <Globe className="w-5 h-5 mr-3 text-blue-500" />
                      {hotel.contactInfo.website}
                    </p>
                  </div>
                </div>
                
                <div className="bg-gray-50 rounded-2xl p-6 shadow-md">
                  <h2 className="text-2xl font-semibold mb-4">Check-in/Check-out</h2>
                  <div className="space-y-3">
                    <p className="flex items-center text-gray-700">
                      <Clock className="w-5 h-5 mr-3 text-blue-500" />
                      Check-in: {hotel.checkInTime}
                    </p>
                    <p className="flex items-center text-gray-700">
                      <Calendar className="w-5 h-5 mr-3 text-blue-500" />
                      Check-out: {hotel.checkOutTime}
                    </p>
                  </div>
                </div>
              </div>
            </div>
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
          </div>

          {activeTab === 'rooms' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {hotel.roomTypes.map((room, index) => (
                    <div key={index} className="bg-white shadow-lg rounded-2xl overflow-hidden transition-transform duration-300 hover:scale-105">
                      <div className="p-6">
                        <h3 className="text-2xl font-semibold mb-3">{room.type}</h3>
                        <p className="text-gray-600 mb-4">{room.description}</p>
                        <div className="flex justify-between items-center mb-4">
                          <div className="flex items-center text-gray-600">
                            <Users className="w-5 h-5 mr-2" />
                            <span>Max Guests: {room.maxGuests}</span>
                          </div>
                          <p className="text-2xl font-bold text-blue-500">₹{room.price}</p>
                        </div>
                        <label className="flex items-center justify-between bg-gray-100 p-3 rounded-lg cursor-pointer hover:bg-gray-200 transition duration-300">
                          <span className="text-gray-700 font-medium">Select Room</span>
                          <input
                            type="checkbox"
                            checked={selectedRooms[room.type] || false}
                            onChange={() => handleRoomSelection(room)}
                            className="form-checkbox h-5 w-5 text-blue-500"
                          />
                        </label>
                      </div>
                    </div>
                  ))}
                </div>
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
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {hotel.services.map((service, index) => (
                <div key={index} className="flex items-center p-4 bg-white rounded-xl shadow-md transition-transform duration-300 hover:scale-105">
                  <div className="bg-blue-100 p-3 rounded-full mr-4">
                    {getServiceIcon(service)}
                  </div>
                  <span className="text-gray-700 font-medium">{service}</span>
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