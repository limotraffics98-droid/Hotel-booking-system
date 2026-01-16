import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { authApi } from '../api/auth';
import { User } from 'lucide-react';

export const Profile = () => {
  const { user, updateUser } = useAuth();
  const [editing, setEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
  });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');
    setError('');

    const response = await authApi.updateProfile(profileData);

    if (response.success && response.data) {
      updateUser(response.data);
      setMessage('Profile updated successfully');
      setEditing(false);
    } else {
      setError(response.error || 'Update failed');
    }
  };

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');
    setError('');

    if (passwordData.newPassword.length < 6) {
      setError('New password must be at least 6 characters');
      return;
    }

    const response = await authApi.updatePassword(passwordData);

    if (response.success) {
      setMessage('Password updated successfully');
      setPasswordData({ currentPassword: '', newPassword: '' });
    } else {
      setError(response.error || 'Password update failed');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">My Profile</h1>

        {message && (
          <div className="bg-green-50 border border-green-200 text-green-600 px-4 py-3 rounded mb-6">
            {message}
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        <div className="bg-white rounded-lg shadow overflow-hidden mb-6">
          <div className="p-6 border-b">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold">Profile Information</h2>
              {!editing && (
                <button
                  onClick={() => setEditing(true)}
                  className="text-blue-600 hover:text-blue-700 font-medium"
                >
                  Edit
                </button>
              )}
            </div>
          </div>

          <form onSubmit={handleUpdateProfile} className="p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
              {editing ? (
                <input
                  type="text"
                  value={profileData.name}
                  onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                  className="w-full px-3 py-2 border rounded-md"
                />
              ) : (
                <p className="text-gray-900">{user?.name}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <p className="text-gray-900">{user?.email}</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
              {editing ? (
                <input
                  type="tel"
                  value={profileData.phone}
                  onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                  className="w-full px-3 py-2 border rounded-md"
                />
              ) : (
                <p className="text-gray-900">{user?.phone || 'Not provided'}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
              <p className="text-gray-900">{user?.role}</p>
            </div>

            {editing && (
              <div className="flex space-x-3">
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Save Changes
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setEditing(false);
                    setProfileData({ name: user?.name || '', phone: user?.phone || '' });
                  }}
                  className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
                >
                  Cancel
                </button>
              </div>
            )}
          </form>
        </div>

        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="p-6 border-b">
            <h2 className="text-xl font-bold">Change Password</h2>
          </div>

          <form onSubmit={handleUpdatePassword} className="p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Current Password</label>
              <input
                type="password"
                value={passwordData.currentPassword}
                onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                className="w-full px-3 py-2 border rounded-md"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
              <input
                type="password"
                value={passwordData.newPassword}
                onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                className="w-full px-3 py-2 border rounded-md"
                required
              />
              <p className="mt-1 text-sm text-gray-500">Must be at least 6 characters</p>
            </div>

            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Update Password
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
