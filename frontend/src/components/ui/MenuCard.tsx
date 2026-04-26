import { getAssetUrl } from '../../services/api';
import type { MenuItem } from '../../types';

interface MenuCardProps {
  item: MenuItem;
}

const MenuCard = ({ item }: MenuCardProps) => {
  const price = typeof item.price === 'string' ? parseFloat(item.price) : item.price;
  const hasImage = item.imageUrl && item.imageUrl.length > 0;

  return (
    <div className="group bg-bg-card border border-border rounded-2xl overflow-hidden hover:border-gold/30 transition-all duration-500 hover:shadow-[0_8px_40px_rgba(201,169,110,0.08)] hover:-translate-y-1 h-full flex flex-col">
      {/* Image */}
      <div className="relative h-48 sm:h-52 overflow-hidden bg-bg-elevated flex-shrink-0">
        {hasImage ? (
          <img
            src={getAssetUrl(item.imageUrl)}
            alt={item.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <svg className="w-16 h-16 text-text-muted/30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={0.5}
                d="M12 8.25v-1.5m0 1.5c-1.355 0-2.697.056-4.024.166C6.845 8.51 6 9.473 6 10.608v2.513m6-4.87c1.355 0 2.697.055 4.024.165C17.155 8.51 18 9.473 18 10.608v2.513m-3-4.87v-1.5m-6 1.5v-1.5m12 9.75l-1.5.75a3.354 3.354 0 01-3 0 3.354 3.354 0 00-3 0 3.354 3.354 0 01-3 0 3.354 3.354 0 00-3 0 3.354 3.354 0 01-3 0L3 16.5m18-12.75H3" />
            </svg>
          </div>
        )}

        {/* Badges */}
       <div className="absolute top-4 left-4 flex gap-2 z-10">
<span
  className={`inline-flex items-center justify-center px-3 py-1 rounded-full text-xs font-semibold tracking-wide uppercase shadow-md ${
    item.isVeg
      ? 'bg-emerald-500 text-white'
      : 'bg-red-500 text-white'
  }`}
>
  {item.isVeg ? 'VEG' : 'NON-VEG'}
</span>
  {item.isSpicy && (
    <span className="inline-flex items-center px-6 py-1.5 rounded-full text-xs font-semibold tracking-wide uppercase bg-orange-500 text-white shadow-md">
      🌶 SPICY
    </span>
  )}
</div>
        {/* Price Overlay */}
        <div className="absolute bottom-3 right-3">
          <span className="px-3 py-1.5 rounded-full text-sm font-bold text-bg-primary gold-gradient shadow-lg">
            ${price.toFixed(2)}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-5 flex-grow flex flex-col">
        <h3 className="font-display text-lg font-semibold text-text-primary group-hover:text-gold transition-colors duration-300 mb-1.5">
          {item.name}
        </h3>
        <p className="text-text-secondary text-sm leading-relaxed line-clamp-3">
          {item.description}
        </p>
      </div>
    </div>
  );
};

export default MenuCard;
