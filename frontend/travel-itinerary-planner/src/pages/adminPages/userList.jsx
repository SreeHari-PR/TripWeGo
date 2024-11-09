import React, { useEffect, useState } from 'react';
import { FiUser, FiLock, FiUnlock, FiChevronLeft, FiChevronRight, FiAlertTriangle } from 'react-icons/fi';
import { AlertCircle, CheckCircle } from 'lucide-react';
import AdminSidebar from '../../components/Admin/Sidebar';
import api from '../../services/api';
const UserList = () => {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [totalCount, setTotalCount] = useState(0);
  const [toast, setToast] = useState(null);
  const [confirmModal, setConfirmModal] = useState({ isOpen: false, userId: null, action: null });

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const response = await api.get('/admin/users', {
          headers: {
            Authorization: ` ${localStorage.getItem('token')}`,
          },
          params: {
            page: currentPage,
            limit: itemsPerPage,
          },
        });
        setUsers(response.data);
        setTotalCount(response.data.length);
        setError('');
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch users');
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, [currentPage, itemsPerPage]);

  const handleBlockUser = async (id) => {
    try {
      await api.put(`/users/${id}/block`, {}, {
        headers: {
          Authorization: `${localStorage.getItem('token')}`,
        },
      });
      setUsers(users.map(user => user._id === id ? { ...user, isBlocked: true } : user));
      showToast('User Blocked', 'The user has been successfully blocked.', 'success');
    } catch (err) {
      showToast('Error', err.response?.data?.message || 'Failed to block user', 'error');
    }
  };

  const handleUnblockUser = async (id) => {
    try {
      await api.put(`/users/${id}/unblock`, {}, {
        headers: {
          Authorization: ` ${localStorage.getItem('token')}`,
        },
      });
      setUsers(users.map(user => user._id === id ? { ...user, isBlocked: false } : user));
      showToast('User Unblocked', 'The user has been successfully unblocked.', 'success');
    } catch (err) {
      showToast('Error', err.response?.data?.message || 'Failed to unblock user', 'error');
    }
  };

  const showToast = (title, message, type) => {
    setToast({ title, message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const openConfirmModal = (userId, action) => {
    setConfirmModal({ isOpen: true, userId, action });
  };

  const closeConfirmModal = () => {
    setConfirmModal({ isOpen: false, userId: null, action: null });
  };

  const handleConfirm = () => {
    if (confirmModal.action === 'block') {
      handleBlockUser(confirmModal.userId);
    } else {
      handleUnblockUser(confirmModal.userId);
    }
    closeConfirmModal();
  };

  const totalPages = Math.max(1, Math.ceil(users.length / itemsPerPage));

  return (
    <div className="flex h-screen bg-gray-100">
     <div className="w-64">
                <AdminSidebar />
            </div>
      <div className="flex-1 flex flex-col overflow-hidden">
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-200">
          <div className="container mx-auto px-6 py-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-6">User Management</h1>
            {loading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
              </div>
            ) : error ? (
              <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4" role="alert">
                <p className="font-bold">Error</p>
                <p>{error}</p>
              </div>
            ) : (
              <>
                <div className="bg-white shadow-md rounded-lg overflow-hidden">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    {users && users.length > 0 ? (
                      <tbody className="bg-white divide-y divide-gray-200">
                        {users.map(user => (
                          <tr key={user._id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <div className="flex-shrink-0 h-10 w-10">
                                  <FiUser className="h-10 w-10 rounded-full text-gray-400" />
                                </div>
                                <div className="ml-4">
                                  <div className="text-sm font-medium text-gray-900">{user.name}</div>
                                  <div className="text-sm text-gray-500">{user.email}</div>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${user.isBlocked ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
                                {user.isBlocked ? 'Blocked' : 'Active'}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                              <button
                                onClick={() => openConfirmModal(user._id, user.isBlocked ? 'unblock' : 'block')}
                                className={`inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md shadow-sm ${user.isBlocked ? 'text-white bg-green-600 hover:bg-green-700' : 'text-white bg-red-600 hover:bg-red-700'} focus:outline-none focus:ring-2 focus:ring-offset-2 ${user.isBlocked ? 'focus:ring-green-500' : 'focus:ring-red-500'}`}
                              >
                                {user.isBlocked ? (
                                  <>
                                    <FiUnlock className="mr-2 h-4 w-4" />
                                    Unblock
                                  </>
                                ) : (
                                  <>
                                    <FiLock className="mr-2 h-4 w-4" />
                                    Block
                                  </>
                                )}
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    ) : (
                      <tbody>
                        <tr>
                          <td colSpan="3" className="px-6 py-4 text-center text-gray-500">
                            No users found
                          </td>
                        </tr>
                      </tbody>
                    )}
                  </table>
                </div>
                <div className="flex items-center justify-between mt-4">
                  <div className="flex items-center">
                    <span className="mr-2">Rows per page:</span>
                    <select
                      value={itemsPerPage}
                      onChange={(e) => {
                        setItemsPerPage(Number(e.target.value));
                        setCurrentPage(1);
                      }}
                      className="border border-gray-300 rounded-md text-gray-600 h-8 pl-5 pr-10 bg-white hover:border-gray-400 focus:outline-none appearance-none"
                    >
                      {[5, 10, 20, 30, 40, 50].map((pageSize) => (
                        <option key={pageSize} value={pageSize}>
                          {pageSize}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="flex items-center">
                    <span className="mr-2">
                      Page {currentPage} of {totalPages}
                    </span>
                    <button
                      onClick={() => setCurrentPage((old) => Math.max(old - 1, 1))}
                      disabled={currentPage === 1}
                      className="mr-2 px-2 py-1 border border-gray-300 rounded-md disabled:opacity-50"
                    >
                      <FiChevronLeft className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => setCurrentPage((old) => Math.min(old + 1, totalPages))}
                      disabled={currentPage === totalPages}
                      className="px-2 py-1 border border-gray-300 rounded-md disabled:opacity-50"
                    >
                      <FiChevronRight className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </main>
      </div>
      {toast && (
        <div className={`fixed bottom-4 right-4 px-4 py-2 rounded-md ${toast.type === 'success' ? 'bg-green-500' : 'bg-red-500'} text-white flex items-center`}>
          {toast.type === 'success' ? <CheckCircle className="mr-2" /> : <AlertCircle className="mr-2" />}
          <div>
            <h3 className="font-bold">{toast.title}</h3>
            <p>{toast.message}</p>
          </div>
        </div>
      )}
      {confirmModal.isOpen && (
        <div className="fixed z-10 inset-0 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true"></div>
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                    <FiAlertTriangle className="h-6 w-6 text-red-600" aria-hidden="true" />
                  </div>
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <h3 className="text-lg leading-6 font-medium text-gray-900" id="modal-title">
                      {confirmModal.action === 'block' ? 'Block User' : 'Unblock User'}
                    </h3>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">
                        Are you sure you want to {confirmModal.action} this user? This action cannot be undone.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  className={`w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 ${
                    confirmModal.action === 'block' ? 'bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700'
                  } text-base font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                    confirmModal.action === 'block' ? 'focus:ring-red-500' : 'focus:ring-green-500'
                  } sm:ml-3 sm:w-auto sm:text-sm`}
                  onClick={handleConfirm}
                >
                  {confirmModal.action === 'block' ? 'Block' : 'Unblock'}
                </button>
                <button
                  type="button"
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={closeConfirmModal}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserList;