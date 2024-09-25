import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import Swal from 'sweetalert2';

const UserList = () => {
    const [users, setUsers] = useState([]);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await api.get('/admin/users', {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                });
                setUsers(response.data);
            } catch (err) {
                setError(err.response?.data || 'Failed to fetch users');
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
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, block it!',
        });

        if (result.isConfirmed) {
            try {
                await api.put(`/users/${id}/block`, {}, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                });
                setUsers(users.map(user => user._id === id ? { ...user, isBlocked: true } : user));
                Swal.fire(
                    'Blocked!',
                    'The user has been blocked.',
                    'success'
                );
            } catch (err) {
                Swal.fire(
                    'Error!',
                    err.response?.data || 'Failed to block user',
                    'error'
                );
            }
        }
    };

    const handleUnblockUser = async (id) => {
        const result = await Swal.fire({
            title: 'Are you sure?',
            text: 'You are about to unblock this user!',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
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
                Swal.fire(
                    'Unblocked!',
                    'The user has been unblocked.',
                    'success'
                );
            } catch (err) {
                Swal.fire(
                    'Error!',
                    err.response?.data || 'Failed to unblock user',
                    'error'
                );
            }
        }
    };

    return (
        <div className="user-list-container bg-white shadow-md rounded-lg p-6 max-w-3xl mx-auto mt-10">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">User List</h2>
            {error && <p className="text-red-500 mb-4">{error}</p>}
            <ul className="space-y-4">
                {users.map(user => (
                    <li 
                        key={user._id} 
                        className="flex justify-between items-center p-4 bg-gray-100 rounded-md shadow-sm hover:bg-gray-200 transition">
                        <div>
                            <p className="text-lg font-medium text-gray-700">{user.name} ({user.email})</p>
                            <p className={`text-sm ${user.isBlocked ? 'text-red-500' : 'text-green-500'}`}>
                                {user.isBlocked ? 'Blocked' : 'Active'}
                            </p>
                        </div>
                        <div className="flex space-x-2">
                            <button 
                                onClick={() => handleBlockUser(user._id)} 
                                disabled={user.isBlocked}
                                className={`px-4 py-2 rounded-md text-sm font-medium ${user.isBlocked ? 'bg-gray-400 text-gray-800' : 'bg-red-500 text-white hover:bg-red-600 transition'}`}
                            >
                                Block
                            </button>
                            <button 
                                onClick={() => handleUnblockUser(user._id)} 
                                disabled={!user.isBlocked}
                                className={`px-4 py-2 rounded-md text-sm font-medium ${!user.isBlocked ? 'bg-gray-400 text-gray-800' : 'bg-green-500 text-white hover:bg-green-600 transition'}`}
                            >
                                Unblock
                            </button>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default UserList;
