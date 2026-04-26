import { useState, useEffect } from 'react';
import { Check, X, Trash2, Calendar as CalendarIcon, Clock, Users } from 'lucide-react';
import { reservationService } from '../../../services/api';
import type { Reservation } from '../../../types';
import Button from '../../../components/ui/Button';
import { TableSkeleton } from '../../../components/ui/SkeletonLoader';
import EmptyState from '../../../components/ui/EmptyState';
import toast from 'react-hot-toast';

const statusColors = {
  PENDING: 'bg-yellow-500/10 text-yellow-500',
  CONFIRMED: 'bg-emerald-500/10 text-emerald-500',
  COMPLETED: 'bg-blue-500/10 text-blue-500',
  CANCELLED: 'bg-red-500/10 text-red-500',
};

const ReservationManager = () => {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Filters
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [dateFilter, setDateFilter] = useState<string>('');

  const [isProcessing, setIsProcessing] = useState<string | null>(null);

  const fetchReservations = async () => {
    try {
      setIsLoading(true);
      const data = await reservationService.getAll(statusFilter, dateFilter);
      // Sort by date (newest first for upcoming, but ideally by reservation date)
      setReservations(data.sort((a, b) => new Date(a.reservationDate).getTime() - new Date(b.reservationDate).getTime()));
    } catch (error) {
      toast.error('Failed to load reservations');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchReservations();
  }, [statusFilter, dateFilter]); // Refetch when filters change

  const handleStatusUpdate = async (id: string, action: 'confirm' | 'cancel') => {
    try {
      setIsProcessing(id);
      if (action === 'confirm') {
        await reservationService.confirm(id);
        toast.success('Reservation confirmed');
      } else {
        await reservationService.cancel(id);
        toast.success('Reservation cancelled');
      }
      fetchReservations();
    } catch (error) {
      toast.error(`Failed to ${action} reservation`);
    } finally {
      setIsProcessing(null);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this reservation record?')) return;
    try {
      setIsProcessing(id);
      await reservationService.delete(id);
      toast.success('Reservation deleted');
      fetchReservations();
    } catch (error) {
      toast.error('Failed to delete reservation');
    } finally {
      setIsProcessing(null);
    }
  };

  const formatDate = (dateString: string) => {
    const d = new Date(dateString);
    return {
      date: d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }),
      time: d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
    };
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold font-display text-text-primary">Reservations</h1>
          <p className="text-text-secondary text-sm mt-1">Manage table bookings and guest requests.</p>
        </div>
        
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <input
            type="date"
            className="bg-bg-elevated border border-border rounded-lg px-4 py-2 text-sm text-text-primary focus:outline-none focus:border-gold flex-1 sm:w-auto"
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
          />
          <select
            className="bg-bg-elevated border border-border rounded-lg px-4 py-2 text-sm text-text-primary focus:outline-none focus:border-gold flex-1 sm:w-auto"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="">All Statuses</option>
            <option value="PENDING">Pending</option>
            <option value="CONFIRMED">Confirmed</option>
            <option value="COMPLETED">Completed</option>
            <option value="CANCELLED">Cancelled</option>
          </select>
        </div>
      </div>

      <div className="bg-bg-card border border-border rounded-xl overflow-hidden">
        {isLoading ? (
          <div className="p-6"><TableSkeleton rows={5} cols={6} /></div>
        ) : reservations.length === 0 ? (
          <EmptyState
            title="No reservations found"
            description={dateFilter || statusFilter ? "No reservations match your current filters." : "You have no reservations yet."}
            actionLabel={dateFilter || statusFilter ? "Clear Filters" : undefined}
            onAction={() => { setDateFilter(''); setStatusFilter(''); }}
            icon={<CalendarIcon size={32} />}
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-bg-elevated/50 text-text-secondary">
                <tr>
                  <th className="px-6 py-4 font-medium">Guest Details</th>
                  <th className="px-6 py-4 font-medium">Date & Time</th>
                  <th className="px-6 py-4 font-medium">Party Size</th>
                  <th className="px-6 py-4 font-medium">Status</th>
                  <th className="px-6 py-4 font-medium">Notes</th>
                  <th className="px-6 py-4 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {reservations.map((res) => {
                  const { date, time } = formatDate(res.reservationDate);
                  return (
                    <tr key={res.id} className="hover:bg-bg-elevated/30 transition-colors">
                      <td className="px-6 py-4">
                        <p className="font-medium text-text-primary">{res.guestName}</p>
                        <p className="text-xs text-text-muted">{res.guestEmail}</p>
                        <p className="text-xs text-text-muted">{res.guestPhone}</p>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-1.5 text-text-primary mb-1">
                          <CalendarIcon size={14} className="text-text-muted" />
                          <span>{date}</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-text-secondary text-xs">
                          <Clock size={14} className="text-text-muted" />
                          <span>{time}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-1.5 text-text-primary">
                          <Users size={16} className="text-gold" />
                          <span className="font-medium">{res.partySize} {res.partySize > 1 ? 'Guests' : 'Guest'}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-bold tracking-wider ${statusColors[res.status]}`}>
                          {res.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-text-secondary text-xs max-w-[200px] truncate" title={res.specialRequests || ''}>
                        {res.specialRequests || '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right space-x-2">
                        {res.status === 'PENDING' && (
                          <>
                            <button
                              onClick={() => handleStatusUpdate(res.id, 'confirm')}
                              disabled={isProcessing === res.id}
                              className="p-1.5 rounded bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500 hover:text-white transition-colors disabled:opacity-50"
                              title="Confirm"
                            >
                              <Check size={16} />
                            </button>
                            <button
                              onClick={() => handleStatusUpdate(res.id, 'cancel')}
                              disabled={isProcessing === res.id}
                              className="p-1.5 rounded bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition-colors disabled:opacity-50"
                              title="Cancel"
                            >
                              <X size={16} />
                            </button>
                          </>
                        )}
                        <button
                          onClick={() => handleDelete(res.id)}
                          disabled={isProcessing === res.id}
                          className="p-1.5 rounded text-text-muted hover:text-red-500 hover:bg-bg-elevated transition-colors disabled:opacity-50"
                          title="Delete Record"
                        >
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReservationManager;
