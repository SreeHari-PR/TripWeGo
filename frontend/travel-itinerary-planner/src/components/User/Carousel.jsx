import React from "react";
import { FaChevronLeft, FaChevronRight, FaMapMarkerAlt, FaStar } from "react-icons/fa";

export default function Carousel({ currentSlide, nextSlide, prevSlide, setCurrentSlide, totalSlides }) {
  const offers = [
    { title: "Luxury Beach Resort", location: "Maldives", price: "$299" },
    { title: "Mountain Retreat", location: "Swiss Alps", price: "$199" },
    { title: "City Center Hotel", location: "New York", price: "$249" },
  ];

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold mb-8 text-center">Featured Offers</h2>
        <div className="relative">
          <div className="overflow-hidden">
            <div className="flex transition-transform duration-300 ease-in-out"
                 style={{ transform: `translateX(-${currentSlide * 100}%)` }}>
              {offers.map((offer, index) => (
                <div key={index} className="w-full flex-shrink-0">
                  <div className="mx-auto max-w-2xl bg-white rounded-lg shadow-lg overflow-hidden">
                    <img src={`/placeholder.svg?height=300&width=600&text=Offer+${index + 1}`}
                         alt={offer.title} className="w-full h-64 object-cover" />
                    <div className="p-6">
                      <h3 className="text-xl font-semibold mb-2">{offer.title}</h3>
                      <p className="flex items-center mb-2"><FaMapMarkerAlt className="w-4 h-4 mr-2 text-gray-500" />{offer.location}</p>
                      <p className="flex items-center mb-4"><FaStar className="w-4 h-4 mr-2 text-yellow-400" /> 4.8 (350 reviews)</p>
                      <div className="flex justify-between items-center">
                        <span className="font-bold text-xl">{offer.price}/night</span>
                        <button className="bg-[#0066FF] hover:bg-[#0055cc] text-white font-bold py-2 px-4 rounded">Book Now</button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <button className="absolute top-1/2 left-4 transform -translate-y-1/2 bg-white p-2 rounded-full shadow-md hover:bg-gray-100" onClick={prevSlide}>
            <FaChevronLeft className="h-6 w-6 text-gray-600" />
          </button>
          <button className="absolute top-1/2 right-4 transform -translate-y-1/2 bg-white p-2 rounded-full shadow-md hover:bg-gray-100" onClick={nextSlide}>
            <FaChevronRight className="h-6 w-6 text-gray-600" />
          </button>
        </div>
        <div className="flex justify-center mt-4">
          {[...Array(totalSlides)].map((_, index) => (
            <button key={index} className={`mx-1 w-3 h-3 rounded-full ${currentSlide === index ? "bg-[#0066FF]" : "bg-gray-300"}`} onClick={() => setCurrentSlide(index)} />
          ))}
        </div>
      </div>
    </section>
  );
}
