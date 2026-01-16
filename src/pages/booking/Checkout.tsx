import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { hotelsApi } from '../../api/hotels';
import { bookingsApi } from '../../api/bookings';
import { useAuth } from '../../contexts/AuthContext';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { Hotel, Room } from '../../types';

export const Checkout = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [hotel, setHotel] = useState<Hotel | null>(null);
  const [room, setRoom] = useState<Room | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const hotelId = searchParams.get('hotelId') || '';
  const roomId = searchParams.get('roomId') || '';
  const checkIn = searchParams.get('checkIn') || '';
  const checkOut = searchParams.get('checkOut') || '';
  const guests = parseInt(searchParams.get('guests') || '2');
  const roomsCount = parseInt(searchParams.get('rooms') || '1');

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    const fetchDetails = async () => {
      const hotelResponse = await hotelsApi.getHotelById(hotelId);
      if (hotelResponse.success && hotelResponse.data) {
        setHotel(hotelResponse.data);
        const selectedRoom = hotelResponse.data.rooms?.find(r => r.id === roomId);
        if (selectedRoom) {
          setRoom(selectedRoom);
        }
      }
      setLoading(false);
    };

    fetchDetails();
  }, [hotelId, roomId, user, navigate]);

  const handleConfirmBooking = async () => {
    setError('');
    setSubmitting(true);

    const response = await bookingsApi.createBooking({
      hotelId,
      roomId,
      checkIn,
      checkOut,
      guests,
      roomsCount,
    });

    if (response.success && response.data) {
      navigate(`/confirmation/${response.data.id}`);
    } else {
      setError(response.error || 'Booking failed');
    }

    setSubmitting(false);
  };

  if (loading) return <LoadingSpinner />;
  if (!hotel || !room) return <div className="text-center py-12">Invalid booking details</div>;

  const nights = Math.ceil((new Date(checkOut).getTime() - new Date(checkIn).getTime()) / (1000 * 60 * 60 * 24));
  const totalAmount = room.pricePerNight * roomsCount * nights;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Complete Your Booking</h1>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-bold mb-4">Guest Information</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                  <input
                    type="text"
                    value={user?.name || ''}
                    disabled
                    className="w-full px-3 py-2 border rounded-md bg-gray-50"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input
                    type="email"
                    value={user?.email || ''}
                    disabled
                    className="w-full px-3 py-2 border rounded-md bg-gray-50"
                  />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-bold mb-4">Booking Details</h2>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Hotel:</span>
                  <span className="font-semibold">{hotel.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Room Type:</span>
                  <span className="font-semibold">{room.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Check-in:</span>
                  <span className="font-semibold">{new Date(checkIn).toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Check-out:</span>
                  <span className="font-semibold">{new Date(checkOut).toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Guests:</span>
                  <span className="font-semibold">{guests}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Rooms:</span>
                  <span className="font-semibold">{roomsCount}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow p-6 sticky top-20">
              <h2 className="text-xl font-bold mb-4">Price Summary</h2>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span>Price per night:</span>
                  <span>${room.pricePerNight}</span>
                </div>
                <div className="flex justify-between">
                  <span>Number of nights:</span>
                  <span>{nights}</span>
                </div>
                <div className="flex justify-between">
                  <span>Number of rooms:</span>
                  <span>{roomsCount}</span>
                </div>
                <div className="border-t pt-3 mt-3">
                  <div className="flex justify-between font-bold text-xl">
                    <span>Total:</span>
                    <span className="text-blue-600">${totalAmount}</span>
                  </div>
                </div>
              </div>

              <button
                onClick={handleConfirmBooking}
                disabled={submitting}
                className="w-full bg-blue-600 text-white py-3 rounded-md hover:bg-blue-700 font-semibold mt-6 disabled:opacity-50"
              >
                {submitting ? 'Processing...' : 'Confirm Booking'}
              </button>

              <p className="text-xs text-gray-500 mt-4 text-center">
                By confirming, you agree to our terms and conditions
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
