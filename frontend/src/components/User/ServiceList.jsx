import React from 'react';
import { Wifi, Car, Coffee, Bell, Lamp, Shirt } from 'lucide-react';

const ServiceList = ({ services }) => {
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

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {services.map((service, index) => (
        <div key={index} className="flex items-center p-4 bg-white rounded-xl shadow-md transition-transform duration-300 hover:scale-105">
          <div className="bg-blue-100 p-3 rounded-full mr-4">
            {getServiceIcon(service)}
          </div>
          <span className="text-gray-700 font-medium">{service}</span>
        </div>
      ))}
    </div>
  );
};

export default ServiceList;

