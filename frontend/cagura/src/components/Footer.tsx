import { Link, useLocation } from 'react-router-dom';
import './Footer.css';

const SocialIcon = ({ d }: { d: string }) => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path d={d} />
  </svg>
);

const ICONS = {
  instagram: 'M12 2.163c3.204 0 3.584.012 4.85.07 1.366.062 2.633.334 3.608 1.308.975.975 1.246 2.242 1.308 3.608.058 1.266.07 1.646.07 4.85s-.012 3.584-.07 4.85c-.062 1.366-.334 2.633-1.308 3.608-.975.975-2.242 1.246-3.608 1.308-1.266.058-1.646.07-4.85.07s-3.584-.012-4.85-.07c-1.366-.062-2.633-.334-3.608-1.308-.975-.975-1.246-2.242-1.308-3.608C2.175 15.584 2.163 15.204 2.163 12s.012-3.584.07-4.85c.062-1.366.334-2.633 1.308-3.608.975-.975 2.242-1.246 3.608-1.308C8.416 2.175 8.796 2.163 12 2.163zm0-2.163C8.741 0 8.332.014 7.052.072 5.197.157 3.355.673 2.014 2.014.673 3.355.157 5.197.072 7.052.014 8.332 0 8.741 0 12c0 3.259.014 3.668.072 4.948.085 1.855.601 3.697 1.942 5.038 1.341 1.341 3.183 1.857 5.038 1.942C8.332 23.986 8.741 24 12 24s3.668-.014 4.948-.072c1.855-.085 3.697-.601 5.038-1.942 1.341-1.341 1.857-3.183 1.942-5.038.058-1.28.072-1.689.072-4.948s-.014-3.668-.072-4.948c-.085-1.855-.601-3.697-1.942-5.038C20.645.673 18.803.157 16.948.072 15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zm0 10.162a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z',
  facebook: 'M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073C0 18.1 4.388 23.094 10.125 24v-8.437H7.078v-3.49h3.047V9.41c0-3.025 1.792-4.697 4.533-4.697 1.312 0 2.686.236 2.686.236v2.97h-1.513c-1.491 0-1.956.93-1.956 1.886v2.267h3.328l-.532 3.49h-2.796V24C19.612 23.094 24 18.1 24 12.073z',
  twitter: 'M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.737-8.835L1.254 2.25H8.08l4.253 5.622 5.911-5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z',
  youtube: 'M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z',
  linkedin: 'M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z',
};

const FOOTER_LINKS = {
  Shop: [
    { label: "What's New", to: '/shop?view=new' },
    { label: 'Best Sellers', to: '/shop?view=bestsellers' },
    { label: 'Deals Under $200', to: '/shop?view=deals' },
    { label: 'All Categories', to: '/categories' },
  ],
  Support: [
    { label: 'Help Center', to: '/info/support' },
    { label: 'Shipping & Delivery', to: '/info/delivery' },
    { label: 'Privacy Policy', to: '/info/privacy' },
    { label: 'Terms of Service', to: '/info/terms' },
  ],
  Company: [
    { label: 'Our Story', to: '/about' },
    { label: 'Careers', to: '/info/careers' },
    { label: 'Browse the Shop', to: '/shop' },
    { label: 'Explore Categories', to: '/categories' },
  ],
};

const UTILITY_PATHS = ['/checkout', '/cart', '/orders', '/profile'];

const Footer = () => {
  const { pathname } = useLocation();
  const isUtility = UTILITY_PATHS.some(p => pathname === p || pathname.startsWith(p + '/'));

  return (
    <footer className="footer">
      <div className="footer-container">
        {!isUtility && (
          <section className="footer-main">
            <div className="footer-brand">
              <h2 className="footer-logo">CAGURA</h2>
              <p className="footer-desc">
                Premium lifestyle and tech essentials selected for comfort, utility, and a softer shopping experience across desktop and mobile.
              </p>
              <div className="social-links">
                <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="social-link">
                  <SocialIcon d={ICONS.instagram} />
                </a>
                <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="social-link">
                  <SocialIcon d={ICONS.facebook} />
                </a>
                <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" aria-label="Twitter" className="social-link">
                  <SocialIcon d={ICONS.twitter} />
                </a>
                <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" aria-label="YouTube" className="social-link">
                  <SocialIcon d={ICONS.youtube} />
                </a>
                <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="social-link">
                  <SocialIcon d={ICONS.linkedin} />
                </a>
              </div>
            </div>

            <div className="footer-links-grid">
              {Object.entries(FOOTER_LINKS).map(([title, links]) => (
                <div key={title} className="footer-links-col">
                  <h3 className="footer-title">{title}</h3>
                  <ul>
                    {links.map((link) => (
                      <li key={link.label}>
                        <Link to={link.to}>{link.label}</Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </section>
        )}

        <div className={`footer-bottom ${isUtility ? 'footer-bottom-only' : ''}`}>
          <p>&copy; {new Date().getFullYear()} CAGURA. All rights reserved.</p>
          <div className="footer-legal">
            <Link to="/info/privacy">Privacy Policy</Link>
            <span className="separator">/</span>
            <Link to="/info/terms">Terms of Service</Link>
            <span className="separator">/</span>
            <Link to="/info/delivery">Delivery & Returns</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
