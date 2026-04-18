import { useState, useEffect } from 'react';
import HeroSection from '../components/HeroSection';
import ProductCard from '../components/ProductCard';
import Skeleton from '../components/Skeleton';
import api from '../services/api';
import type { Product } from '../contexts/CartContext';
import './Home.css';

const Home = () => {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = (await api.get('/products')) as unknown as Product[];
        // Just take the first 3 for featured
        setFeaturedProducts(data.slice(0, 3));
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  return (
    <div className="home-page">
      <HeroSection />

      <section className="brands-marquee">
        <div className="marquee-content">
          <span>Trusted by industry leaders worldwide.</span>
          <span>APPLE</span>
          <span className="dot">•</span>
          <span>SAMSUNG</span>
          <span className="dot">•</span>
          <span>SONY</span>
          <span className="dot">•</span>
          <span>LOGITECH</span>
          <span className="dot">•</span>
          <span>MICROSOFT</span>
          <span className="dot">•</span>
          <span>LG</span>
          <span className="dot">•</span>
          <span>BOSE</span>
        </div>
      </section>
      
      <section id="featured" className="featured-section">
        <div className="section-header">
          <h2 className="section-title">Featured <span className="text-gradient">Products</span></h2>
          <p className="section-subtitle">Discover our hand-picked selection of premium items</p>
        </div>
        
        {loading ? (
          <div className="product-grid">
            <Skeleton type="card" count={3} />
          </div>
        ) : (
          <div className="product-grid">
            {featuredProducts.map(product => (
              <ProductCard 
                key={product.id}
                id={product.id}
                title={product.title}
                price={product.price}
                image={product.image}
                category={product.category}
                isNew={product.isNew}
              />
            ))}
          </div>
        )}
        
        <div className="view-all-container">
          <a href="/shop" className="btn btn-secondary view-all-btn">View All Products</a>
        </div>
      </section>
      
      <section className="newsletter-section">
        <div className="newsletter-card glass-panel">
          <h2>Join the CAGURA Community</h2>
          <p>Subscribe to receive updates, access to exclusive deals, and more.</p>
          <form className="newsletter-form" onSubmit={(e) => e.preventDefault()}>
            <input type="email" placeholder="Enter your email address" className="newsletter-input" required />
            <button type="submit" className="btn btn-primary">Subscribe</button>
          </form>
        </div>
      </section>
    </div>
  );
};

export default Home;
