import React from 'react';
import { ChevronLeft, ChevronRight,MapPin,Star } from 'lucide-react';

const HotelGallery = ({ images, currentImageIndex, prevImage, nextImage, hotel }) => {
  return (
    <div className="relative h-[60vh]">
      {images && images.length > 0 && (
        <>
          <img
            src={images[currentImageIndex]}
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
  );
};

export default HotelGallery;

