import React, { useState } from 'react';
import AdminSidebar from '../../components/Admin/Sidebar';


const AdminDashboard = () => {


  return (
    <div className="flex h-screen bg-gray-100">
    <div className="w-64">
      <AdminSidebar />
    </div>
    <div className="flex-grow w-auto mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-[#002233] mb-6">dashboard</h1>
    </div>
    </div>
  );
};

export default AdminDashboard;
