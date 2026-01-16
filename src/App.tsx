import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { Navbar } from './components/layout/Navbar';
import { ProtectedRoute } from './components/common/ProtectedRoute';
import { Home } from './pages/Home';
import { SearchHotels } from './pages/SearchHotels';
import { HotelDetails } from './pages/hotel/HotelDetails';
import { Checkout } from './pages/booking/Checkout';
import { MyBookings } from './pages/booking/MyBookings';
import { BookingConfirmation } from './pages/booking/BookingConfirmation';
import { Login } from './pages/auth/Login';
import { Register } from './pages/auth/Register';
import { Profile } from './pages/Profile';
import { AdminDashboard } from './pages/admin/AdminDashboard';

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="min-h-screen bg-gray-50">
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/search" element={<SearchHotels />} />
            <Route path="/hotel/:id" element={<HotelDetails />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            <Route
              path="/checkout"
              element={
                <ProtectedRoute>
                  <Checkout />
                </ProtectedRoute>
              }
            />
            <Route
              path="/my-bookings"
              element={
                <ProtectedRoute>
                  <MyBookings />
                </ProtectedRoute>
              }
            />
            <Route
              path="/confirmation/:id"
              element={
                <ProtectedRoute>
                  <BookingConfirmation />
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin"
              element={
                <ProtectedRoute requireAdmin>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />
          </Routes>
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;
