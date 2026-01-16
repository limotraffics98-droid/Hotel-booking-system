import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { hotelsApi } from '../../api/hotels';
import { Hotel } from '../../types';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { Star, MapPin, Wifi, Coffee, Dumbbell, Users } from 'lucide-react';

export const HotelDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [hotel, setHotel] = useState<Hotel | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedRoom, setSelectedRoom] = useState<string>('');
  const [bookingData, setBookingData] = useState({
    checkIn: '',
    checkOut: '',
    guests: 2,
    rooms: 1,
  });

  useEffect(() => {
    const fetchHotel = async () => {
      if (!id) return;
      const response = await hotelsApi.getHotelById(id);
      if (response.success && response.data) {
        setHotel(response.data);
        if (response.data.rooms && response.data.rooms.length > 0) {
          setSelectedRoom(response.data.rooms[0].id);
        }
      }
      setLoading(false);
    };

    fetchHotel();
  }, [id]);

  const handleBookNow = () => {
    if (!selectedRoom || !bookingData.checkIn || !bookingData.checkOut) {
      alert('Please select dates and a room');
      return;
    }

    navigate(`/checkout?hotelId=${id}&roomId=${selectedRoom}&checkIn=${bookingData.checkIn}&checkOut=${bookingData.checkOut}&guests=${bookingData.guests}&rooms=${bookingData.rooms}`);
  };

  if (loading) return <LoadingSpinner />;
  if (!hotel) return <div className="text-center py-12">Hotel not found</div>;

  const selectedRoomData = hotel.rooms?.find(r => r.id === selectedRoom);
  const nights = bookingData.checkIn && bookingData.checkOut
    ? Math.ceil((new Date(bookingData.checkOut).getTime() - new Date(bookingData.checkIn).getTime()) / (1000 * 60 * 60 * 24))
    : 0;
  const totalPrice = selectedRoomData && nights > 0 ? selectedRoomData.pricePerNight * bookingData.rooms * nights : 0;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 p-2">
            <img
              src={hotel.mainImage || 'https://images.pexels.com/photos/338504/pexels-photo-338504.jpeg'}
              alt={hotel.name}
              className="w-full h-96 object-cover rounded"
            />
            <div className="grid grid-cols-2 gap-2">
              {hotel.images?.slice(0, 4).map((img, idx) => (
                <img key={idx} src={img.imageUrl} alt={`${hotel.name} ${idx + 1}`} className="w-full h-[11.5rem] object-cover rounded" />
              ))}
            </div>
          </div>

          <div className="p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">{hotel.name}</h1>
                <p className="text-gray-600 flex items-center mt-2">
                  <MapPin className="h-4 w-4 mr-1" />
                  {hotel.address}, {hotel.city}
                </p>
              </div>
              <div className="flex items-center bg-blue-600 text-white px-4 py-2 rounded-lg">
                <Star className="h-5 w-5 mr-1 fill-current" />
                <span className="text-xl font-bold">{hotel.rating.toFixed(1)}</span>
              </div>
            </div>

            <p className="text-gray-700 mb-6">{hotel.description}</p>

            <div className="mb-6">
              <h2 className="text-xl font-bold mb-3">Amenities</h2>
              <div className="flex flex-wrap gap-3">
                {hotel.amenities.map((amenity) => (
                  <span key={amenity} className="flex items-center px-3 py-2 bg-gray-100 rounded-md">
                    <Coffee className="h-4 w-4 mr-2 text-gray-600" />
                    {amenity}
                  </span>
                ))}
              </div>
            </div>

            <div className="border-t pt-6 mt-6">
              <h2 className="text-2xl font-bold mb-4">Available Rooms</h2>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-4">
                  {hotel.rooms?.map((room) => (
                    <div
                      key={room.id}
                      onClick={() => setSelectedRoom(room.id)}
                      className={`p-4 border-2 rounded-lg cursor-pointer transition ${
                        selectedRoom === room.id ? 'border-blue-600 bg-blue-50' : 'border-gray-200 hover:border-blue-300'
                      }`}
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-bold text-lg">{room.name}</h3>
                          <p className="text-gray-600 flex items-center mt-1">
                            <Users className="h-4 w-4 mr-1" />
                            Up to {room.capacity} guests
                          </p>
                          <p className="text-sm text-gray-500 mt-2">{room.description}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-bold text-blue-600">${room.pricePerNight}</p>
                          <p className="text-sm text-gray-500">per night</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="lg:sticky lg:top-20 h-fit">
                  <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
                    <h3 className="text-xl font-bold mb-4">Book Your Stay</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium mb-1">Check-in</label>
                        <input
                          type="date"
                          value={bookingData.checkIn}
                          onChange={(e) => setBookingData({ ...bookingData, checkIn: e.target.value })}
                          min={new Date().toISOString().split('T')[0]}
                          className="w-full px-3 py-2 border rounded-md"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">Check-out</label>
                        <input
                          type="date"
                          value={bookingData.checkOut}
                          onChange={(e) => setBookingData({ ...bookingData, checkOut: e.target.value })}
                          min={bookingData.checkIn || new Date().toISOString().split('T')[0]}
                          className="w-full px-3 py-2 border rounded-md"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium mb-1">Guests</label>
                          <input
                            type="number"
                            min="1"
                            max="10"
                            value={bookingData.guests}
                            onChange={(e) => setBookingData({ ...bookingData, guests: parseInt(e.target.value) })}
                            className="w-full px-3 py-2 border rounded-md"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-1">Rooms</label>
                          <input
                            type="number"
                            min="1"
                            max="5"
                            value={bookingData.rooms}
                            onChange={(e) => setBookingData({ ...bookingData, rooms: parseInt(e.target.value) })}
                            className="w-full px-3 py-2 border rounded-md"
                          />
                        </div>
                      </div>

                      {nights > 0 && totalPrice > 0 && (
                        <div className="border-t pt-4 mt-4">
                          <div className="flex justify-between mb-2">
                            <span>Price per night:</span>
                            <span>${selectedRoomData?.pricePerNight}</span>
                          </div>
                          <div className="flex justify-between mb-2">
                            <span>{nights} nights × {bookingData.rooms} room(s):</span>
                            <span>${totalPrice}</span>
                          </div>
                          <div className="flex justify-between font-bold text-lg border-t pt-2">
                            <span>Total:</span>
                            <span className="text-blue-600">${totalPrice}</span>
                          </div>
                        </div>
                      )}

                      <button
                        onClick={handleBookNow}
                        className="w-full bg-blue-600 text-white py-3 rounded-md hover:bg-blue-700 font-semibold"
                      >
                        Book Now
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
