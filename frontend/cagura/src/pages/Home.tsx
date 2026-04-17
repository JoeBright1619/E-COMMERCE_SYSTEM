import { Link } from 'react-router-dom';
import '../styles/Home.css';

export function Home() {
  return (
    <div className="home">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <h1>Welcome to CAGURA</h1>
          <p>Your trusted online shopping destination</p>
          <Link to="/products" className="btn btn-primary">
            Shop Now
          </Link>
        </div>
      </section>

      {/* Categories Section */}
      <section className="categories">
        <h2>Shop by Category</h2>
        <div className="category-grid">
          <div className="category-card">
            <div className="category-icon">👕</div>
            <h3>Clothing</h3>
            <p>Latest fashion trends</p>
          </div>
          <div className="category-card">
            <div className="category-icon">⚡</div>
            <h3>Electronics</h3>
            <p>Tech gadgets & devices</p>
          </div>
          <div className="category-card">
            <div className="category-icon">🏠</div>
            <h3>Home</h3>
            <p>Furniture & decor</p>
          </div>
          <div className="category-card">
            <div className="category-icon">⚽</div>
            <h3>Sports</h3>
            <p>Equipment & gear</p>
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="featured">
        <h2>Featured Products</h2>
        <p className="subtitle">Check out our best sellers</p>
        <div className="products-grid">
          {/* Placeholder: These will be replaced with actual products from the API */}
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="product-card">
              <div className="product-image">📦</div>
              <h3>Product {i}</h3>
              <p className="price">$99.99</p>
              <button className="btn btn-secondary">Add to Cart</button>
            </div>
          ))}
        </div>
      </section>

      {/* Call to Action */}
      <section className="cta">
        <h2>Ready to Start Shopping?</h2>
        <Link to="/products" className="btn btn-primary">
          View All Products
        </Link>
      </section>
    </div>
  );
}
