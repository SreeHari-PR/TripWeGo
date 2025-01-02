import React from "react";
import { FaWifi, FaConciergeBell, FaSwimmingPool, FaUtensils } from "react-icons/fa";

export default function FeaturesSection() {
  const features = [
    { icon: <FaWifi className="w-8 h-8 text-[#0066FF]" />, title: "Free Wi-Fi", description: "Stay connected with free high-speed internet." },
    { icon: <FaConciergeBell className="w-8 h-8 text-[#0066FF]" />, title: "24/7 Concierge", description: "Top-notch concierge service to assist you." },
    { icon: <FaSwimmingPool className="w-8 h-8 text-[#0066FF]" />, title: "Swimming Pool", description: "Relax in our luxurious swimming pools." },
    { icon: <FaUtensils className="w-8 h-8 text-[#0066FF]" />, title: "Restaurant & Bar", description: "Enjoy fine dining and refreshing drinks." },
  ];

  return (
    <section className="py-16 bg-gray-100">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold mb-8 text-center">Our Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="text-center bg-white p-6 rounded-lg shadow-lg">
              <div className="mb-4">{feature.icon}</div>
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
