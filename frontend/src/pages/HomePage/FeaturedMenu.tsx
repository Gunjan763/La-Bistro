import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { menuService } from '../../services/api';
import type { MenuItem } from '../../types';
import SectionHeading from '../../components/ui/SectionHeading';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import ErrorMessage from '../../components/ui/ErrorMessage';
import MenuCard from '../../components/ui/MenuCard';

const FeaturedMenu = () => {
  const [items, setItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchFeatured = () => {
    setLoading(true);
    setError(null);
    menuService
      .getFeatured(8)
      .then(setItems)
      .catch((err) => setError(err.message || 'Failed to load menu'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchFeatured();
  }, []);

  return (
    <section id="menu" className="section-padding bg-bg-primary">
      <div className="container-layout px-6 md:px-8">
        <SectionHeading
          subtitle="Our Specialties"
          title="Featured Dishes"
          description="Handpicked favorites from our kitchen, crafted with the finest ingredients and time-honored recipes."
        />

        {loading && <LoadingSpinner text="Loading our finest dishes..." />}

        {error && <ErrorMessage message={error} onRetry={fetchFeatured} />}

        {!loading && !error && items.length === 0 && (
          <p className="text-center text-text-secondary py-12 text-lg">
            No featured items available at the moment.
          </p>
        )}

        {!loading && !error && items.length > 0 && (
          <div className="mt-16">
            {/* Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 mb-32">
              {items.map((item, i) => (
                <div
                  key={item.id}
                  className="animate-fade-in-up"
                  style={{ animationDelay: `${i * 100}ms` }}
                >
                  <MenuCard item={item} />
                </div>
              ))}
            </div>

            {/* CTA */}
          <div className="text-center mt-10">
              <Link
                to="/menu"
                className="inline-flex items-center gap-2 px-10 py-5 text-base font-bold tracking-widest uppercase text-gold border-2 border-gold/30 rounded-lg hover:border-gold hover:bg-gold hover:text-bg-primary transition-all duration-300 shadow-[0_4px_20px_rgba(201,169,110,0.2)] hover:shadow-[0_6px_25px_rgba(201,169,110,0.4)] hover:scale-[1.02]"
              >
                View Full Menu
                <svg className="w-5 h-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default FeaturedMenu;