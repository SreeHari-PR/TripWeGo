import React, { useState, useEffect } from 'react';
import { Wallet, IndianRupee, ArrowUpRight, ArrowDownLeft, Loader, AlertCircle } from 'lucide-react';
import { fetchAdminWallet } from '../../services/Admin/walletService';
import AdminSidebar from '../../components/Admin/Sidebar';

const AdminWallet = () => {
  const [wallet, setWallet] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getWalletData = async () => {
      try {
        setLoading(true);
        const data = await fetchAdminWallet();
        setWallet(data.walletBalance);
        setTransactions(data.transactions);
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    getWalletData();
  }, []);

  if (loading) {
    return (
      <div className="flex h-screen bg-gray-100">
        <div className="w-64">
          <AdminSidebar />
        </div>
        <div className="flex-1 flex items-center justify-center">
          <Loader className="w-12 h-12 text-blue-500 animate-spin" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-screen bg-gray-100">
        <div className="w-64">
          <AdminSidebar />
        </div>
        <div className="flex-1 flex items-center justify-center">
          <div className="text-red-500 flex items-center">
            <AlertCircle className="w-6 h-6 mr-2" />
            <span>{error}</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-100">
      <div className="w-64">
        <AdminSidebar />
      </div>
      <div className="flex-1 overflow-auto">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-6 flex items-center">
            <Wallet className="mr-2" /> Admin Wallet
          </h1>
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h2 className="text-xl font-semibold text-gray-700 mb-4">Wallet Balance</h2>
            <div className="flex items-center">
              <IndianRupee className="text-green-500 w-12 h-12 mr-2" />
              <span className="text-4xl font-bold text-green-600">{wallet.toFixed(2)}</span>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <h2 className="text-xl font-semibold text-gray-700 p-6 bg-gray-50">Transaction History</h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {transactions.length > 0 ? (
                    transactions.map((transaction, index) => (
                      <tr key={index}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(transaction.date).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {transaction.description}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <span className={transaction.type === 'credit' ? 'text-green-600' : 'text-red-600'}>
                            ₹{transaction.amount.toFixed(2)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          {transaction.type === 'credit' ? (
                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                              <ArrowDownLeft className="w-4 h-4 mr-1" /> Credit
                            </span>
                          ) : (
                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                              <ArrowUpRight className="w-4 h-4 mr-1" /> Debit
                            </span>
                          )}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="4" className="px-6 py-4 text-center text-sm text-gray-500">
                        No transactions available
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminWallet;
