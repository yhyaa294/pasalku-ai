
import React from 'react';

const AdminDashboardPage = () => {
  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
      <p className="mt-2 text-gray-600">Welcome to the admin dashboard. Here you can manage users, settings, and more.</p>
      
      <div className="mt-8">
        <h2 className="text-2xl font-semibold text-gray-800">User Management</h2>
        <div className="mt-4 bg-white p-6 rounded-lg shadow-md">
          <p>Here is where the user management table will go.</p>
          {/* Placeholder for a user table component */}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardPage;
