
import React from 'react';

const AdminSettingsPage = () => {
  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900">Admin Settings</h1>
      <p className="mt-2 text-gray-600">Manage application-wide settings here.</p>
      
      <div className="mt-8 space-y-6">
        <div className="p-6 bg-white rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-gray-800">General Settings</h2>
          <p className="mt-1 text-gray-500">Placeholder for general settings form.</p>
        </div>
        <div className="p-6 bg-white rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-gray-800">Security</h2>
          <p className="mt-1 text-gray-500">Placeholder for security settings.</p>
        </div>
        <div className="p-6 bg-white rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-gray-800">API Keys</h2>
          <p className="mt-1 text-gray-500">Placeholder for managing third-party API keys.</p>
        </div>
      </div>
    </div>
  );
};

export default AdminSettingsPage;
