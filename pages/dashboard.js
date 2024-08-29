import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { getSession, logout } from '../lib/auth';

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const session = await getSession();
      setLoading(false);
      if (!session) {
        router.push('/login');
      } else {
        setUser(session);
      }
    };
    checkAuth();
  }, [router]);

  const handleLogout = async () => {
    await logout();
    router.push('/login');
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-800 text-white">
        <div className="p-4">
          <h2 className="text-2xl font-bold">Admin Dashboard</h2>
        </div>
        <nav className="mt-6">
          <a href="#" className="block py-2.5 px-4 rounded transition duration-200 hover:bg-gray-700">Dashboard</a>
          <a href="#" className="block py-2.5 px-4 rounded transition duration-200 hover:bg-gray-700">Users</a>
          <a href="#" className="block py-2.5 px-4 rounded transition duration-200 hover:bg-gray-700">Settings</a>
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1">
        {/* Header */}
        <header className="bg-white shadow p-4">
          <div className="flex justify-between">
            <h1 className="text-2xl font-semibold">Dashboard Overview</h1>
            <div className="flex items-center space-x-4">
              <button
                onClick={handleLogout}
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
              >
                Logout
              </button>
            </div>
          </div>
        </header>

        <main className="p-6">
          {/* Dashboard Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white p-4 rounded-lg shadow">
              <h3 className="text-lg font-semibold">Total Sales</h3>
              <p className="text-2xl">$123,456</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow">
              <h3 className="text-lg font-semibold">New Users</h3>
              <p className="text-2xl">234</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow">
              <h3 className="text-lg font-semibold">Pending Orders</h3>
              <p className="text-2xl">67</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow">
              <h3 className="text-lg font-semibold">Support Tickets</h3>
              <p className="text-2xl">15</p>
            </div>
          </div>

          {/* Recent Activity Table */}
          <div className="mt-6">
            <div className="bg-white p-4 rounded-lg shadow">
              <h3 className="text-lg font-semibold mb-4">Recent Activities</h3>
              <table className="min-w-full table-auto">
                <thead>
                  <tr className="bg-gray-200">
                    <th className="px-4 py-2">User</th>
                    <th className="px-4 py-2">Activity</th>
                    <th className="px-4 py-2">Date</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border px-4 py-2">{user.username}</td>
                    <td className="border px-4 py-2">Logged in</td>
                    <td className="border px-4 py-2">2024-08-29</td>
                  </tr>
                  <tr>
                    <td className="border px-4 py-2">Jane Smith</td>
                    <td className="border px-4 py-2">Uploaded a file</td>
                    <td className="border px-4 py-2">2024-08-29</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
