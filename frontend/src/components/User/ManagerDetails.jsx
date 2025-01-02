import React from 'react';

const ManagerDetails = ({ manager }) => {
  if (!manager) {
    return <p className="text-gray-500">Manager details are not available.</p>;
  }

  const handleSendMessage = () => {
    alert(`Send a message to ${manager.name}`);
    
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-6 max-w-sm mx-auto border border-gray-200">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Manager Details</h2>
      <div className="space-y-2">
        <p className="text-gray-600">
          <span className="font-medium">Name:</span> {manager.name}
        </p>
        <p className="text-gray-600">
          <span className="font-medium">Email:</span> {manager.email}
        </p>
      </div>
      <button
        onClick={handleSendMessage}
        className="mt-4 w-full bg-blue-500 text-white font-medium py-2 px-4 rounded hover:bg-blue-600 transition duration-300"
      >
        Send Message
      </button>
    </div>
  );
};

export default ManagerDetails;
