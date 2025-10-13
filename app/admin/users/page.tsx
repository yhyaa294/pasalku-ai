
import React from 'react';

// Mock data for users
const users = [
  { id: 1, name: 'John Doe', email: 'john.doe@example.com', role: 'Admin', joined: '2023-01-15' },
  { id: 2, name: 'Jane Smith', email: 'jane.smith@example.com', role: 'User', joined: '2023-02-20' },
  { id: 3, name: 'Sam Wilson', email: 'sam.wilson@example.com', role: 'User', joined: '2023-03-10' },
  { id: 4, name: 'Alice Johnson', email: 'alice.j@example.com', role: 'Editor', joined: '2023-04-05' },
];

const AdminUsersPage = () => {
  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900">User Management</h1>
      <p className="mt-2 text-gray-600">Manage all registered users in the system.</p>
      
      <div className="mt-8 flow-root">
        <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
            <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
              <table className="min-w-full divide-y divide-gray-300">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">Name</th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Email</th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Role</th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Joined Date</th>
                    <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                      <span className="sr-only">Edit</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {users.map((user) => (
                    <tr key={user.id}>
                      <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">{user.name}</td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{user.email}</td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{user.role}</td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{user.joined}</td>
                      <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                        <a href="#" className="text-indigo-600 hover:text-indigo-900">
                          Edit<span className="sr-only">, {user.name}</span>
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminUsersPage;
