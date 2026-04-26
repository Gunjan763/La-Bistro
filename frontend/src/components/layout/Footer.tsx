import { useRestaurant } from '../../hooks/useRestaurant';

const Footer = () => {
  const { restaurant } = useRestaurant();
  const year = new Date().getFullYear();

  return (
    <footer className="bg-bg-secondary border-t border-border">
      <div className="container-layout px-6 md:px-8 py-16 md:py-24">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-16 md:gap-20">
          {/* Brand */}
          <div className="flex flex-col items-start">
            <div className="flex items-center gap-3 mb-6">
              <span className="text-gold text-2xl">✦</span>
              <span className="font-display text-2xl font-bold text-text-primary">{restaurant?.name || 'La Bistro'}</span>
            </div>
            <p className="text-text-secondary text-base leading-relaxed max-w-sm">
              {restaurant?.description || 'Authentic Indian cuisine crafted with passion and tradition. Every dish tells a story of heritage and flavor.'}
            </p>
          </div>

          {/* Quick Links */}
          <div className="flex flex-col md:items-center">
            <div className="w-full md:w-auto">
              <h4 className="font-display text-xl font-semibold text-text-primary mb-6">
                Quick Links
              </h4>
              <ul className="space-y-4">
                {['Home', 'Menu', 'Gallery', 'Contact'].map((item) => (
                  <li key={item}>
                    <a
                      href={`/${item.toLowerCase()}`}
                      className="text-text-secondary text-base hover:text-gold transition-colors duration-300"
                    >
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Contact */}
          <div className="flex flex-col md:items-end">
            <div className="w-full md:w-auto md:text-right">
              <h4 className="font-display text-xl font-semibold text-text-primary mb-6">
                Contact Us
              </h4>
              <ul className="space-y-4 text-text-secondary text-base">
                <li className="flex items-start md:justify-end gap-3">
                  <span className="md:order-1">{restaurant?.address || '123 Main Street, Your City'}</span>
                  <svg className="w-5 h-5 text-gold mt-0.5 shrink-0 md:order-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 0115 0z" />
                  </svg>
                </li>
                <li className="flex items-start md:justify-end gap-3">
                  <span className="md:order-1">{restaurant?.phone || '+1-555-123-4567'}</span>
                  <svg className="w-5 h-5 text-gold mt-0.5 shrink-0 md:order-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
                  </svg>
                </li>
                <li className="flex items-start md:justify-end gap-3">
                  <span className="md:order-1">{restaurant?.email || 'info@labistro.com'}</span>
                  <svg className="w-5 h-5 text-gold mt-0.5 shrink-0 md:order-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                  </svg>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-16 pt-8 border-t border-border text-center">
          <p className="text-text-muted text-sm tracking-wider">
            © {year} {restaurant?.name || 'La Bistro'}. All rights reserved. Crafted with ❤️
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
