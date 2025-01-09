import React, { useEffect, useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-hot-toast'
import { jsPDF } from 'jspdf'
import html2canvas from 'html2canvas'
import { Calendar, IndianRupee, Hotel, Loader2, QrCode, AlertTriangle, Download, ChevronLeft, ChevronRight } from 'lucide-react'
import Navigation from '../../components/User/Navigation'
import StickyNavbar from '../../components/User/Navbar'
import Swal from 'sweetalert2'
import { getBookings, cancelBooking } from '../../services/User/bookingService'
import { QRCodeSVG } from 'qrcode.react'
import BookingReceipt from '../../components/User/BookingReceipt'

const BookingsPage = () => {
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedBooking, setSelectedBooking] = useState(null)
  const navigate = useNavigate()
  const receiptRefs = useRef({})

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1)
  const [bookingsPerPage] = useState(3)

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const token = localStorage.getItem('token')
        if (!token) {
          toast.error('User not authenticated')
          return
        }
        const bookingsData = await getBookings(token)
        setBookings(bookingsData)
      } catch (error) {
        toast.error(error)
      } finally {
        setLoading(false)
      }
    }

    fetchBookings()
  }, [])

  // Get current bookings
  const indexOfLastBooking = currentPage * bookingsPerPage
  const indexOfFirstBooking = indexOfLastBooking - bookingsPerPage
  const currentBookings = bookings.slice(indexOfFirstBooking, indexOfLastBooking)

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber)

  const handleLogout = () => {
    localStorage.removeItem('token')
    toast.success('Logged out successfully')
  }

  const handleCancelBooking = async (booking) => {
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: 'btn btn-success',
        cancelButton: 'btn btn-danger'
      },
      buttonsStyling: false
    })

    swalWithBootstrapButtons.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, cancel it!',
      cancelButtonText: 'No, cancel!',
      reverseButtons: true
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const token = localStorage.getItem('token')
          await cancelBooking(booking._id, token)
          const updatedBookings = bookings.filter((b) => b._id !== booking._id)
          setBookings(updatedBookings)
          toast.success('Booking cancelled successfully')
        } catch (error) {
          toast.error(error)
        }
      }
    })
  }

  const generateQRCodeData = (booking) => {
    return `${booking.orderId}-${booking.paymentId}`
  }

  const handleShowQRCode = (booking) => {
    setSelectedBooking(booking)
  }

  const handleCloseQRCode = () => {
    setSelectedBooking(null)
  }

  const handleChatNavigation = (bookingId) => {
    navigate(`/chat/${bookingId}`)
  }

  const handleDownloadReceipt = async (booking) => {
    const receiptElement = receiptRefs.current[booking._id]
    if (!receiptElement) {
      toast.error('Could not generate receipt')
      return
    }

    try {
      receiptElement.style.visibility = 'visible'
      const canvas = await html2canvas(receiptElement)
      receiptElement.style.visibility = 'hidden'

      const imgData = canvas.toDataURL('image/png')
      const pdf = new jsPDF()
      const pdfWidth = pdf.internal.pageSize.getWidth()
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width

      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight)
      pdf.save(`booking-receipt-${booking.orderId}.pdf`)
      toast.success('Receipt downloaded successfully')
    } catch (error) {
      console.error('Error generating PDF:', error)
      toast.error('Error generating PDF')
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
                {currentBookings.map((booking) => (
                  <div key={booking._id} className="bg-white overflow-hidden shadow rounded-lg">
                    <div className="px-4 py-5 sm:p-6">
                      <div className="flex items-center justify-between mb-4">
                        <h2 className="text-xl font-semibold text-[#00246B]">{booking.hotelId.name}</h2>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${booking.paymentStatus === 'Paid' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                          }`}>
                          {booking.paymentStatus}
                        </span>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-gray-500">Room Types</p>
                          {booking.roomTypes && booking.roomTypes.length > 0 ? (
                            <ul className="mt-1 text-sm font-medium text-gray-900 list-disc pl-5">
                              {booking.roomTypes.map((roomType, index) => (
                                <li key={index}>{roomType}</li>
                              ))}
                            </ul>
                          ) : (
                            <p className="mt-1 text-sm font-medium text-gray-900">No room types available</p>
                          )}
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Price</p>
                          <p className="mt-1 text-sm font-medium text-gray-900 flex items-center">
                            <IndianRupee className="h-4 w-4 text-[#00246B] mr-1" />
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
                      <div className="mt-4 bg-yellow-50 border border-yellow-100 rounded-md p-4">
                        <div className="flex items-center">
                          <AlertTriangle className="h-5 w-5 text-yellow-400 mr-2" />
                          <p className="text-sm text-yellow-700">
                            <span className="font-medium">Cancellation Policy:</span> Free cancellation up to 7 days before check-in. 50% refund up to 3 days before check-in. No refund after that.
                          </p>
                        </div>
                      </div>
                      <div className="mt-6 grid grid-cols-1 sm:grid-cols-4 gap-4">
                        <button
                          onClick={() => handleCancelBooking(booking)}
                          className="bg-[#00246B] text-white font-medium py-2 px-4 rounded-md hover:bg-[#001d3d] transition duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-[#00246B] focus:ring-opacity-50"
                        >
                          Cancel Booking
                        </button>
                        <button
                          onClick={() => handleShowQRCode(booking)}
                          className="bg-white text-[#00246B] font-medium py-2 px-4 rounded-md border border-[#00246B] hover:bg-gray-50 transition duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-[#00246B] focus:ring-opacity-50"
                        >
                          <QrCode className="inline-block mr-2" />
                          Show QR Code
                        </button>
                        <button
                          onClick={() => handleChatNavigation(booking._id)}
                          className="bg-green-500 text-white font-medium py-2 px-4 rounded-md hover:bg-green-600 transition duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50"
                        >
                          Chat about booking
                        </button>
                        <button
                          onClick={() => handleDownloadReceipt(booking)}
                          className="bg-white text-[#00246B] font-medium py-2 px-4 rounded-md border border-[#00246B] hover:bg-gray-50 transition duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-[#00246B] focus:ring-opacity-50"
                        >
                          <Download className="inline-block mr-2" />
                          Download Receipt
                        </button>
                      </div>
                    </div>
                    <div
                      ref={(el) => (receiptRefs.current[booking._id] = el)}
                      style={{ visibility: 'hidden', position: 'absolute', zIndex: -1 }}
                    >
                      <BookingReceipt booking={booking} />
                    </div>
                  </div>
                ))}
                {/* Pagination */}
                <div className="flex justify-between items-center mt-6">
                  <button
                    onClick={() => paginate(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ChevronLeft className="w-5 h-5 mr-2" />
                    Previous
                  </button>
                  <span className="text-sm text-gray-700">
                    Page {currentPage} of {Math.ceil(bookings.length / bookingsPerPage)}
                  </span>
                  <button
                    onClick={() => paginate(currentPage + 1)}
                    disabled={currentPage === Math.ceil(bookings.length / bookingsPerPage)}
                    className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                    <ChevronRight className="w-5 h-5 ml-2" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      {selectedBooking && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 max-w-sm w-full">
            <h3 className="text-lg font-semibold text-[#00246B] mb-4">Booking QR Code</h3>
            <div className="flex justify-center mb-4">
              <QRCodeSVG value={generateQRCodeData(selectedBooking)} size={200} />
            </div>
            <p className="text-sm text-gray-500 mb-4 text-center">
              Scan this QR code to view your booking details
            </p>
            <button
              onClick={handleCloseQRCode}
              className="w-full bg-[#00246B] text-white font-medium py-2 px-4 rounded-md hover:bg-[#001d3d] transition duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-[#00246B] focus:ring-opacity-50"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default BookingsPage

