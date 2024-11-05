import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-hot-toast'
import { Wallet, ArrowUpRight, ArrowDownLeft, History, DollarSign, X } from 'lucide-react'
import api from '../../services/api'
import StickyNavbar from '../../components/User/Navbar'
import Navigation from '../../components/User/Navigation'

const WalletPage = () => {
  const [balance, setBalance] = useState(0)
  const [isAddFundsModalOpen, setIsAddFundsModalOpen] = useState(false)
  const [isWithdrawModalOpen, setIsWithdrawModalOpen] = useState(false)
  const [amount, setAmount] = useState('')
  const [transactions, setTransactions] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    const fetchBalanceAndTransactions = async () => {
      const token = localStorage.getItem('token')
      if (!token) {
        setError('Authentication required. Please log in.')
        setLoading(false)
        return
      }

      try {
        const response = await api.get('/users/wallet/balance', {
          headers: {
            Authorization: ` ${token}`,
          },
        })
        setBalance(response.data.balance || 0)
        setTransactions(response.data.transactions || [])
      } catch (error) {
        console.error('Error fetching balance:', error)
        setError('Unable to retrieve wallet data. Please try again later.')
      } finally {
        setLoading(false)
      }
    }
    fetchBalanceAndTransactions()
  }, [])

  const handleAddFunds = async (e) => {
    e.preventDefault()
    const numAmount = parseFloat(amount)

    if (!isNaN(numAmount) && numAmount > 0) {
      try {
        const token = localStorage.getItem('token')
        const response = await api.post(
          '/users/wallet/add-funds',
          { amount: numAmount },
          {
            headers: {
              Authorization: ` ${token}`,
            },
          }
        )

        setBalance(response.data.balance)
        setTransactions((prev) => [response.data.transaction, ...prev])
        setIsAddFundsModalOpen(false)
        setAmount('')
        toast.success('Funds added successfully')
      } catch (error) {
        console.error('Error adding funds:', error)
        toast.error('Unable to add funds. Please try again.')
      }
    } else {
      toast.error('Please enter a valid amount greater than zero.')
    }
  }

  const handleWithdraw = async (e) => {
    e.preventDefault()
    const numAmount = parseFloat(amount)

    if (!isNaN(numAmount) && numAmount > 0 && numAmount <= balance) {
      try {
        const token = localStorage.getItem('token')
        const response = await api.post(
          '/users/wallet/deduct-funds',
          { amount: numAmount },
          {
            headers: {
              Authorization: ` ${token}`,
            },
          }
        )

        setBalance(response.data.newBalance)
        setTransactions((prev) => [response.data.transaction, ...prev])
        setIsWithdrawModalOpen(false)
        setAmount('')
        toast.success('Funds withdrawn successfully')
      } catch (error) {
        console.error('Error withdrawing funds:', error)
        toast.error('Unable to withdraw funds. Please try again.')
      }
    } else {
      toast.error('Please enter a valid amount between 0 and your current balance.')
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('token')
    toast.success('Logged out successfully')
    navigate('/login')
  }

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>
  }

  if (error) {
    return <div className="flex justify-center items-center h-screen text-red-500">{error}</div>
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
            <h1 className="text-3xl font-bold text-gray-800 mb-6 flex items-center">
              <Wallet className="mr-2" /> My Wallet
            </h1>

            {/* Wallet Balance */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <h2 className="text-xl font-semibold text-gray-700 mb-2">Current Balance</h2>
              <div className="flex items-center">
                <DollarSign className="text-green-500 mr-2" size={32} />
                <span className="text-4xl font-bold text-gray-800">{balance}</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <button
                onClick={() => setIsAddFundsModalOpen(true)}
                className="flex items-center justify-center p-4 bg-green-500 text-white rounded-lg hover:bg-green-600 transition duration-300"
              >
                <ArrowDownLeft className="mr-2" /> Add Funds
              </button>
              <button
                onClick={() => setIsWithdrawModalOpen(true)}
                className="flex items-center justify-center p-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-300"
              >
                <ArrowUpRight className="mr-2" /> Withdraw
              </button>
            </div>

            {/* Transaction List */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <h2 className="text-2xl font-semibold text-gray-800 p-6 flex items-center">
                <History className="mr-2" /> Recent Transactions
              </h2>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {transactions.length > 0 ? (
                      transactions.map((transaction, index) => (
                        <tr key={transaction.id || index}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {transaction.type === 'credit' ? (
                              <span className="flex items-center text-green-500">
                                <ArrowDownLeft className="mr-1" size={16} /> Deposit
                              </span>
                            ) : (
                              <span className="flex items-center text-blue-500">
                                <ArrowUpRight className="mr-1" size={16} /> Withdrawal
                              </span>
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`font-medium ${transaction.type === 'credit' ? 'text-green-500' : 'text-blue-500'}`}>
                              ${transaction.amount ? transaction.amount : '0.00'}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {transaction.date || 'N/A'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {transaction.description || 'No description'}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="4" className="px-6 py-4 text-center text-gray-500">No transactions found.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      {isAddFundsModalOpen && (
        <Modal title="Add Funds" onClose={() => setIsAddFundsModalOpen(false)} onSubmit={handleAddFunds} amount={amount} setAmount={setAmount} />
      )}
      {isWithdrawModalOpen && (
        <Modal title="Withdraw Funds" onClose={() => setIsWithdrawModalOpen(false)} onSubmit={handleWithdraw} amount={amount} setAmount={setAmount} maxAmount={balance} />
      )}
    </div>
  )
}

const Modal = ({ title, onClose, onSubmit, amount, setAmount, maxAmount }) => (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
    <div className="bg-white rounded-lg p-6 w-full max-w-md">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-gray-800">{title}</h2>
        <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
          <X size={24} />
        </button>
      </div>
      <form onSubmit={onSubmit}>
        <div className="mb-4">
          <label htmlFor="amount" className="block text-gray-700 font-medium mb-2">Amount</label>
          <input
            type="number"
            id="amount"
            name="amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder={`Enter an amount ${maxAmount ? `(Max: ${maxAmount})` : ''}`}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>
        <button type="submit" className="w-full py-2 px-4 bg-blue-500 text-white font-bold rounded-lg hover:bg-blue-600 transition duration-300">
          Confirm
        </button>
      </form>
    </div>
  </div>
)

export default WalletPage