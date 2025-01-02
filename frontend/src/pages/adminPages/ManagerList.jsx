import React, { useState, useEffect } from 'react'
import { Search, Eye, Lock, Unlock, X, Check, User, Mail, FileText, CreditCard } from 'lucide-react'
import Swal from 'sweetalert2'
import api from '../../services/api'
import AdminSidebar from '../../components/Admin/Sidebar'

export default function AdminManagerList() {
  const [managers, setManagers] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedManager, setSelectedManager] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [loadingDetails, setLoadingDetails] = useState(false)

  useEffect(() => {
    fetchManagers()
  }, [])

  const fetchManagers = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await api.get('/admin/managers', {
        headers: {
          Authorization: `${token}`
        }
      })
      setManagers(response.data)
    } catch (error) {
      console.error('Error fetching managers:', error)
    }
  }

  const handleSearch = (event) => {
    setSearchTerm(event.target.value)
  }

  const filteredManagers = managers.filter((manager) =>
    manager.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    manager.email.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleViewDetails = async (manager) => {
    try {
      setLoadingDetails(true)
      const response = await api.get(`/admin/managers/${manager._id}`)
      setSelectedManager(response.data)
      setIsModalOpen(true)
      setLoadingDetails(false)
    } catch (error) {
      console.error('Error fetching manager details:', error)
      setLoadingDetails(false)
    }
  }

  const handleApprove = async (managerId) => {
    try {
      await api.post(`/admin/managers/${managerId}/approve`)
      setSelectedManager({ ...selectedManager, approved: true })
      Swal.fire('Success', 'Manager approved successfully.', 'success')
      fetchManagers()
    } catch (error) {
      console.error('Error approving manager:', error)
      Swal.fire('Error', 'Failed to approve manager.', 'error')
    }
  }

  const handleBlockUnblock = async (managerId, currentBlockedStatus) => {
    const action = currentBlockedStatus ? 'unblock' : 'block'
    const confirmResult = await Swal.fire({
      title: `Are you sure you want to ${action} this manager?`,
      text: `This will ${action} the manager's access to the system.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: `Yes, ${action} it!`
    })

    if (confirmResult.isConfirmed) {
      try {
        await api.post(`/admin/managers/${action}`, {
          managerId 
        })

        Swal.fire('Success', `Manager ${action}ed successfully.`, 'success')
        fetchManagers()
        if (selectedManager && selectedManager._id === managerId) {
          setSelectedManager({
            ...selectedManager,
            isBlocked: !currentBlockedStatus
          })
        }

      } catch (error) {
        console.error(`Error ${action}ing manager:`, error)
        Swal.fire('Error', `Failed to ${action} manager.`, 'error')
      }
    }
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setSelectedManager(null)
  }

  const getStatusColor = (isBlocked) => {
    return isBlocked ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
  }

  return (
    <div className="flex h-screen bg-gray-100">
      <div className="w-64">
        <AdminSidebar />
      </div>
      <div className="flex-grow p-8 overflow-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Manager List</h1>
        <div className="mb-4 flex justify-between items-center">
          <div className="relative">
            <input
              type="text"
              placeholder="Search managers..."
              className="pl-10 pr-4 py-2 w-64 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={searchTerm}
              onChange={handleSearch}
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          </div>
        </div>
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                {['Name', 'Email', 'Approved', 'Status', 'Actions'].map((header) => (
                  <th key={header} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredManagers.map((manager) => (
                <tr key={manager._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{manager.name}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{manager.email}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{manager.approved ? 'Yes' : 'No'}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(manager.isBlocked)}`}>
                      {manager.isBlocked ? 'Blocked' : 'Active'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button 
                      className="text-blue-600 hover:text-blue-900 mr-4" 
                      onClick={() => handleViewDetails(manager)}
                    >
                      <Eye size={20} />
                    </button>
                    <button
                      className={manager.isBlocked ? "text-green-600 hover:text-green-900" : "text-red-600 hover:text-red-900"}
                      onClick={() => handleBlockUnblock(manager._id, manager.isBlocked)}
                    >
                      {manager.isBlocked ? <Unlock size={20} /> : <Lock size={20} />}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {isModalOpen && selectedManager && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-5xl">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-gray-800">Manager Details</h2>
                <button onClick={closeModal} className="text-gray-500 hover:text-gray-700">
                  <X size={24} />
                </button>
              </div>
              {loadingDetails ? (
                <p className="text-center">Loading...</p>
              ) : (
                <div className="flex flex-col md:flex-row gap-6">
                  <div className="md:w-1/3 space-y-4">
                    <div className="bg-gray-100 p-4 rounded-lg">
                      <div className="flex items-center space-x-3 mb-2">
                        <User size={20} />
                        <span className="font-semibold">{selectedManager.name}</span>
                      </div>
                      <div className="flex items-center space-x-3 mb-2">
                        <Mail size={20} />
                        <span>{selectedManager.email}</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Lock size={20} />
                        <span className={`px-2 py-1 rounded-full text-sm ${getStatusColor(selectedManager.isBlocked)}`}>
                          {selectedManager.isBlocked ? 'Blocked' : 'Active'}
                        </span>
                      </div>
                    </div>
                    <div className="flex flex-col space-y-2">
                      {!selectedManager.approved && (
                        <button
                          onClick={() => handleApprove(selectedManager._id)}
                          className="bg-green-500 text-white hover:bg-green-600 py-2 px-4 rounded-md flex items-center justify-center"
                        >
                          <Check size={20} className="mr-2" />
                          Approve Manager
                        </button>
                      )}
                      <button
                        onClick={() => handleBlockUnblock(selectedManager._id, selectedManager.isBlocked)}
                        className={`${selectedManager.isBlocked ? 'bg-green-500 hover:bg-green-600' : 'bg-red-500 hover:bg-red-600'} text-white py-2 px-4 rounded-md flex items-center justify-center`}
                      >
                        {selectedManager.isBlocked ? <Unlock size={20} className="mr-2" /> : <Lock size={20} className="mr-2" />}
                        {selectedManager.isBlocked ? 'Unblock Manager' : 'Block Manager'}
                      </button>
                    </div>
                  </div>
                  <div className="md:w-2/3 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h3 className="font-semibold mb-2 flex items-center">
                        <CreditCard size={20} className="mr-2" />
                        License
                      </h3>
                      <img
                        src={selectedManager.license}
                        alt="Manager License"
                        className="rounded-md w-full h-48 object-cover"
                      />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-2 flex items-center">
                        <FileText size={20} className="mr-2" />
                        KYC
                      </h3>
                      <img
                        src={selectedManager.kyc}
                        alt="Manager KYC"
                        className="rounded-md w-full h-48 object-cover"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}