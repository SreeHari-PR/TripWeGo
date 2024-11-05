import React from "react"
import SearchForm from "./SearchForm";


export default function HeroSection({ onSearch }) {
  return (
    <section className="bg-[#00246B] text-white py-20">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold mb-4">Find Your Perfect Stay</h1>
        <p className="mb-8">Discover amazing hotels at the best prices</p>
        <div className="bg-white text-gray-800 rounded-lg shadow-lg">
          <div className="p-5 bg-[#CADCFC] ">
            <SearchForm onSearch={onSearch} />
          </div>
        </div>
      </div>
    </section>
  );
}
