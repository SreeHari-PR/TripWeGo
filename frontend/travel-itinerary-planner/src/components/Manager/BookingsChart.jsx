import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { motion } from 'framer-motion';

// Register required Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const BookingsChart = ({ bookings }) => {
  const [timeframe, setTimeframe] = useState('weekly');
  const [chartData, setChartData] = useState({});
  const [chartOptions, setChartOptions] = useState({});

  const groupByWeek = (bookings) => {
    const weeklyData = {};
    bookings.forEach((booking) => {
      const week = `Week ${Math.ceil(new Date(booking.checkInDate).getDate() / 7)}`;
      weeklyData[week] = (weeklyData[week] || 0) + 1;
    });
    return weeklyData;
  };

  const groupByMonth = (bookings) => {
    const monthlyData = {};
    bookings.forEach((booking) => {
      const month = new Date(booking.checkInDate).toLocaleString('default', { month: 'short' });
      monthlyData[month] = (monthlyData[month] || 0) + 1;
    });
    return monthlyData;
  };

  const groupByYear = (bookings) => {
    const yearlyData = {};
    bookings.forEach((booking) => {
      const year = new Date(booking.checkInDate).getFullYear();
      yearlyData[year] = (yearlyData[year] || 0) + 1;
    });
    return yearlyData;
  };

  // Transform Data for Selected Timeframe
  useEffect(() => {
    if (bookings.length > 0) {
      let groupedData = {};
      if (timeframe === 'weekly') groupedData = groupByWeek(bookings);
      else if (timeframe === 'monthly') groupedData = groupByMonth(bookings);
      else if (timeframe === 'yearly') groupedData = groupByYear(bookings);

      const labels = Object.keys(groupedData);
      const data = Object.values(groupedData);

      setChartData({
        labels,
        datasets: [
          {
            label: `Bookings (${timeframe})`,
            data,
            borderColor: 'rgba(75, 192, 192, 1)',
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            tension: 0.4,
            fill: true,
            pointBackgroundColor: 'rgba(75, 192, 192, 1)',
            pointBorderColor: '#fff',
            pointHoverBackgroundColor: '#fff',
            pointHoverBorderColor: 'rgba(75, 192, 192, 1)',
          },
        ],
      });

      setChartOptions({
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { 
            position: 'top',
            labels: {
              font: {
                size: 14,
                weight: 'bold',
              },
              color: '#333',
            },
          },
          title: { 
            display: true, 
            text: `Bookings - ${timeframe.charAt(0).toUpperCase() + timeframe.slice(1)}`,
            font: {
              size: 18,
              weight: 'bold',
            },
            color: '#333',
            padding: 20,
          },
          tooltip: {
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            titleFont: {
              size: 16,
              weight: 'bold',
            },
            bodyFont: {
              size: 14,
            },
            padding: 12,
            cornerRadius: 8,
          },
        },
        scales: {
          x: {
            grid: {
              display: false,
            },
            ticks: {
              font: {
                size: 12,
              },
              color: '#666',
            },
          },
          y: {
            beginAtZero: true,
            grid: {
              color: 'rgba(0, 0, 0, 0.1)',
            },
            ticks: {
              font: {
                size: 12,
              },
              color: '#666',
            },
          },
        },
        animation: {
          duration: 1000,
          easing: 'easeInOutQuart',
        },
      });
    }
  }, [bookings, timeframe]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white p-6 rounded-lg shadow-lg"
    >
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Bookings Chart</h2>
        <select
          value={timeframe}
          onChange={(e) => setTimeframe(e.target.value)}
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5"
        >
          <option value="weekly">Weekly</option>
          <option value="monthly">Monthly</option>
          <option value="yearly">Yearly</option>
        </select>
      </div>
      <div className="h-80">
        {chartData.labels ? (
          <Line data={chartData} options={chartOptions} />
        ) : (
          <p className="text-center text-gray-500 mt-10">No bookings data available</p>
        )}
      </div>
    </motion.div>
  );
};

export default BookingsChart;

