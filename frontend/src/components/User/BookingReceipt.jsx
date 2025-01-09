import React from 'react'
import { Calendar, IndianRupee } from 'lucide-react'

const BookingReceipt = ({ booking }) => {
  return (
    <div className="p-8 bg-white max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold text-center mb-8">Booking Receipt</h1>
      
      <div className="mb-8">
        <h2 className="text-2xl font-semibold text-gray-900">{booking.hotelId.name}</h2>
        <p className="text-gray-700 mt-2">Order ID: {booking.orderId}</p>
        <p className="text-gray-700">Payment ID: {booking.paymentId}</p>
        <p className="text-gray-700">Payment Status: {booking.paymentStatus}</p>
      </div>

      <div className="mb-8">
        <h3 className="text-xl font-semibold mb-4">Booking Details</h3>
        <div className="space-y-2">
          <p className="flex items-center text-gray-700">
            <Calendar className="h-5 w-5 mr-2" /> Check-in: {new Date(booking.checkInDate).toLocaleDateString()}
          </p>
          <p className="flex items-center text-gray-700">
            <Calendar className="h-5 w-5 mr-2" /> Check-out: {new Date(booking.checkOutDate).toLocaleDateString()}
          </p>
          <p className="text-gray-700">Room Types: {booking.roomTypes.join(', ')}</p>
        </div>
      </div>

      <div className="mb-8">
        <h3 className="text-xl font-semibold mb-4">Payment Details</h3>
        <p className="flex items-center text-gray-700">
          <IndianRupee className="h-5 w-5 mr-2" /> Total Amount: {booking.amount}
        </p>
      </div>

      <div className="text-sm text-gray-500 mt-8 text-center border-t pt-4">
        <p>This is an electronically generated receipt. No signature is required.</p>
      </div>
    </div>
  )
}

export default BookingReceipt

