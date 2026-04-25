import { useState, useEffect } from 'react';
import { SlidersHorizontal, Sparkles, Tag, TrendingUp } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import Skeleton from '../components/Skeleton';
import { productService } from '../services/productService';
import { categoryService } from '../services/categoryService';
import type { CategoryResponseDto, ProductResponseDto as Product } from '../types';
import { withDerivedProductFields } from '../utils/product';
import './Shop.css';

const SORT_OPTIONS = [
  { value: 'default', label: 'Recommended' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'newest', label: 'Newest Arrivals' },
];

const VIEW_OPTIONS = [
  { value: 'all', label: 'All Products', icon: SlidersHorizontal },
  { value: 'new', label: "What's New", icon: Sparkles },
  { value: 'deals', label: 'Deals', icon: Tag },
  { value: 'bestsellers', label: 'Best Sellers', icon: TrendingUp },
];

const Shop = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const query = searchParams.get('search')?.toLowerCase() || '';
  const categoryParam = searchParams.get('category') || 'All';
  const view = searchParams.get('view') || 'all';

  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<CategoryResponseDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortOption, setSortOption] = useState('default');

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const [productData, categoryData] = await Promise.all([
          productService.getAll(),
          categoryService.getAll(),
        ]);
        setProducts(productData.map(withDerivedProductFields));
        setCategories(categoryData);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const categoryNames = ['All', ...categories.map((category) => category.name)];
  const activeCategory = categoryNames.find((category) => category.toLowerCase() === categoryParam.toLowerCase()) ?? 'All';

  const productsByView = view === 'new'
    ? products.filter((product) => product.isNew)
    : view === 'deals'
      ? products.filter((product) => product.price <= 200)
      : view === 'bestsellers'
        ? [...products].sort((first, second) => first.price - second.price).slice(0, Math.max(4, Math.ceil(products.length / 2)))
        : products;

  const filteredProducts = activeCategory === 'All'
    ? productsByView
    : productsByView.filter((product) => product.categoryName === activeCategory);

  const searchedProducts = query
    ? filteredProducts.filter((product) => product.name.toLowerCase().includes(query) || (product.description || '').toLowerCase().includes(query))
    : filteredProducts;

  const finalProducts = [...searchedProducts].sort((first, second) => {
    if (sortOption === 'price-asc') return first.price - second.price;
    if (sortOption === 'price-desc') return second.price - first.price;
    if (sortOption === 'newest') return Number(second.isNew) - Number(first.isNew);
    return 0;
  });

  const titlePrefix = view === 'new'
    ? 'Fresh'
    : view === 'deals'
      ? "Today's"
      : view === 'bestsellers'
        ? 'Best'
        : activeCategory !== 'All'
          ? 'Shop'
          : 'Our';

  const titleAccent = view === 'new'
    ? 'Arrivals'
    : view === 'deals'
      ? 'Deals'
      : view === 'bestsellers'
        ? 'Sellers'
        : activeCategory !== 'All'
          ? activeCategory
          : 'Collection';

  const shopSubtitle = view === 'new'
    ? 'Fresh arrivals curated for customers who want the latest additions first.'
    : view === 'deals'
      ? 'A cleaner, easier way to scan value picks without digging through the full catalog.'
      : view === 'bestsellers'
        ? 'Popular picks surfaced in a simpler editorial layout for faster decision-making.'
        : activeCategory !== 'All'
          ? `Browse curated ${activeCategory.toLowerCase()} essentials designed to feel easier to shop.`
          : 'Explore our full range of premium products designed for your digital lifestyle.';

  return (
    <div className="page-background shop-bg">
      <div className="shop-page">
        <div className="shop-header">
          <p className="shop-eyebrow">Curated Storefront</p>
          <h1>{titlePrefix} <span className="text-gradient">{titleAccent}</span></h1>
          <p>{shopSubtitle}</p>
          {query && <div className="search-results-text">Search results for "{query}"</div>}
        </div>

        <div className="shop-view-switcher">
          {VIEW_OPTIONS.map(({ value, label, icon: Icon }) => (
            <Link
              key={value}
              to={value === 'all' ? '/shop' : `/shop?view=${value}`}
              className={`shop-view-pill ${view === value ? 'active' : ''}`}
            >
              <Icon size={16} />
              <span>{label}</span>
            </Link>
          ))}
        </div>

        <div className="shop-container">
          <aside className="shop-sidebar glass-panel">
            <div className="shop-sidebar-header">
              <h3>Categories</h3>
              <span>{categoryNames.length - 1} edits</span>
            </div>

            <div className="shop-category-pills">
              {categoryNames.map((category) => (
                <Link
                  key={category}
                  to={category === 'All' ? '/shop' : `/shop?category=${encodeURIComponent(category)}`}
                  className={`category-btn ${activeCategory === category ? 'active' : ''}`}
                >
                  {category}
                </Link>
              ))}
            </div>
          </aside>

          <main className="shop-main">
            <div className="shop-results-header">
              <div>
                <span className="shop-results-count">Showing {finalProducts.length} products</span>
                <p className="shop-results-helper">Use the quick filters to keep browsing focused and light.</p>
              </div>

              <label className="sort-shell">
                <span>Sort</span>
                <select className="sort-select" value={sortOption} onChange={(e) => setSortOption(e.target.value)}>
                  {SORT_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            {loading ? (
              <div className="product-grid shop-grid">
                <Skeleton type="card" count={6} />
              </div>
            ) : (
              <div className="product-grid shop-grid">
                {finalProducts.length > 0 ? (
                  finalProducts.map((product) => (
                    <ProductCard
                      key={product.id}
                      id={product.id}
                      name={product.name}
                      price={product.price}
                      imageUrl={product.imageUrl || ''}
                      categoryName={product.categoryName}
                      stockQuantity={product.stockQuantity}
                      isNew={product.isNew}
                      rating={product.averageRating}
                      reviews={product.reviewCount}
                    />
                  ))
                ) : (
                  <div className="shop-empty-state glass-panel">
                    <h3>No products found</h3>
                    <p>Try a different category, reset the view, or search for a broader term.</p>
                    <Link to="/shop" className="btn btn-secondary">Reset Shop View</Link>
                  </div>
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
