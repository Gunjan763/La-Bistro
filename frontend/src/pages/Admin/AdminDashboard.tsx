import { useState, useEffect } from 'react';
import { useAppSelector } from '../../hooks/useRedux';
import { restaurantService, reservationService } from '../../services/api';
import type { DashboardStats } from '../../types';
import { 
  Users, 
  Utensils, 
  Layers, 
  Image as ImageIcon, 
  Clock, 
  CheckCircle, 
  XCircle, 
  ArrowRight,
  Plus,
  Settings
} from 'lucide-react';
import { Link } from 'react-router-dom';
import Button from '../../components/ui/Button';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import toast from 'react-hot-toast';
import { useRestaurant } from '../../hooks/useRestaurant';

const AdminDashboard = () => {
  const { user } = useAppSelector((state) => state.auth);
  const { restaurant } = useRestaurant();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchStats = async () => {
    try {
      const data = await restaurantService.getStats();
      setStats(data);
    } catch (error) {
      console.error('Failed to fetch stats:', error);
      toast.error('Failed to load dashboard statistics');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const handleUpdateStatus = async (id: string, status: string) => {
    try {
      await reservationService.updateStatus(id, status);
      toast.success(`Reservation ${status.toLowerCase()}`);
      fetchStats(); // Refresh stats and list
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  if (isLoading) return <LoadingSpinner text="Loading dashboard..." />;

  const statCards = [
    {
      label: 'Pending Reservations',
      value: stats?.pendingReservationCount || 0,
      icon: <Clock className="text-amber-500" size={24} />,
      color: 'bg-amber-500/10 border-amber-500/20',
      description: 'Require immediate action'
    },
    {
      label: "Today's Bookings",
      value: stats?.todayReservationCount || 0,
      icon: <Users className="text-emerald-500" size={24} />,
      color: 'bg-emerald-500/10 border-emerald-500/20',
      description: 'Confirmed for today'
    },
    {
      label: 'Menu Items',
      value: stats?.menuItemCount || 0,
      icon: <Utensils className="text-gold" size={24} />,
      color: 'bg-gold/10 border-gold/20',
      description: 'Total dishes offered'
    },
    {
      label: 'Active Categories',
      value: stats?.categoryCount || 0,
      icon: <Layers className="text-blue-500" size={24} />,
      color: 'bg-blue-500/10 border-blue-500/20',
      description: 'Menu sections'
    },
    {
      label: 'Gallery Photos',
      value: stats?.galleryImageCount || 0,
      icon: <ImageIcon className="text-purple-500" size={24} />,
      color: 'bg-purple-500/10 border-purple-500/20',
      description: 'Visual showcase'
    }
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold font-display text-text-primary">
          Welcome back, {user?.name || 'Admin'}!
        </h1>
        <p className="text-text-secondary mt-1">
          Here is what's happening at {restaurant?.name || 'La Bistro'} today.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
        {statCards.map((card) => (
          <div 
            key={card.label} 
            className={`p-6 rounded-2xl border ${card.color} backdrop-blur-sm transition-all hover:scale-[1.02] duration-300`}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 rounded-lg bg-white/5">
                {card.icon}
              </div>
            </div>
            <div className="space-y-1">
              <p className="text-3xl font-bold text-text-primary">{card.value}</p>
              <p className="text-sm font-medium text-text-primary">{card.label}</p>
              <p className="text-xs text-text-muted">{card.description}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Reservations */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold font-display text-text-primary flex items-center gap-2">
              Recent Pending Reservations
              {stats?.pendingReservationCount && stats.pendingReservationCount > 0 ? (
                <span className="px-2 py-0.5 text-xs bg-amber-500/20 text-amber-500 rounded-full">
                  {stats.pendingReservationCount} New
                </span>
              ) : null}
            </h2>
            <Link to="/admin/reservations" className="text-gold text-sm font-medium hover:underline flex items-center gap-1">
              View all <ArrowRight size={14} />
            </Link>
          </div>

          <div className="bg-bg-card border border-border rounded-2xl overflow-hidden shadow-sm">
            {stats?.recentPendingReservations && stats.recentPendingReservations.length > 0 ? (
              <div className="divide-y divide-border">
                {stats.recentPendingReservations.map((res) => (
                  <div key={res.id} className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-bg-elevated transition-colors">
                    <div className="space-y-1">
                      <p className="font-bold text-text-primary">{res.guestName}</p>
                      <div className="flex items-center gap-4 text-xs text-text-muted">
                        <span className="flex items-center gap-1">
                          <Users size={12} /> {res.partySize} Guests
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock size={12} /> {new Date(res.reservationDate).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button 
                        onClick={() => handleUpdateStatus(res.id, 'CONFIRMED')}
                        className="p-2 text-emerald-500 hover:bg-emerald-500/10 rounded-lg transition-colors group"
                        title="Confirm"
                      >
                        <CheckCircle size={20} />
                      </button>
                      <button 
                        onClick={() => handleUpdateStatus(res.id, 'CANCELLED')}
                        className="p-2 text-red-500 hover:bg-red-500/10 rounded-lg transition-colors group"
                        title="Cancel"
                      >
                        <XCircle size={20} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-12 text-center">
                <div className="w-16 h-16 bg-bg-elevated rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle size={32} className="text-text-muted" />
                </div>
                <p className="text-text-secondary font-medium">No pending reservations</p>
                <p className="text-text-muted text-sm mt-1">You're all caught up!</p>
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold font-display text-text-primary">Quick Actions</h2>
          <div className="bg-bg-card border border-border rounded-2xl p-6 shadow-sm space-y-3">
            <Link to="/admin/menu">
              <Button variant="secondary" className="w-full justify-start text-left h-auto py-4 px-5">
                <div className="flex items-center gap-4">
                  <div className="p-2 rounded-lg bg-gold/10 text-white">
                    <Plus size={20} />
                  </div>
                  <div>
                    <p className="font-bold text-sm">Add Menu Item</p>
                    <p className="text-xs text-text-muted">Create a new dish or drink</p>
                  </div>
                </div>
              </Button>
            </Link>
            
            <Link to="/admin/gallery">
              <Button variant="secondary" className="w-full justify-start text-left h-auto py-4 px-5">
                <div className="flex items-center gap-4">
                  <div className="p-2 rounded-lg bg-purple-500/10 text-purple-500">
                    <ImageIcon size={20} />
                  </div>
                  <div>
                    <p className="font-bold text-sm">Upload Photo</p>
                    <p className="text-xs text-text-muted">Add images to your gallery</p>
                  </div>
                </div>
              </Button>
            </Link>

            <Link to="/admin/settings">
              <Button variant="secondary" className="w-full justify-start text-left h-auto py-4 px-5">
                <div className="flex items-center gap-4">
                  <div className="p-2 rounded-lg bg-blue-500/10 text-blue-500">
                    <Settings size={20} />
                  </div>
                  <div>
                    <p className="font-bold text-sm">Update Hours</p>
                    <p className="text-xs text-text-muted">Manage operating schedule</p>
                  </div>
                </div>
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
