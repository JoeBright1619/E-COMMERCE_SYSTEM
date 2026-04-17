import { useState, useEffect } from 'react';
import { ProductCard } from '../components/ProductCard';
import { productService } from '../services/productService';
import { Product, Category } from '../types';
import '../styles/Products.css';

export function Products() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);

  // Fetch products based on filters
  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const data = await productService.getAllProducts(selectedCategoryId || undefined, searchQuery || undefined);
        setProducts(data);
      } catch (err: any) {
        setError('Failed to load products. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    // Debounce search to avoid too many API calls
    const timer = setTimeout(() => {
      fetchProducts();
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery, selectedCategoryId]);

  // Fetch categories on mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await productService.getCategories();
        setCategories(data);
      } catch (err) {
        console.error('Failed to load categories');
      }
    };
    fetchCategories();
  }, []);

  return (
    <div className="products-page">
      {/* Search and Filter Section */}
      <section className="products-header">
        <div className="products-header-content">
          <h1>PRODUCTS</h1>
          <p>Browse our complete collection</p>
        </div>
      </section>

      <div className="products-container">
        {/* Sidebar */}
        <aside className="products-sidebar">
          <div className="filter-section">
            <h3>SEARCH</h3>
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
            />
          </div>

          <div className="filter-section">
            <h3>CATEGORIES</h3>
            <div className="category-filters">
              <label className="category-option">
                <input
                  type="radio"
                  name="category"
                  value=""
                  checked={selectedCategoryId === null}
                  onChange={() => setSelectedCategoryId(null)}
                />
                <span>All Categories</span>
              </label>
              {categories.map((cat) => (
                <label key={cat.id} className="category-option">
                  <input
                    type="radio"
                    name="category"
                    value={cat.id}
                    checked={selectedCategoryId === cat.id}
                    onChange={() => setSelectedCategoryId(cat.id)}
                  />
                  <span>{cat.name}</span>
                </label>
              ))}
            </div>
          </div>
        </aside>

        {/* Products Grid */}
        <main className="products-main">
          {error && <div className="products-error">{error}</div>}

          {isLoading && <div className="products-loading">Loading products...</div>}

          {!isLoading && products.length === 0 && (
            <div className="products-empty">
              <p>No products found.</p>
              <p className="empty-subtitle">Try adjusting your search or filter criteria.</p>
            </div>
          )}

          {!isLoading && products.length > 0 && (
            <>
              <div className="products-count">
                {products.length} {products.length === 1 ? 'product' : 'products'} found
              </div>
              <div className="products-grid">
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  );
}
