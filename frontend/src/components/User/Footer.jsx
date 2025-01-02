import React from "react";
import { FaFacebookF, FaInstagram, FaTwitter, FaLinkedinIn } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="bg-[#002233] text-white py-10">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Column 1: About */}
          <div>
            <h3 className="text-lg font-semibold mb-4">About Us</h3>
            <p>
              We provide the best travel and accommodation services. Our platform connects
              users with quality hotels, resorts, and more, ensuring a comfortable and
              memorable experience.
            </p>
          </div>
          
          {/* Column 2: Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul>
              <li className="mb-2">
                <a href="/" className="hover:underline">Home</a>
              </li>
              <li className="mb-2">
                <a href="/about" className="hover:underline">About</a>
              </li>
              <li className="mb-2">
                <a href="/services" className="hover:underline">Services</a>
              </li>
              <li className="mb-2">
                <a href="/contact" className="hover:underline">Contact</a>
              </li>
            </ul>
          </div>

          {/* Column 3: Social Media */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Follow Us</h3>
            <div className="flex space-x-4">
              <a href="#" aria-label="Facebook" className="hover:text-gray-300">
                <FaFacebookF className="w-6 h-6" />
              </a>
              <a href="#" aria-label="Instagram" className="hover:text-gray-300">
                <FaInstagram className="w-6 h-6" />
              </a>
              <a href="#" aria-label="Twitter" className="hover:text-gray-300">
                <FaTwitter className="w-6 h-6" />
              </a>
              <a href="#" aria-label="LinkedIn" className="hover:text-gray-300">
                <FaLinkedinIn className="w-6 h-6" />
              </a>
            </div>
          </div>
        </div>
        
        <div className="mt-8 text-center border-t border-white pt-4">
          <p className="text-sm">&copy; 2024 Travel Booking. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
