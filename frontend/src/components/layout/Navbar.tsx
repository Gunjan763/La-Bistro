import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../hooks/useRedux';
import { toggleMobileMenu, closeMobileMenu, setScrolled } from '../../store/slices/uiSlice';

import { useRestaurant } from '../../hooks/useRestaurant';

const Navbar = () => {
  const dispatch = useAppDispatch();
  const { isMobileMenuOpen, isScrolled } = useAppSelector((s) => s.ui);
  const { restaurant } = useRestaurant();

  useEffect(() => {
    const handleScroll = () => {
      dispatch(setScrolled(window.scrollY > 50));
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [dispatch]);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = isMobileMenuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isMobileMenuOpen]);

  const navLinks = [
    { label: 'Home', href: '/' },
    { label: 'Menu', href: '/menu' },
    { label: 'Gallery', href: '/gallery' },
    { label: 'Contact', href: '/contact' },
  ];

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          isScrolled
            ? 'glass-effect py-4 shadow-[0_4px_30px_rgba(0,0,0,0.5)]'
            : 'bg-transparent py-6'
        }`}
      >
        <div className="container-layout px-6 md:px-8 flex items-center justify-between gap-8">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center gap-3 group shrink-0"
            onClick={() => dispatch(closeMobileMenu())}
          >
            <span className="text-gold text-2xl">✦</span>
            <span className="font-display text-xl md:text-2xl font-bold text-text-primary tracking-wide group-hover:text-gold transition-colors duration-300">
              {restaurant?.name || 'La Bistro'}
            </span>
          </Link>

          {/* Desktop Nav */}
          <ul className="hidden md:flex items-center justify-center gap-10 flex-grow">
            {navLinks.map((link) => (
              <li key={link.label}>
                <Link
                  to={link.href}
                  className="text-text-secondary text-sm font-medium tracking-widest uppercase hover:text-gold transition-colors duration-300 relative after:content-[''] after:absolute after:-bottom-1.5 after:left-0 after:w-0 after:h-[2px] after:bg-gold after:transition-all after:duration-300 hover:after:w-full"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>

          {/* Reserve CTA (desktop) */}
          <div className="hidden md:flex items-center shrink-0">
            <Link
              to="/reservation"
              className="inline-flex items-center px-6 py-3 text-xs font-bold tracking-widest uppercase bg-gold text-bg-primary rounded-lg hover:bg-gold-light transition-all duration-400 hover:scale-105 hover:shadow-[0_4px_20px_rgba(201,169,110,0.4)]"
            >
              BOOK A TABLE
            </Link>
          </div>

          {/* Hamburger */}
          <button
            id="mobile-menu-toggle"
            onClick={() => dispatch(toggleMobileMenu())}
            className="md:hidden flex flex-col gap-1.5 p-2 cursor-pointer shrink-0"
            aria-label="Toggle menu"
          >
            <span className={`w-6 h-0.5 bg-text-primary transition-all duration-300 ${isMobileMenuOpen ? 'rotate-45 translate-y-2' : ''}`} />
            <span className={`w-6 h-0.5 bg-text-primary transition-all duration-300 ${isMobileMenuOpen ? 'opacity-0' : ''}`} />
            <span className={`w-6 h-0.5 bg-text-primary transition-all duration-300 ${isMobileMenuOpen ? '-rotate-45 -translate-y-2' : ''}`} />
          </button>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <div
        className={`fixed inset-0 z-40 bg-bg-primary/98 backdrop-blur-xl flex flex-col items-center justify-center gap-8 transition-all duration-500 md:hidden ${
          isMobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      >
        {navLinks.map((link, i) => (
          <Link
            key={link.label}
            to={link.href}
            onClick={() => dispatch(closeMobileMenu())}
            className="font-display text-3xl text-text-primary hover:text-gold transition-colors duration-300"
            style={{ animationDelay: `${i * 80}ms` }}
          >
            {link.label}
          </Link>
        ))}
        <Link
          to="/reservation"
          onClick={() => dispatch(closeMobileMenu())}
          className="mt-6 px-8 py-4 text-sm font-bold tracking-widest uppercase bg-gold text-bg-primary rounded-lg hover:bg-gold-light transition-all duration-300 hover:shadow-[0_4px_20px_rgba(201,169,110,0.4)]"
        >
          BOOK A TABLE
        </Link>
      </div>
    </>
  );
};

export default Navbar;
