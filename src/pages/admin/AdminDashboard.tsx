import { useState, useEffect } from 'react';
import { apiClient } from '../../api/client';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { Hotel, Users, DollarSign, Calendar } from 'lucide-react';

export const AdminDashboard = () => {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      const response = await apiClient.get('/admin/stats');
      if (response.success && response.data) {
        setStats(response.data);
      }
      setLoading(false);
    };

    fetchStats();
  }, []);

  if (loading) return <LoadingSpinner />;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Admin Dashboard</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Total Hotels</p>
                <p className="text-3xl font-bold text-gray-900">{stats?.totalHotels || 0}</p>
              </div>
              <Hotel className="h-12 w-12 text-blue-600" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Total Bookings</p>
                <p className="text-3xl font-bold text-gray-900">{stats?.totalBookings || 0}</p>
              </div>
              <Calendar className="h-12 w-12 text-green-600" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Total Revenue</p>
                <p className="text-3xl font-bold text-gray-900">${stats?.totalRevenue?.toFixed(0) || 0}</p>
              </div>
              <DollarSign className="h-12 w-12 text-yellow-600" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Total Users</p>
                <p className="text-3xl font-bold text-gray-900">{stats?.totalUsers || 0}</p>
              </div>
              <Users className="h-12 w-12 text-purple-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b">
            <h2 className="text-xl font-bold">Recent Bookings</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Booking ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">User</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Hotel</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Check-in</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {stats?.recentBookings?.map((booking: any) => (
                  <tr key={booking.id}>
                    <td className="px-6 py-4 text-sm text-gray-900">#{booking.id.slice(0, 8)}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">{booking.user?.name}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">{booking.hotel?.name}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">{new Date(booking.checkIn).toLocaleDateString()}</td>
                    <td className="px-6 py-4 text-sm">
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        booking.status === 'CONFIRMED' ? 'bg-green-100 text-green-800' :
                        booking.status === 'PENDING_PAYMENT' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {booking.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
