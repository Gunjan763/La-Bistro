import { useEffect, useState } from 'react';
import { restaurantService } from '../../services/api';
import type { RestaurantInfo } from '../../types';
import SectionHeading from '../../components/ui/SectionHeading';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import ErrorMessage from '../../components/ui/ErrorMessage';

const AboutSection = () => {
  const [restaurant, setRestaurant] = useState<RestaurantInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchInfo = () => {
    setLoading(true);
    setError(null);
    restaurantService
      .getInfo()
      .then(setRestaurant)
      .catch((err) => setError(err.message || 'Failed to load restaurant info'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchInfo();
  }, []);

  return (
    <section id="about" className="section-padding bg-bg-secondary relative overflow-hidden">
      {/* Subtle decorative bg */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-gold/[0.02] rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-72 h-72 bg-gold/[0.02] rounded-full blur-3xl" />

      <div className="container-layout px-6 md:px-8 relative z-10">
        <SectionHeading subtitle="Our Story" title="About Us" />

        {loading && <LoadingSpinner text="Loading our story..." />}
        {error && <ErrorMessage message={error} onRetry={fetchInfo} />}

        {!loading && !error && restaurant && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Image Side */}
            <div className="relative animate-fade-in-up">
              <div className="relative rounded-2xl overflow-hidden aspect-[4/3]">
                <img
                  src="https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&q=80"
                  alt="Fine dining experience"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
              </div>
              {/* Floating accent card */}
              <div className="absolute -bottom-6 -right-4 md:-right-8 glass-effect rounded-xl p-5 shadow-2xl">
                <div className="text-center">
                  <span className="block font-display text-3xl font-bold gold-text-gradient">5+</span>
                  <span className="text-text-secondary text-xs tracking-wider uppercase">Years of Excellence</span>
                </div>
              </div>
            </div>

            {/* Content Side */}
            <div className="animate-fade-in-up" style={{ animationDelay: '200ms' }}>
              <p className="text-text-secondary text-base md:text-lg leading-relaxed mb-6">
                {restaurant.description}
              </p>
              <p className="text-text-secondary text-base leading-relaxed mb-8">
                At {restaurant.name}, we believe that every meal is an experience. Our chefs
                blend traditional techniques with modern creativity to bring you dishes that
                celebrate the rich culinary heritage of India.
              </p>

              {/* Info cards */}
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-bg-card border border-border">
                  <svg className="w-6 h-6 text-gold mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 0115 0z" />
                  </svg>
                  <h4 className="text-text-primary text-sm font-semibold mb-1">Visit Us</h4>
                  <p className="text-text-muted text-xs leading-relaxed">{restaurant.address}</p>
                </div>
                <div className="p-4 rounded-xl bg-bg-card border border-border">
                  <svg className="w-6 h-6 text-gold mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
                  </svg>
                  <h4 className="text-text-primary text-sm font-semibold mb-1">Call Us</h4>
                  <p className="text-text-muted text-xs">{restaurant.phone}</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default AboutSection;
