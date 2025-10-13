
import React from 'react';

// This is a placeholder for session management.
// In a real app, you'd use a library like next-auth or your own auth context.
const isAuthenticated = () => {
  // For now, let's assume the admin is always authenticated
  // In a real scenario, you would check for a valid session/token.
  console.log("Checking authentication for admin layout...");
  return true; 
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  if (!isAuthenticated()) {
    // In a real app, you would redirect to the login page.
    // Since this is a server component, you might use the `redirect` function from `next/navigation`.
    // For simplicity here, we'll just show a message.
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Redirecting to login...</p>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-100">
      <aside className="w-64 bg-gray-800 text-white">
        <div className="p-4 text-2xl font-bold">Admin Panel</div>
        <nav className="mt-10">
          <a href="/admin/dashboard" className="block px-4 py-2 text-sm hover:bg-gray-700">Dashboard</a>
          <a href="/admin/users" className="block px-4 py-2 text-sm hover:bg-gray-700">Users</a>
          <a href="/admin/settings" className="block px-4 py-2 text-sm hover:bg-gray-700">Settings</a>
        </nav>
      </aside>
      <main className="flex-1 p-10">
        {children}
      </main>
    </div>
  );
}
