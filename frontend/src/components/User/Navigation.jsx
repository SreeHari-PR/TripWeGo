import React from 'react';
import { Link } from 'react-router-dom';
import { Home, User, BookOpen, LogOut,Wallet } from 'lucide-react';

export default function Navigation({ onLogout }) {
  return (
    <div className="bg-white shadow rounded-lg p-6 h-full">
      <h2 className="text-xl font-semibold text-[#00246B] mb-6">Quick Navigation</h2>
      <nav className="space-y-2">
        <Link
          to="/"
          className="flex items-center space-x-3 px-4 py-3 text-[#00246B] rounded-md hover:bg-[#CADCFC] hover:text-[#00246B] transition duration-300"
        >
          <Home className="h-5 w-5" />
          <span>Home</span>
        </Link>
        <Link
          to="/profile"
          className="flex items-center space-x-3 px-4 py-3 text-[#00246B] rounded-md hover:bg-[#CADCFC] hover:text-[#00246B] transition duration-300"
        >
          <User className="h-5 w-5" />
          <span>Profile</span>
        </Link>
        <Link
          to="/wallet"
          className="flex items-center space-x-3 px-4 py-3 text-[#00246B] rounded-md hover:bg-[#CADCFC] hover:text-[#00246B] transition duration-300"
        >
          <Wallet className="h-5 w-5"/>
          <span>Wallet</span>
        </Link>
        <Link
          to="/bookings"
          className="flex items-center space-x-3 px-4 py-3 text-[#00246B] rounded-md hover:bg-[#CADCFC] hover:text-[#00246B] transition duration-300"
        >
          <BookOpen className="h-5 w-5" />
          <span>Bookings</span>
        </Link>
        <button
          onClick={onLogout}
          className="flex items-center space-x-3 px-4 py-3 text-red-600 rounded-md hover:bg-red-50 transition duration-300 w-full text-left"
        >
          <LogOut className="h-5 w-5" />
          <span>Logout</span>
        </button>
      </nav>
    </div>
  );
}
