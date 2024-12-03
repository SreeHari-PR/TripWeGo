import React from 'react';
import { BedDouble, Users } from 'lucide-react';

const RoomList = ({ rooms, selectedRooms, handleRoomSelection }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {rooms.map((room, index) => (
        <div key={index} className="bg-white shadow-lg rounded-2xl overflow-hidden transition-transform duration-300 hover:scale-105">
          <div className="p-6">
            <h3 className="text-2xl font-semibold mb-3">{room.type}</h3>
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center text-gray-600">
                <BedDouble className="w-5 h-5 mr-2" />
                <span>{room.number} Rooms available</span>
              </div>
            </div>

            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center text-gray-600">
                <Users className="w-5 h-5 mr-2" />
                <span>Max Guests: {room.maxGuests}</span>
              </div>
              <p className="text-2xl font-bold text-blue-500">₹{room.price}</p>
            </div>
            <label className="flex items-center justify-between bg-gray-100 p-3 rounded-lg cursor-pointer hover:bg-gray-200 transition duration-300">
              <span className="text-gray-700 font-medium">Select Room</span>
              <input
                type="checkbox"
                checked={selectedRooms[room.type] || false}
                onChange={() => handleRoomSelection(room)}
                className="form-checkbox h-5 w-5 text-blue-500"
              />
            </label>
          </div>
        </div>
      ))}
    </div>
  );
};

export default RoomList;

