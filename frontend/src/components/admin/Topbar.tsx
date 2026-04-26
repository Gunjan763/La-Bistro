import { Menu } from 'lucide-react';
import { useAppSelector } from '../../hooks/useRedux';
import { useRestaurant } from '../../hooks/useRestaurant';

interface TopbarProps {
  onMenuClick: () => void;
}

const Topbar = ({ onMenuClick }: TopbarProps) => {
  const { user } = useAppSelector((state) => state.auth);
  const { restaurant } = useRestaurant();

  return (
    <header className="h-16 bg-bg-secondary border-b border-border flex items-center justify-between px-4 lg:px-8 z-30">
      <div className="flex items-center">
        <button
          onClick={onMenuClick}
          className="p-2 -ml-2 mr-4 text-text-secondary hover:text-text-primary hover:bg-bg-elevated rounded-lg lg:hidden transition-colors"
        >
          <Menu size={24} />
        </button>
        <h2 className="text-lg font-semibold font-display text-text-primary hidden sm:block">
          {restaurant?.name || 'La Bistro'} Management
        </h2>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-medium text-text-primary">{user?.name || 'Admin'}</p>
            <p className="text-xs text-text-muted">{user?.email || 'admin@labistro.com'}</p>
          </div>
          <div className="w-10 h-10 rounded-full bg-gold/20 border border-gold/30 flex items-center justify-center text-gold font-bold">
            {user?.name?.charAt(0) || 'A'}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Topbar;
