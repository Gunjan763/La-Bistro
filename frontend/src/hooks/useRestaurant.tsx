import React, { createContext, useContext, useState, useEffect } from 'react';
import { restaurantService } from '../services/api';
import type { RestaurantInfo } from '../types';

interface RestaurantContextType {
  restaurant: RestaurantInfo | null;
  loading: boolean;
}

const RestaurantContext = createContext<RestaurantContextType>({ restaurant: null, loading: true });

export const RestaurantProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [restaurant, setRestaurant] = useState<RestaurantInfo | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    restaurantService.getInfo()
      .then(setRestaurant)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <RestaurantContext.Provider value={{ restaurant, loading }}>
      {children}
    </RestaurantContext.Provider>
  );
};

export const useRestaurant = () => useContext(RestaurantContext);
