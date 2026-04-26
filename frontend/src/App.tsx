import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import PublicLayout from './components/layout/PublicLayout';
import HomePage from './pages/HomePage';
import MenuPage from './pages/MenuPage';
import GalleryPage from './pages/GalleryPage';
import ContactPage from './pages/ContactPage';
import ReservationPage from './pages/ReservationPage';
import AdminLayout from './components/admin/AdminLayout';
import ProtectedRoute from './components/admin/ProtectedRoute';
import AdminLogin from './pages/Admin/AdminLogin';
import AdminDashboard from './pages/Admin/AdminDashboard';
import CategoryList from './pages/Admin/Categories/CategoryList';
import MenuList from './pages/Admin/Menu/MenuList';
import GalleryManager from './pages/Admin/Gallery/GalleryManager';
import ReservationManager from './pages/Admin/Reservations/ReservationManager';
import RestaurantSettings from './pages/Admin/Settings/RestaurantSettings';

import { RestaurantProvider } from './hooks/useRestaurant';

function App() {
  return (
    <RestaurantProvider>
      <Router>
        <div className="min-h-screen bg-bg-primary text-text-primary font-body">
          <Routes>
            {/* Public Routes */}
            <Route element={<PublicLayout />}>
              <Route path="/" element={<HomePage />} />
              <Route path="/menu" element={<MenuPage />} />
              <Route path="/gallery" element={<GalleryPage />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/reservation" element={<ReservationPage />} />
            </Route>
            
            {/* Admin Routes */}
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route element={<ProtectedRoute />}>
              <Route path="/admin" element={<AdminLayout />}>
                <Route index element={<AdminDashboard />} />
                <Route path="categories" element={<CategoryList />} />
                <Route path="menu" element={<MenuList />} />
                <Route path="gallery" element={<GalleryManager />} />
                <Route path="reservations" element={<ReservationManager />} />
                <Route path="settings" element={<RestaurantSettings />} />
              </Route>
            </Route>
          </Routes>
        </div>
      </Router>
    </RestaurantProvider>
  );
}

export default App;
