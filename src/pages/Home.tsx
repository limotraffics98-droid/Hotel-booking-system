import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, MapPin, Calendar, Users } from 'lucide-react';

export const Home = () => {
  const navigate = useNavigate();
  const [searchData, setSearchData] = useState({
    city: '',
    checkIn: '',
    checkOut: '',
    guests: '2',
    rooms: '1',
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchData.city) params.append('city', searchData.city);
    if (searchData.checkIn) params.append('checkIn', searchData.checkIn);
    if (searchData.checkOut) params.append('checkOut', searchData.checkOut);
    if (searchData.guests) params.append('guests', searchData.guests);
    if (searchData.rooms) params.append('rooms', searchData.rooms);

    navigate(`/search?${params.toString()}`);
  };

  const today = new Date().toISOString().split('T')[0];
  const tomorrow = new Date(Date.now() + 86400000).toISOString().split('T')[0];

  return (
    <div className="min-h-screen">
      <div
        className="relative bg-gradient-to-r from-blue-600 to-blue-800 text-white py-32"
        style={{
          backgroundImage: 'linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), url(https://images.pexels.com/photos/258154/pexels-photo-258154.jpeg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-6xl font-bold mb-4">Find Your Perfect Stay</h1>
            <p className="text-xl md:text-2xl text-gray-100">Discover amazing hotels at unbeatable prices</p>
          </div>

          <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-2xl p-6">
            <form onSubmit={handleSearch} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                <div className="lg:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    <MapPin className="inline h-4 w-4 mr-1" />
                    City or Destination
                  </label>
                  <input
                    type="text"
                    value={searchData.city}
                    onChange={(e) => setSearchData({ ...searchData, city: e.target.value })}
                    placeholder="Where are you going?"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    <Calendar className="inline h-4 w-4 mr-1" />
                    Check-in
                  </label>
                  <input
                    type="date"
                    value={searchData.checkIn}
                    onChange={(e) => setSearchData({ ...searchData, checkIn: e.target.value })}
                    min={today}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    <Calendar className="inline h-4 w-4 mr-1" />
                    Check-out
                  </label>
                  <input
                    type="date"
                    value={searchData.checkOut}
                    onChange={(e) => setSearchData({ ...searchData, checkOut: e.target.value })}
                    min={searchData.checkIn || tomorrow}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    <Users className="inline h-4 w-4 mr-1" />
                    Guests
                  </label>
                  <select
                    value={searchData.guests}
                    onChange={(e) => setSearchData({ ...searchData, guests: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                  >
                    {[1, 2, 3, 4, 5, 6].map((num) => (
                      <option key={num} value={num}>
                        {num} {num === 1 ? 'Guest' : 'Guests'}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-3 px-6 rounded-md hover:bg-blue-700 font-semibold flex items-center justify-center space-x-2 transition-colors"
              >
                <Search className="h-5 w-5" />
                <span>Search Hotels</span>
              </button>
            </form>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Popular Destinations</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { city: 'New York', image: 'https://images.pexels.com/photos/466685/pexels-photo-466685.jpeg' },
            { city: 'Miami', image: 'https://images.pexels.com/photos/1108701/pexels-photo-1108701.jpeg' },
            { city: 'Los Angeles', image: 'https://images.pexels.com/photos/739407/pexels-photo-739407.jpeg' },
          ].map((dest) => (
            <div
              key={dest.city}
              onClick={() => navigate(`/search?city=${dest.city}`)}
              className="relative h-64 rounded-lg overflow-hidden cursor-pointer group"
            >
              <img src={dest.image} alt={dest.city} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end">
                <div className="p-6">
                  <h3 className="text-white text-2xl font-bold">{dest.city}</h3>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
