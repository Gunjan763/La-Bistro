import { useEffect, useState } from 'react';
import { menuService, categoryService } from '../../services/api';
import type { MenuItem, Category } from '../../types';
import SectionHeading from '../../components/ui/SectionHeading';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import ErrorMessage from '../../components/ui/ErrorMessage';
import MenuCard from '../../components/ui/MenuCard';

const MenuPage = () => {
  const [items, setItems] = useState<MenuItem[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>('all');

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [cats, menu] = await Promise.all([
        categoryService.getAll(),
        menuService.getAll()
      ]);
      setCategories(cats);
      setItems(menu);
    } catch (err: any) {
      setError(err.message || 'Failed to load menu');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const filteredItems = activeCategory === 'all'
    ? items
    : items.filter(item => item.categoryId === activeCategory);

  return (
    <div className="min-h-screen bg-bg-primary pt-24 pb-24">
      <div className="px-6 md:px-8 lg:px-12">
        <SectionHeading
          subtitle="Discover Our"
          title="Culinary Offerings"
          description="Explore our diverse menu featuring fresh ingredients, bold flavors, and exquisite presentation."
        />

        {loading && <LoadingSpinner text="Loading menu..." />}
        {error && <ErrorMessage message={error} onRetry={fetchData} />}

        {!loading && !error && (
          <>
            {/* Category Filter */}
            <div className="flex flex-wrap justify-center gap-4 mb-16">
              <button
                onClick={() => setActiveCategory('all')}
                className={`px-6 py-3 rounded-full text-sm font-semibold tracking-wide uppercase transition-all duration-300 ${
                  activeCategory === 'all'
                    ? 'bg-gold text-black shadow-lg'
                    : 'border border-border text-text-secondary hover:border-gold hover:text-gold'
                }`}
              >
                All
              </button>

              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`px-6 py-3 rounded-full text-sm font-semibold tracking-wide uppercase transition-all duration-300 ${
                    activeCategory === cat.id
                      ? 'bg-gold text-black shadow-lg'
                      : 'border border-border text-text-secondary hover:border-gold hover:text-gold'
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>

            {/* Menu Grid */}
            {filteredItems.length === 0 ? (
              <p className="text-center text-text-secondary py-12 text-lg">
                No items found in this category.
              </p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
                {filteredItems.map((item, i) => (
                  <div
                    key={item.id}
                    className="animate-fade-in-up"
                    style={{ animationDelay: `${(i % 8) * 100}ms` }}
                  >
                    <MenuCard item={item} />
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default MenuPage;
