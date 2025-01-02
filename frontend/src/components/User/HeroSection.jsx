import React from "react"
import SearchForm from "./SearchForm";
import Carousel from "./Carousel";

export default function HeroSection({ onSearch }) {
  return (
    <section className="relative bg-[#00246B] min-h-[calc(100vh-64px)]">
      <div className="absolute inset-0">
        <Carousel />
      </div>
      <div className="relative container mx-auto px-4 pt-32 pb-48">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 drop-shadow-lg">
            Find Your Perfect Stay
          </h1>
          <p className="text-xl md:text-2xl text-white/90 drop-shadow-md">
            Discover amazing hotels at the best prices
          </p>
        </div>
        <div className="max-w-5xl mx-auto">
          <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl p-6">
            <SearchForm onSearch={onSearch} />
          </div>
        </div>
      </div>
    </section>
  );
}

