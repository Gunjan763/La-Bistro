import { useState } from 'react';
import { reservationService } from '../../services/api';
import SectionHeading from '../../components/ui/SectionHeading';
import Button from '../../components/ui/Button';
import { useRestaurant } from '../../hooks/useRestaurant';

const ReservationPage = () => {
  const { restaurant } = useRestaurant();
  const [formData, setFormData] = useState({
    customerName: '',
    email: '',
    phone: '',
    date: '',
    time: '',
    partySize: 2,
    specialRequests: ''
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const reservationDate = new Date(`${formData.date}T${formData.time}`).toISOString();
      await reservationService.create({
        guestName: formData.customerName,
        guestEmail: formData.email,
        guestPhone: formData.phone,
        reservationDate,
        partySize: Number(formData.partySize),
        specialRequests: formData.specialRequests
      });
      setSuccess(true);
      setFormData({
        customerName: '',
        email: '',
        phone: '',
        date: '',
        time: '',
        partySize: 2,
        specialRequests: ''
      });
    } catch (err: any) {
      setError(err.message || 'Failed to submit reservation. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-bg-primary pt-24 pb-24 relative overflow-hidden">
      {/* Background accents */}
      <div className="absolute top-1/4 left-0 w-[500px] h-[500px] bg-gold/[0.02] rounded-full blur-[100px]" />
      <div className="absolute bottom-1/4 right-0 w-[500px] h-[500px] bg-gold/[0.02] rounded-full blur-[100px]" />

      <div className="container-layout px-6 md:px-8 relative z-10">
        <SectionHeading
          subtitle="Book a Table"
          title="Make a Reservation"
          description="Join us for an unforgettable dining experience. Reserve your table below."
        />

        <div className="mt-16 bg-bg-card border border-border rounded-3xl p-10 md:p-12 shadow-2xl max-w-4xl mx-auto">
          {success ? (
            <div className="text-center py-16 animate-fade-in-up">
              <div className="w-24 h-24 bg-emerald-500/20 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-8">
                <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-4xl font-display font-bold text-text-primary mb-6">Reservation Confirmed!</h3>
              <p className="text-text-secondary text-xl mb-10 max-w-lg mx-auto leading-relaxed">
                Thank you for choosing {restaurant?.name || 'La Bistro'}. We have sent a confirmation email with your reservation details.
              </p>
              <Button onClick={() => setSuccess(false)} variant="primary" size="lg">
                Make Another Booking
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-8 animate-fade-in-up">
              {error && (
                <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-500 rounded-lg text-sm text-center">
                  {error}
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-3">
                  <label htmlFor="customerName" className="block text-base font-medium text-text-secondary">
                    Full Name
                  </label>
                  <input
                    type="text"
                    id="customerName"
                    name="customerName"
                    required
                    value={formData.customerName}
                    onChange={handleChange}
                    className="w-full px-5 py-4 bg-bg-elevated border border-border rounded-xl text-text-primary text-lg focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold transition-colors placeholder:text-text-muted/50"
                    placeholder="John Doe"
                  />
                </div>

                <div className="space-y-3">
                  <label htmlFor="email" className="block text-base font-medium text-text-secondary">
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-5 py-4 bg-bg-elevated border border-border rounded-xl text-text-primary text-lg focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold transition-colors placeholder:text-text-muted/50"
                    placeholder="john@example.com"
                  />
                </div>

                <div className="space-y-3">
                  <label htmlFor="phone" className="block text-base font-medium text-text-secondary">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    required
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full px-5 py-4 bg-bg-elevated border border-border rounded-xl text-text-primary text-lg focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold transition-colors placeholder:text-text-muted/50"
                    placeholder="+1 (555) 000-0000"
                  />
                </div>

                <div className="space-y-3">
                  <label htmlFor="partySize" className="block text-base font-medium text-text-secondary">
                    Party Size
                  </label>
                  <select
                    id="partySize"
                    name="partySize"
                    required
                    value={formData.partySize}
                    onChange={handleChange}
                    className="w-full px-5 py-4 bg-bg-elevated border border-border rounded-xl text-text-primary text-lg focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold transition-colors appearance-none"
                  >
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, '10+'].map(num => (
                      <option key={num} value={num === '10+' ? 10 : num}>
                        {num} {num === 1 ? 'Person' : 'People'}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-3">
                  <label htmlFor="date" className="block text-base font-medium text-text-secondary">
                    Date
                  </label>
                  <input
                    type="date"
                    id="date"
                    name="date"
                    required
                    value={formData.date}
                    onChange={handleChange}
                    className="w-full px-5 py-4 bg-bg-elevated border border-border rounded-xl text-text-primary text-lg focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold transition-colors"
                  />
                </div>

                <div className="space-y-3">
                  <label htmlFor="time" className="block text-base font-medium text-text-secondary">
                    Time
                  </label>
                  <input
                    type="time"
                    id="time"
                    name="time"
                    required
                    value={formData.time}
                    onChange={handleChange}
                    className="w-full px-5 py-4 bg-bg-elevated border border-border rounded-xl text-text-primary text-lg focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold transition-colors"
                  />
                </div>
              </div>

              <div className="space-y-3">
                <label htmlFor="specialRequests" className="block text-base font-medium text-text-secondary">
                  Special Requests (Optional)
                </label>
                <textarea
                  id="specialRequests"
                  name="specialRequests"
                  value={formData.specialRequests}
                  onChange={handleChange}
                  rows={5}
                  className="w-full px-5 py-4 bg-bg-elevated border border-border rounded-xl text-text-primary text-lg focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold transition-colors resize-none placeholder:text-text-muted/50"
                  placeholder="Any allergies, special occasions, or seating preferences?"
                />
              </div>

              <div className="pt-6 flex justify-center">
                <Button type="submit" variant="primary" size="lg" isLoading={loading} className="w-full sm:w-auto min-w-[250px]">
                  Confirm Reservation
                </Button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReservationPage;
