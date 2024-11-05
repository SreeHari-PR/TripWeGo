import React, { useEffect, useState } from 'react'
import { Wallet, DollarSign, ArrowUpRight, ArrowDownLeft, Loader } from 'lucide-react'
import api from '../../services/api'
import { Sidebar } from '../../components/Manager/ManagerSidebar'
import { Navbar } from '../../components/Manager/ManagerNavbar'

const ManagerWallet = () => {
  const [walletData, setWalletData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [sidebarOpen, setSidebarOpen] = useState(false)

  useEffect(() => {
    const fetchWalletData = async () => {
      try {
        const manager = JSON.parse(localStorage.getItem('managerData') || '{}')
        const managerId = manager?._id
        setLoading(true)
        const response = await api.get(`/manager/wallet-transactions/${managerId}`)
        setWalletData(response.data.data)
      } catch (err) {
        setError('Failed to fetch wallet and transaction data')
      } finally {
        setLoading(false)
      }
    }
    fetchWalletData()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <Loader className="w-12 h-12 text-blue-500 animate-spin" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <div className="text-red-500 text-xl font-semibold">{error}</div>
      </div>
    )
  }

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100">
          <div className="container mx-auto px-6 py-8">
            <h1 className="text-3xl font-semibold text-gray-800 mb-6">Manager Wallet</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-semibold text-gray-700 mb-4 flex items-center">
                  <Wallet className="mr-2 text-blue-500" /> Wallet Balance
                </h2>
                <div className="flex items-center">
                  <DollarSign className="text-green-500 w-12 h-12 mr-2" />
                  <span className="text-4xl font-bold text-green-600">
                    {walletData?.walletBalance.toFixed(2)}
                  </span>
                </div>
              </div>
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-semibold text-gray-700 mb-4">Quick Stats</h2>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-blue-100 rounded-lg p-4">
                    <p className="text-sm text-blue-600 mb-1">Total Transactions</p>
                    <p className="text-2xl font-semibold text-blue-800">
                      {walletData?.transactions.length}
                    </p>
                  </div>
                  <div className="bg-green-100 rounded-lg p-4">
                    <p className="text-sm text-green-600 mb-1">Last Transaction</p>
                    <p className="text-2xl font-semibold text-green-800">
                      ${walletData?.transactions[0]?.amount.toFixed(2) || '0.00'}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">Transaction History</h2>
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Date
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Type
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Amount
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Description
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {walletData?.transactions.length ? (
                        walletData.transactions.map((transaction) => (
                          <tr key={transaction._id}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {new Date(transaction.date).toLocaleDateString()}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
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
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                              <span
                                className={
                                  transaction.type === 'credit'
                                    ? 'text-green-600'
                                    : 'text-red-600'
                                }
                              >
                                ${transaction.amount.toFixed(2)}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {transaction.description || 'N/A'}
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td
                            colSpan={4}
                            className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center"
                          >
                            No transactions found
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

export default ManagerWallet