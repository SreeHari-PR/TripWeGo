import React, { useState } from 'react';
import UserList from '../adminPages/userList';
import ListManagers from './ManagerList';
import Sidebar from '../../components/Sidebar';

const AdminDashboard = () => {
  const [activePage, setActivePage] = useState('dashboard');

  const handlePageChange = (page) => {
    setActivePage(page);
  };

  return (
    <div className="dashboard-container">
      <Sidebar handlePageChange={handlePageChange} activePage={activePage} />
      {activePage === 'users' && <UserList />}
      {activePage === 'managers' && <ListManagers />}
    </div>
  );
};

export default AdminDashboard;