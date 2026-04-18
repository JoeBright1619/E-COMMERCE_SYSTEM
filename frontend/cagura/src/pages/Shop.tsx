import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import Skeleton from '../components/Skeleton';
import api from '../services/api';
import type { Product } from '../contexts/CartContext';
import './Shop.css';

const Shop = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const query = searchParams.get('search')?.toLowerCase() || '';

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('All');

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const data = (await api.get('/products')) as unknown as Product[];
        setProducts(data);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const categories = ['All', ...Array.from(new Set(products.map(p => p.category)))];

  const filteredProducts = activeCategory === 'All'
    ? products
    : products.filter(p => p.category === activeCategory);

  const finalProducts = query
    ? filteredProducts.filter(p => p.title.toLowerCase().includes(query) || p.description.toLowerCase().includes(query))
    : filteredProducts;

  return (
    <div className="page-background shop-bg">
      <div className="shop-page">
      <div className="shop-header">
        <h1>Our <span className="text-gradient">Collection</span></h1>
        <p>Explore our full range of premium products designed for your digital lifestyle.</p>
        {query && <div className="search-results-text mt-4 text-secondary">Search results for "{query}"</div>}
      </div>

      <div className="shop-container">
        <aside className="shop-sidebar glass-panel">
          <h3>Categories</h3>
          <ul className="category-list">
            {categories.map(cat => (
              <li key={cat}>
                <button
                  className={`category-btn ${activeCategory === cat ? 'active' : ''}`}
                  onClick={() => setActiveCategory(cat)}
                >
                  {cat}
                </button>
              </li>
            ))}
          </ul>
        </aside>

        <main className="shop-main">
          <div className="shop-results-header">
            <span>Showing {finalProducts.length} results</span>
            <select className="sort-select">
              <option>Default Sorting</option>
              <option>Price: Low to High</option>
              <option>Price: High to Low</option>
              <option>Newest Arrivals</option>
            </select>
          </div>

          {loading ? (
            <div className="product-grid shop-grid">
              <Skeleton type="card" count={6} />
            </div>
          ) : (
            <div className="product-grid shop-grid">
              {finalProducts.length > 0 ? (
                finalProducts.map(product => (
                  <ProductCard
                    key={product.id}
                    id={product.id}
                    title={product.title}
                    price={product.price}
                    image={product.image}
                    category={product.category}
                    isNew={product.isNew}
                  />
                ))
              ) : (
                <div className="empty-state">No products found matching your criteria.</div>
              )}
            </div>
          )}
        </main>
      </div>
      </div>
    </div>
  );
};

export default Shop;
