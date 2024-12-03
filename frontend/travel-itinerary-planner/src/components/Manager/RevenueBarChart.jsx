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

// Register Chart.js modules
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
        console.log(response.data.data,'jskdh')
        setWalletData(response.data.data);
      } catch (err) {
        setError('Failed to fetch wallet and transaction data');
      } finally {
        setLoading(false);
      }
    };

    fetchWalletData();
  }, []);

  // Aggregate Revenue Data
  const aggregateRevenue = (transactions, timeframe = 'monthly') => {
    const groupedData = {};
  
    transactions.forEach((transaction) => {
      if (transaction.transactionType === 'credit') {
        const dateKey =
          timeframe === 'daily'
            ? dayjs(transaction.createdAt).format('YYYY-MM-DD')
            : timeframe === 'weekly'
            ? dayjs(transaction.createdAt).startOf('week').format('YYYY-MM-DD')
            : dayjs(transaction.createdAt).format('YYYY-MM'); // Default: monthly
  
        if (!groupedData[dateKey]) {
          groupedData[dateKey] = 0;
        }
        groupedData[dateKey] += transaction.amount;
      }
    });
  
    return groupedData;
  };

  // Prepare Chart Data
  useEffect(() => {
    if (walletData?.transactions) {
      const groupedData = aggregateRevenue(walletData.transactions, timeframe);
      const labels = Object.keys(groupedData);
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
          legend: { position: 'top' },
          title: { display: true, text: `Revenue - ${timeframe.charAt(0).toUpperCase() + timeframe.slice(1)}` },
        },
        scales: {
          y: { beginAtZero: true },
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
      {chartData?.datasets?.length > 0 ? (
  <Bar data={chartData} options={chartOptions} />
) : (
  <p>No data available</p>
)}
    </div>
  );
};

export default RevenueBarChart;
