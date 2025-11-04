'use client';

import React from 'react';

export default function PagePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
      <div className="text-center p-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Page Page
        </h1>
        <p className="text-gray-600 mb-6">
          This page is temporarily under maintenance.
        </p>
        <div className="text-6xl mb-4">🚧</div>
        <p className="text-sm text-gray-500">
          We're working to restore full functionality soon.
        </p>
      </div>
    </div>
  );
}