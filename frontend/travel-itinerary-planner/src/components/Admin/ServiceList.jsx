import React from 'react';
import * as Icons from 'react-icons/fa';

const ServiceList = ({ services }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {services.map((service, index) => {
        const IconComponent = Icons[service.icon];
        return (
          <div key={index} className="border border-gray-200 p-4 rounded-lg shadow-sm">
            <div className="flex items-center mb-2">
              {IconComponent && <IconComponent className="text-2xl mr-2 text-indigo-600" />}
              <h3 className="text-lg font-semibold text-gray-800">{service.name}</h3>
            </div>
            <p className="text-gray-600">{service.description}</p>
          </div>
        );
      })}
    </div>
  );
};

export default ServiceList;
