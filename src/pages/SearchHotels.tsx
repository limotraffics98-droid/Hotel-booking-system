import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { hotelsApi } from '../api/hotels';
import { Hotel } from '../types';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { Star, MapPin, DollarSign } from 'lucide-react';

export const SearchHotels = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    minPrice: searchParams.get('minPrice') || '',
    maxPrice: searchParams.get('maxPrice') || '',
    minRating: searchParams.get('minRating') || '',
    sortBy: searchParams.get('sortBy') || 'rating_desc',
  });

  useEffect(() => {
    const fetchHotels = async () => {
      setLoading(true);
      const response = await hotelsApi.searchHotels({
        city: searchParams.get('city') || undefined,
        minPrice: filters.minPrice ? parseFloat(filters.minPrice) : undefined,
        maxPrice: filters.maxPrice ? parseFloat(filters.maxPrice) : undefined,
        minRating: filters.minRating ? parseFloat(filters.minRating) : undefined,
        sortBy: filters.sortBy as any,
      });

      if (response.success && response.data?.hotels) {
        setHotels(response.data.hotels);
      }
      setLoading(false);
    };

    fetchHotels();
  }, [searchParams, filters]);

  if (loading) return <LoadingSpinner />;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">
          {searchParams.get('city') ? `Hotels in ${searchParams.get('city')}` : 'Search Results'}
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow p-6 sticky top-20">
              <h2 className="text-lg font-bold mb-4">Filters</h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Price Range</label>
                  <div className="flex space-x-2">
                    <input
                      type="number"
                      placeholder="Min"
                      value={filters.minPrice}
                      onChange={(e) => setFilters({ ...filters, minPrice: e.target.value })}
                      className="w-full px-3 py-2 border rounded-md"
                    />
                    <input
                      type="number"
                      placeholder="Max"
                      value={filters.maxPrice}
                      onChange={(e) => setFilters({ ...filters, maxPrice: e.target.value })}
                      className="w-full px-3 py-2 border rounded-md"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Minimum Rating</label>
                  <select
                    value={filters.minRating}
                    onChange={(e) => setFilters({ ...filters, minRating: e.target.value })}
                    className="w-full px-3 py-2 border rounded-md"
                  >
                    <option value="">Any Rating</option>
                    <option value="3">3+ Stars</option>
                    <option value="4">4+ Stars</option>
                    <option value="4.5">4.5+ Stars</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Sort By</label>
                  <select
                    value={filters.sortBy}
                    onChange={(e) => setFilters({ ...filters, sortBy: e.target.value })}
                    className="w-full px-3 py-2 border rounded-md"
                  >
                    <option value="rating_desc">Highest Rating</option>
                    <option value="price_asc">Lowest Price</option>
                    <option value="price_desc">Highest Price</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-3">
            {hotels.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg">No hotels found matching your criteria.</p>
              </div>
            ) : (
              <div className="space-y-6">
                {hotels.map((hotel) => (
                  <div
                    key={hotel.id}
                    onClick={() => navigate(`/hotel/${hotel.id}`)}
                    className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow cursor-pointer overflow-hidden flex flex-col md:flex-row"
                  >
                    <img
                      src={hotel.mainImage || 'https://images.pexels.com/photos/338504/pexels-photo-338504.jpeg'}
                      alt={hotel.name}
                      className="w-full md:w-64 h-48 object-cover"
                    />
                    <div className="p-6 flex-1">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="text-xl font-bold text-gray-900">{hotel.name}</h3>
                          <p className="text-gray-600 flex items-center mt-1">
                            <MapPin className="h-4 w-4 mr-1" />
                            {hotel.address}, {hotel.city}
                          </p>
                        </div>
                        <div className="flex items-center bg-blue-600 text-white px-3 py-1 rounded-md">
                          <Star className="h-4 w-4 mr-1 fill-current" />
                          <span className="font-bold">{hotel.rating.toFixed(1)}</span>
                        </div>
                      </div>

                      <p className="text-gray-600 mt-3 line-clamp-2">{hotel.description}</p>

                      {hotel.amenities && hotel.amenities.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-3">
                          {hotel.amenities.slice(0, 4).map((amenity) => (
                            <span key={amenity} className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                              {amenity}
                            </span>
                          ))}
                        </div>
                      )}

                      <div className="mt-4 flex justify-between items-center">
                        <div>
                          <p className="text-sm text-gray-500">Starting from</p>
                          <p className="text-2xl font-bold text-blue-600 flex items-center">
                            <DollarSign className="h-5 w-5" />
                            {hotel.startingPrice?.toFixed(0)}
                            <span className="text-sm text-gray-500 ml-1">/ night</span>
                          </p>
                        </div>
                        <button className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 font-semibold">
                          View Details
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
