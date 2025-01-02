import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import dayjs from 'dayjs';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import api from '../../services/api';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const RevenueBarChart = () => {
  const [walletData, setWalletData] = useState(null);
  const [timeframe, setTimeframe] = useState('weekly');
  const [chartData, setChartData] = useState({});
  const [chartOptions, setChartOptions] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Fetch Wallet Data
  useEffect(() => {
    const fetchWalletData = async () => {
      try {
        const manager = JSON.parse(localStorage.getItem('managerData') || '{}');
        const managerId = manager?._id;
        setLoading(true);
        const response = await api.get(`/manager/wallet-transactions/${managerId}`);
        setWalletData(response.data.data);
      } catch (err) {
        setError('Failed to fetch wallet and transaction data');
      } finally {
        setLoading(false);
      }
    };

    fetchWalletData();
  }, []);

  // Sort function for dates
  const sortDates = (a, b) => dayjs(a).valueOf() - dayjs(b).valueOf();

  // Aggregate Revenue Data with proper sorting
  const aggregateRevenue = (transactions, timeframe = 'monthly') => {
    const groupedData = {};
  
    // First, group the data
    transactions.forEach((transaction) => {
      if (transaction.transactionType === 'credit') {
        let dateKey;
        const date = dayjs(transaction.createdAt);
        
        switch (timeframe) {
          case 'daily':
            dateKey = date.format('YYYY-MM-DD');
            break;
          case 'weekly':
            dateKey = date.startOf('week').format('YYYY-MM-DD');
            break;
          case 'monthly':
            dateKey = date.format('YYYY-MM');
            break;
          case 'yearly':
            dateKey = date.format('YYYY');
            break;
          default:
            dateKey = date.format('YYYY-MM-DD');
        }
  
        if (!groupedData[dateKey]) {
          groupedData[dateKey] = 0;
        }
        groupedData[dateKey] += transaction.amount;
      }
    });
  
    // Sort the data chronologically
    const sortedEntries = Object.entries(groupedData)
      .sort(([dateA], [dateB]) => sortDates(dateA, dateB));
    
    return Object.fromEntries(sortedEntries);
  };

  // Format labels based on timeframe
  const formatLabel = (dateStr, timeframe) => {
    const date = dayjs(dateStr);
    switch (timeframe) {
      case 'daily':
        return date.format('MMM D');
      case 'weekly':
        return `Week ${date.format('MM/DD')}`;
      case 'monthly':
        return date.format('MMM YYYY');
      case 'yearly':
        return date.format('YYYY');
      default:
        return dateStr;
    }
  };

  // Prepare Chart Data
  useEffect(() => {
    if (walletData?.transactions) {
      const groupedData = aggregateRevenue(walletData.transactions, timeframe);
      const labels = Object.keys(groupedData).map(date => formatLabel(date, timeframe));
      const data = Object.values(groupedData);

      setChartData({
        labels,
        datasets: [
          {
            label: `Revenue (${timeframe})`,
            data,
            backgroundColor: 'rgba(75, 192, 192, 0.5)',
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 1,
          },
        ],
      });

      setChartOptions({
        responsive: true,
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
            text: `Revenue - ${timeframe.charAt(0).toUpperCase() + timeframe.slice(1)}`,
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
              callback: (value) => `$${value.toLocaleString()}`,
            },
          },
        },
      });
    }
  }, [walletData, timeframe]);

  return (
    <div className="p-6 bg-white rounded-lg shadow">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-bold text-gray-700">Revenue Bar Chart</h2>
        <select
          value={timeframe}
          onChange={(e) => setTimeframe(e.target.value)}
          className="border border-gray-300 rounded px-3 py-1"
        >
          <option value="weekly">Weekly</option>
          <option value="monthly">Monthly</option>
          <option value="yearly">Yearly</option>
        </select>
      </div>
      {loading ? (
        <p className="text-center text-gray-500">Loading...</p>
      ) : error ? (
        <p className="text-center text-red-500">{error}</p>
      ) : chartData?.datasets?.length > 0 ? (
        <Bar data={chartData} options={chartOptions} />
      ) : (
        <p className="text-center text-gray-500">No data available</p>
      )}
    </div>
  );
};

export default RevenueBarChart;

