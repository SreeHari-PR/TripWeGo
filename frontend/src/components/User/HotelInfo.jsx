import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { Phone, Mail, Globe, Clock, Calendar } from 'lucide-react';
import 'leaflet/dist/leaflet.css';

const HotelInfo = ({ hotel, mapData }) => {
  const mapLocation = mapData.geocodingResults[0].geometry.location;

  return (
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
  );
};

export default HotelInfo;

