import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import Swal from 'sweetalert2';
import AdminSidebar from '../../components/Admin/Sidebar';
import { FiUser, FiLock, FiUnlock, FiAlertCircle, FiCheckCircle } from 'react-icons/fi';

const UserList = () => {
    const [users, setUsers] = useState([]);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await api.get('/admin/users', {
                    headers: {
                        Authorization: ` ${localStorage.getItem('token')}`,
                    },
                });
                setUsers(response.data);
            } catch (err) {
                setError(err.response?.data || 'Failed to fetch users');
            } finally {
                setLoading(false);
            }
        };
        fetchUsers();
    }, []);

    const handleBlockUser = async (id) => {
        const result = await Swal.fire({
            title: 'Are you sure?',
            text: 'You are about to block this user!',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#EF4444',
            cancelButtonColor: '#6B7280',
            confirmButtonText: 'Yes, block it!',
        });

        if (result.isConfirmed) {
            try {
                await api.put(`/users/${id}/block`, {}, {
                    headers: {
                        Authorization: `${localStorage.getItem('token')}`,
                    },
                });
                setUsers(users.map(user => user._id === id ? { ...user, isBlocked: true } : user));
                Swal.fire({
                    icon: 'success',
                    title: 'Blocked!',
                    text: 'The user has been blocked.',
                    confirmButtonColor: '#10B981',
                });
            } catch (err) {
                Swal.fire({
                    icon: 'error',
                    title: 'Error!',
                    text: err.response?.data || 'Failed to block user',
                    confirmButtonColor: '#EF4444',
                });
            }
        }
    };

    const handleUnblockUser = async (id) => {
        const result = await Swal.fire({
            title: 'Are you sure?',
            text: 'You are about to unblock this user!',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#10B981',
            cancelButtonColor: '#6B7280',
            confirmButtonText: 'Yes, unblock it!',
        });

        if (result.isConfirmed) {
            try {
                await api.put(`/users/${id}/unblock`, {}, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                });
                setUsers(users.map(user => user._id === id ? { ...user, isBlocked: false } : user));
                Swal.fire({
                    icon: 'success',
                    title: 'Unblocked!',
                    text: 'The user has been unblocked.',
                    confirmButtonColor: '#10B981',
                });
            } catch (err) {
                Swal.fire({
                    icon: 'error',
                    title: 'Error!',
                    text: err.response?.data || 'Failed to unblock user',
                    confirmButtonColor: '#EF4444',
                });
            }
        }
    };

    return (
        <div className="flex h-screen bg-gray-100">
            <div className="w-64">
                <AdminSidebar />
            </div>
            <div className="flex-grow p-8">
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
                    <div className="bg-white shadow-md rounded-lg overflow-hidden">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
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
                                            {user.isBlocked ? (
                                                <button
                                                    onClick={() => handleUnblockUser(user._id)}
                                                    className="text-green-600 hover:text-green-900 transition duration-150 ease-in-out mr-2"
                                                >
                                                    <FiUnlock className="inline-block mr-1" /> Unblock
                                                </button>
                                            ) : (
                                                <button
                                                    onClick={() => handleBlockUser(user._id)}
                                                    className="text-red-600 hover:text-red-900 transition duration-150 ease-in-out mr-2"
                                                >
                                                    <FiLock className="inline-block mr-1" /> Block
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default UserList;