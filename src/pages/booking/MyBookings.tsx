import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { bookingsApi } from '../../api/bookings';
import { Booking } from '../../types';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { Calendar, MapPin, Users, X } from 'lucide-react';

export const MyBookings = () => {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState<{
    upcoming: Booking[];
    past: Booking[];
    cancelled: Booking[];
    pending: Booking[];
  }>({ upcoming: [], past: [], cancelled: [], pending: [] });
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'upcoming' | 'past' | 'cancelled' | 'pending'>('upcoming');

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    const response = await bookingsApi.getMyBookings();
    if (response.success && response.data) {
      setBookings(response.data);
    }
    setLoading(false);
  };

  const handleCancelBooking = async (bookingId: string) => {
    if (!confirm('Are you sure you want to cancel this booking?')) return;

    const response = await bookingsApi.cancelBooking(bookingId);
    if (response.success) {
      fetchBookings();
    }
  };

  if (loading) return <LoadingSpinner />;

  const currentBookings = bookings[activeTab];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">My Bookings</h1>

        <div className="mb-6 flex space-x-2 border-b">
          {(['upcoming', 'past', 'pending', 'cancelled'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 font-medium capitalize ${
                activeTab === tab
                  ? 'border-b-2 border-blue-600 text-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {tab} ({bookings[tab].length})
            </button>
          ))}
        </div>

        {currentBookings.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow">
            <p className="text-gray-500 text-lg">No {activeTab} bookings found</p>
          </div>
        ) : (
          <div className="space-y-6">
            {currentBookings.map((booking) => (
              <div key={booking.id} className="bg-white rounded-lg shadow overflow-hidden">
                <div className="p-6">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                    <div className="flex-1">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="text-xl font-bold text-gray-900">{booking.hotel?.name}</h3>
                          <p className="text-gray-600 flex items-center mt-1">
                            <MapPin className="h-4 w-4 mr-1" />
                            {booking.hotel?.city}
                          </p>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                          booking.status === 'CONFIRMED' ? 'bg-green-100 text-green-800' :
                          booking.status === 'PENDING_PAYMENT' ? 'bg-yellow-100 text-yellow-800' :
                          booking.status === 'CANCELLED' ? 'bg-red-100 text-red-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {booking.status.replace('_', ' ')}
                        </span>
                      </div>

                      <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <p className="text-gray-500">Check-in</p>
                          <p className="font-semibold flex items-center">
                            <Calendar className="h-4 w-4 mr-1" />
                            {new Date(booking.checkIn).toLocaleDateString()}
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-500">Check-out</p>
                          <p className="font-semibold flex items-center">
                            <Calendar className="h-4 w-4 mr-1" />
                            {new Date(booking.checkOut).toLocaleDateString()}
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-500">Guests</p>
                          <p className="font-semibold flex items-center">
                            <Users className="h-4 w-4 mr-1" />
                            {booking.guests}
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-500">Total Amount</p>
                          <p className="font-semibold text-blue-600">${booking.totalAmount}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 flex space-x-3">
                    <button
                      onClick={() => navigate(`/confirmation/${booking.id}`)}
                      className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                    >
                      View Details
                    </button>
                    {(booking.status === 'CONFIRMED' || booking.status === 'PENDING_PAYMENT') && (
                      <button
                        onClick={() => handleCancelBooking(booking.id)}
                        className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 flex items-center"
                      >
                        <X className="h-4 w-4 mr-1" />
                        Cancel Booking
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
