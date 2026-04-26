import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { restaurantService } from '../../services/api';
import type { RestaurantInfo } from '../../types';

const HeroSection = () => {
  const [restaurant, setRestaurant] = useState<RestaurantInfo | null>(null);

  useEffect(() => {
    restaurantService.getInfo().then(setRestaurant).catch(console.error);
  }, []);

  return (
    <section id="home" className="relative h-screen min-h-[700px] flex items-center justify-center overflow-hidden">
      {/* Background with overlay */}
      <div className="absolute inset-0">
        <img
          src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1920&q=80"
          alt="Restaurant ambiance"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-bg-primary" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/40 to-transparent" />
      </div>

      {/* Decorative elements */}
      <div className="absolute top-1/4 left-8 w-px h-24 bg-gradient-to-b from-transparent via-gold/30 to-transparent hidden lg:block" />
      <div className="absolute top-1/3 right-8 w-px h-32 bg-gradient-to-b from-transparent via-gold/20 to-transparent hidden lg:block" />

      {/* Content */}
      <div className="relative z-10 container-layout px-6 md:px-8 flex flex-col items-start justify-center pt-20">
        {/* Ornament */}
        <div className="mb-6 animate-fade-in" style={{ animationDelay: '200ms' }}>
          <span className="text-gold text-sm tracking-[0.4em] uppercase font-body font-bold">
            ✦ &nbsp; Premium Dining Experience &nbsp; ✦
          </span>
        </div>

        {/* Restaurant Name / Heading */}
        <h1
          className="font-display text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold text-white mb-6 animate-fade-in-up leading-tight max-w-4xl"
          style={{ animationDelay: '400ms' }}
        >
          Enjoy Our Delicious Meal
        </h1>

        {/* Tagline */}
        <p
          className="text-text-secondary text-lg md:text-xl font-light tracking-wide max-w-2xl mb-16 animate-fade-in-up"
          style={{ animationDelay: '600ms' }}
        >
          Where every dish tells a story of heritage, flavor, and culinary excellence. Discover an unforgettable dining experience at {restaurant?.name || 'La Bistro'}.
        </p>

        {/* CTAs */}
        <div
          className="flex flex-col sm:flex-row items-center justify-start gap-8 animate-fade-in-up w-full sm:w-auto"
          style={{ animationDelay: '800ms' }}
        >
          <Link
            to="/reservation"
            className="w-full sm:w-auto text-center px-16 py-5 bg-gold text-bg-primary font-bold text-base tracking-widest uppercase rounded-lg hover:bg-gold-light transition-all duration-300 shadow-[0_4px_20px_rgba(201,169,110,0.3)] hover:shadow-[0_6px_25px_rgba(201,169,110,0.5)] hover:scale-[1.02]"
          >
            BOOK A TABLE
          </Link>
          <Link
            to="/menu"
            className="w-full sm:w-auto text-center px-16 py-5 text-gold border-2 border-gold font-bold text-base tracking-widest uppercase rounded-lg hover:bg-gold hover:text-bg-primary transition-all duration-300 hover:scale-[1.02]"
          >
            Explore Menu
          </Link>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 rounded-full border border-gold/30 flex items-start justify-center p-1.5">
          <div className="w-1 h-2.5 rounded-full bg-gold/60 animate-pulse" />
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
