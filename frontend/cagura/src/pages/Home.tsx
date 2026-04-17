import { Link } from 'react-router-dom';
import '../styles/Home.css';

export function Home() {
  return (
    <div className="home">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <h1>Premium Shopping Redefined</h1>
          <p>Discover quality products with exceptional service. Shop smart, save more.</p>
          <Link to="/products" className="btn btn-primary">
            EXPLORE COLLECTION
          </Link>
        </div>
      </section>

      {/* Categories Section */}
      <section className="categories">
        <h2>SHOP BY CATEGORY</h2>
        <div className="category-grid">
          <div className="category-card">
            <div className="category-number">01</div>
            <h3>APPAREL</h3>
            <p>Latest fashion & clothing</p>
          </div>
          <div className="category-card">
            <div className="category-number">02</div>
            <h3>ELECTRONICS</h3>
            <p>Tech gadgets & devices</p>
          </div>
          <div className="category-card">
            <div className="category-number">03</div>
            <h3>HOME & GARDEN</h3>
            <p>Furniture & home decor</p>
          </div>
          <div className="category-card">
            <div className="category-number">04</div>
            <h3>SPORTS & OUTDOORS</h3>
            <p>Equipment & gear</p>
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="featured">
        <h2>FEATURED PRODUCTS</h2>
        <p className="subtitle">Handpicked selections from our collection</p>
        <div className="products-grid">
          {/* Placeholder: These will be replaced with actual products from the API */}
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="product-card">
              <div className="product-placeholder"></div>
              <h3>Product Name</h3>
              <p className="price">$99.99</p>
              <button className="btn btn-secondary">ADD TO CART</button>
            </div>
          ))}
        </div>
      </section>

      {/* Call to Action */}
      <section className="cta">
        <h2>Ready to Start Shopping?</h2>
        <p>Browse our complete collection and find exactly what you're looking for.</p>
        <Link to="/products" className="btn btn-primary">
          SHOP NOW
        </Link>
      </section>
    </div>
  );
}
