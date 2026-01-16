import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { bookingsApi } from '../../api/bookings';
import { Booking } from '../../types';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { CheckCircle, Calendar, MapPin, Users } from 'lucide-react';

export const BookingConfirmation = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [booking, setBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBooking = async () => {
      if (!id) return;
      const response = await bookingsApi.getBookingById(id);
      if (response.success && response.data) {
        setBooking(response.data);
      }
      setLoading(false);
    };

    fetchBooking();
  }, [id]);

  if (loading) return <LoadingSpinner />;
  if (!booking) return <div className="text-center py-12">Booking not found</div>;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="bg-green-600 text-white p-6 text-center">
            <CheckCircle className="h-16 w-16 mx-auto mb-4" />
            <h1 className="text-3xl font-bold">Booking Confirmed!</h1>
            <p className="mt-2">Your booking reference: #{booking.id.slice(0, 8).toUpperCase()}</p>
          </div>

          <div className="p-6 space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">{booking.hotel?.name}</h2>
              <p className="text-gray-600 flex items-center">
                <MapPin className="h-4 w-4 mr-1" />
                {booking.hotel?.address}, {booking.hotel?.city}
              </p>
            </div>

            <div className="border-t pt-6">
              <h3 className="font-bold text-lg mb-4">Booking Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-gray-500 text-sm">Check-in</p>
                  <p className="font-semibold flex items-center">
                    <Calendar className="h-4 w-4 mr-1" />
                    {new Date(booking.checkIn).toLocaleDateString('en-US', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                </div>
                <div>
                  <p className="text-gray-500 text-sm">Check-out</p>
                  <p className="font-semibold flex items-center">
                    <Calendar className="h-4 w-4 mr-1" />
                    {new Date(booking.checkOut).toLocaleDateString('en-US', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                </div>
                <div>
                  <p className="text-gray-500 text-sm">Room Type</p>
                  <p className="font-semibold">{booking.room?.name}</p>
                </div>
                <div>
                  <p className="text-gray-500 text-sm">Guests</p>
                  <p className="font-semibold flex items-center">
                    <Users className="h-4 w-4 mr-1" />
                    {booking.guests}
                  </p>
                </div>
                <div>
                  <p className="text-gray-500 text-sm">Number of Rooms</p>
                  <p className="font-semibold">{booking.roomsCount}</p>
                </div>
                <div>
                  <p className="text-gray-500 text-sm">Status</p>
                  <p className={`font-semibold ${booking.status === 'CONFIRMED' ? 'text-green-600' : 'text-yellow-600'}`}>
                    {booking.status.replace('_', ' ')}
                  </p>
                </div>
              </div>
            </div>

            <div className="border-t pt-6">
              <div className="flex justify-between items-center mb-4">
                <span className="text-lg font-bold">Total Amount Paid:</span>
                <span className="text-3xl font-bold text-blue-600">${booking.totalAmount}</span>
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-gray-700">
                A confirmation email has been sent to your registered email address with all the booking details.
                Please present this booking reference at check-in.
              </p>
            </div>

            <div className="flex space-x-4">
              <button
                onClick={() => navigate('/my-bookings')}
                className="flex-1 bg-blue-600 text-white py-3 rounded-md hover:bg-blue-700 font-semibold"
              >
                View My Bookings
              </button>
              <button
                onClick={() => navigate('/')}
                className="flex-1 bg-gray-200 text-gray-800 py-3 rounded-md hover:bg-gray-300 font-semibold"
              >
                Back to Home
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
