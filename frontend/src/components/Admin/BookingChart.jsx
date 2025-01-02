import React, { useMemo } from 'react';
import { Line, LineChart, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { TrendingUp } from 'lucide-react';
import dayjs from 'dayjs';

const BookingChart = ({ bookings }) => {
  const chartData = useMemo(() => {
    const sortedBookings = [...bookings].sort((a, b) => 
      dayjs(a.checkInDate).valueOf() - dayjs(b.checkInDate).valueOf()
    );

    return sortedBookings.map(booking => ({
      date: dayjs(booking.checkInDate).format('MMM DD'),
      bookings: 1,
    }));
  }, [bookings]);

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center mb-4">
        <TrendingUp className="w-6 h-6 text-blue-500 mr-2" />
        <h2 className="text-xl font-semibold text-gray-800">Booking Trend</h2>
      </div>
      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="bookings" stroke="#3b82f6" activeDot={{ r: 8 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default BookingChart;

