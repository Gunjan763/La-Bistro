import { useEffect, useState } from 'react';
import { restaurantService } from '../../services/api';
import type { RestaurantInfo } from '../../types';
import SectionHeading from '../../components/ui/SectionHeading';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import ErrorMessage from '../../components/ui/ErrorMessage';

const ContactPage = () => {
  const [restaurant, setRestaurant] = useState<RestaurantInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const fetchInfo = () => {
    setLoading(true);
    setError(null);
    restaurantService
      .getInfo()
      .then(setRestaurant)
      .catch((err) => setError(err.message || 'Failed to load contact info'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchInfo();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate form submission
    alert('Thank you for contacting us! We will get back to you soon.');
    setFormData({ name: '', email: '', subject: '', message: '' });
  };

  return (
    <div className="min-h-screen bg-bg-primary pt-24 pb-24">
      <div className="container-layout px-6 md:px-8">
        <SectionHeading
          subtitle="Get in Touch"
          title="Contact Us"
          description="Have a question or special request? We would love to hear from you."
        />

        {loading && <LoadingSpinner text="Loading contact info..." />}
        {error && <ErrorMessage message={error} onRetry={fetchInfo} />}

        {!loading && !error && restaurant && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 mt-16 items-start">
            {/* Contact Details */}
            <div className="animate-fade-in-up" style={{ animationDelay: '100ms' }}>
              <h3 className="font-display text-4xl font-bold text-text-primary mb-10">
                Reach Out to Us
              </h3>
              
              <div className="space-y-10">
                <div className="flex items-start gap-6 p-8 rounded-3xl bg-bg-card border border-border shadow-sm transition-all hover:shadow-xl hover:border-gold/30">
                  <div className="w-16 h-16 rounded-full bg-gold/10 flex items-center justify-center flex-shrink-0">
                    <svg className="w-8 h-8 text-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 0115 0z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="text-xl font-bold text-text-primary mb-3">Location</h4>
                    <p className="text-text-secondary text-lg leading-relaxed">{restaurant.address}</p>
                  </div>
                </div>

                <div className="flex items-start gap-6 p-8 rounded-3xl bg-bg-card border border-border shadow-sm transition-all hover:shadow-xl hover:border-gold/30">
                  <div className="w-16 h-16 rounded-full bg-gold/10 flex items-center justify-center flex-shrink-0">
                    <svg className="w-8 h-8 text-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="text-xl font-bold text-text-primary mb-3">Phone</h4>
                    <p className="text-text-secondary text-lg leading-relaxed">{restaurant.phone}</p>
                  </div>
                </div>

                <div className="flex items-start gap-6 p-8 rounded-3xl bg-bg-card border border-border shadow-sm transition-all hover:shadow-xl hover:border-gold/30">
                  <div className="w-16 h-16 rounded-full bg-gold/10 flex items-center justify-center flex-shrink-0">
                    <svg className="w-8 h-8 text-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="text-xl font-bold text-text-primary mb-3">Email</h4>
                    <p className="text-text-secondary text-lg leading-relaxed">{restaurant.email}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="animate-fade-in-up w-full max-w-xl mx-auto lg:mx-0" style={{ animationDelay: '300ms' }}>
              <div className="bg-bg-card border border-border rounded-3xl p-10 md:p-12 shadow-2xl">
                <h3 className="font-display text-3xl md:text-4xl font-bold text-text-primary mb-8 text-center">
                  Send us a Message
                </h3>
                
                <form onSubmit={handleSubmit} className="space-y-8">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                    <div>
                      <label htmlFor="name" className="block text-base font-medium text-text-secondary mb-3">
                        Your Name
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className="w-full px-5 py-4 rounded-xl bg-bg-elevated border border-border focus:border-gold focus:ring-1 focus:ring-gold outline-none transition-all text-text-primary text-lg placeholder:text-text-muted/50"
                        placeholder="John Doe"
                      />
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-base font-medium text-text-secondary mb-3">
                        Your Email
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="w-full px-5 py-4 rounded-xl bg-bg-elevated border border-border focus:border-gold focus:ring-1 focus:ring-gold outline-none transition-all text-text-primary text-lg placeholder:text-text-muted/50"
                        placeholder="john@example.com"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label htmlFor="subject" className="block text-base font-medium text-text-secondary mb-3">
                      Subject
                    </label>
                    <input
                      type="text"
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                      className="w-full px-5 py-4 rounded-xl bg-bg-elevated border border-border focus:border-gold focus:ring-1 focus:ring-gold outline-none transition-all text-text-primary text-lg placeholder:text-text-muted/50"
                      placeholder="How can we help?"
                    />
                  </div>

                  <div>
                    <label htmlFor="message" className="block text-base font-medium text-text-secondary mb-3">
                      Message
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      rows={6}
                      className="w-full px-5 py-4 rounded-xl bg-bg-elevated border border-border focus:border-gold focus:ring-1 focus:ring-gold outline-none transition-all text-text-primary text-lg placeholder:text-text-muted/50 resize-none"
                      placeholder="Type your message here..."
                    />
                  </div>

                  <div className="pt-4">
                    <button
                      type="submit"
                      className="w-full px-8 py-5 bg-gold hover:bg-gold-light text-bg-primary font-bold tracking-widest text-lg uppercase rounded-full transition-all duration-300 shadow-[0_4px_20px_rgba(201,169,110,0.3)] hover:shadow-[0_6px_25px_rgba(201,169,110,0.5)] hover:-translate-y-1"
                    >
                      Send Message
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ContactPage;
