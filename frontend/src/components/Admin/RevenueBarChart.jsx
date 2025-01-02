import React, { useMemo } from 'react';
import { Bar, BarChart, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { DollarSign } from 'lucide-react';
import dayjs from 'dayjs';

const RevenueBarChart = ({ bookings }) => {
  const chartData = useMemo(() => {
    const sortedBookings = [...bookings].sort((a, b) => 
      dayjs(a.checkInDate).valueOf() - dayjs(b.checkInDate).valueOf()
    );

    return sortedBookings.map(booking => ({
      date: dayjs(booking.checkInDate).format('MMM DD'),
      revenue: booking.amount,
    }));
  }, [bookings]);

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center mb-4">
        <DollarSign className="w-6 h-6 text-green-500 mr-2" />
        <h2 className="text-xl font-semibold text-gray-800">Revenue by Booking</h2>
      </div>
      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="revenue" fill="#10b981" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default RevenueBarChart;

