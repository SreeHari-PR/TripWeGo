import React, { useEffect, useState } from 'react'
import { toast } from 'react-hot-toast'
import { Calendar, DollarSign, Hotel, Loader2} from 'lucide-react'
import Navigation from '../../components/User/Navigation'
import StickyNavbar from '../../components/User/Navbar'
import Swal from 'sweetalert2'
import api from '../../services/api'


const BookingsPage = () => {
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const token = localStorage.getItem('token')
        if (!token) {
          toast.error('User not authenticated')
          return
        }
        const response = await api.get('/users/bookings', {
          headers: {
            Authorization: `${token}`,
          },
        })
        setBookings(response.data.bookings)
        console.log(response.data.bookings)
      } catch (error) {
        toast.error(error.response?.data?.message || 'Failed to load bookings')
      } finally {
        setLoading(false)
      }
    }

    fetchBookings()
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('token')
    toast.success('Logged out successfully')
    // Redirect to login page or update app state
  }

  const handleCancelBooking = async (bookingId) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: 'Do you want to cancel this booking?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, cancel it!',
    })

    if (result.isConfirmed) {
      try {
        const token = localStorage.getItem('token')
        if (!token) {
          toast.error('User not authenticated')
          return
        }
        await api.delete(`/users/bookings/${bookingId}/cancel`, {
          headers: {
            Authorization: ` ${token}`,
          },
        })
        setBookings((prevBookings) => prevBookings.filter((booking) => booking._id !== bookingId))
        Swal.fire('Cancelled!', 'Your booking has been cancelled.', 'success')
      } catch (error) {
        Swal.fire('Error!', error.response?.data?.message || 'Failed to cancel booking', 'error')
      }
    }
  }
  
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <Loader2 className="animate-spin h-12 w-12 text-[#00246B]" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <StickyNavbar />
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-1">
            <Navigation onLogout={handleLogout} />
          </div>
          <div className="md:col-span-3">
            <h1 className="text-3xl font-bold text-[#00246B] mb-6">My Bookings</h1>
            {bookings.length === 0 ? (
              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                  <div className="text-center">
                    <Hotel className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-2 text-sm font-medium text-gray-900">No bookings</h3>
                    <p className="mt-1 text-sm text-gray-500">Get started by booking a hotel room.</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                {bookings.map((booking) => (
                  <div key={booking._id} className="bg-white overflow-hidden shadow rounded-lg">
                    <div className="px-4 py-5 sm:p-6">
                      <div className="flex items-center justify-between mb-4">
                        <h2 className="text-xl font-semibold text-[#00246B]">{booking.hotelId.name}</h2>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          booking.paymentStatus === 'Paid' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {booking.paymentStatus}
                        </span>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-gray-500">Room Type</p>
                          <p className="mt-1 text-sm font-medium text-gray-900">{booking.roomType}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Price</p>
                          <p className="mt-1 text-sm font-medium text-gray-900 flex items-center">
                            <DollarSign className="h-4 w-4 text-[#00246B] mr-1" />
                            {booking.amount}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Check-in</p>
                          <p className="mt-1 text-sm font-medium text-gray-900 flex items-center">
                            <Calendar className="h-4 w-4 text-[#00246B] mr-1" />
                            {new Date(booking.checkInDate).toLocaleDateString()}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Check-out</p>
                          <p className="mt-1 text-sm font-medium text-gray-900 flex items-center">
                            <Calendar className="h-4 w-4 text-[#00246B] mr-1" />
                            {new Date(booking.checkOutDate).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="mt-4 bg-gray-50 rounded-md p-4">
                        <p className="text-sm text-gray-500">Order ID: <span className="font-medium text-gray-900">{booking.orderId}</span></p>
                        <p className="mt-1 text-sm text-gray-500">Payment ID: <span className="font-medium text-gray-900">{booking.paymentId}</span></p>
                      </div>
                      <div className="mt-6">
                        <button
                          onClick={() => handleCancelBooking(booking._id)}
                          className="w-full bg-[#00246B] text-white font-medium py-2 px-4 rounded-md hover:bg-[#001d3d] transition duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-[#00246B] focus:ring-opacity-50"
                        >
                          Cancel Booking
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default BookingsPage