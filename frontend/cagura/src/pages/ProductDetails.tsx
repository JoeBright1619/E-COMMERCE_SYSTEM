import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Leaf, PackageCheck, ShieldCheck, ShoppingCart, Star, Truck } from 'lucide-react';
import Skeleton from '../components/Skeleton';
import ProductCard from '../components/ProductCard';
import api from '../services/api';
import { useCart } from '../contexts/CartContext';
import type { ProductResponseDto as Product } from '../types';
import './ProductDetails.css';

const PRODUCT_STORIES: Record<string, string[]> = {
  Footwear: [
    'Designed for long commutes, quick errands, and everyday comfort.',
    'Lightweight construction keeps movement easy from morning to night.',
    'A softer visual language that fits naturally into a premium lifestyle storefront.',
  ],
  Audio: [
    'Balanced for focus, commuting, and relaxed listening without extra clutter.',
    'Clean product styling keeps the setup feeling refined at home or on the move.',
    'Built to make high-use tech feel more considered and less disposable.',
  ],
  Wearables: [
    'Useful health and routine tracking in a format that stays comfortable all day.',
    'Simple enough for daily use, polished enough to feel gift-worthy.',
    'A strong fit for customers who want performance without a loud design language.',
  ],
  Accessories: [
    'Everyday add-ons chosen to remove friction from work, travel, and charging.',
    'Compact details help these pieces fit into cleaner setups and calmer routines.',
    'An easy upsell category because utility and aesthetics meet in the middle.',
  ],
  Displays: [
    'Screen-first essentials that support deeper focus and more comfortable work.',
    'Designed to anchor a desk setup with clarity, scale, and visual calm.',
    'A premium category that benefits from stronger reassurance around delivery and setup.',
  ],
};

const DETAIL_PROMISES = [
  {
    name: 'Free Shipping',
    description: 'Qualifying orders over $100 ship free with tracking included.',
    icon: Truck,
  },
  {
    name: '30-Day Returns',
    description: 'Try it at home and return it easily if the fit is not right.',
    icon: PackageCheck,
  },
  {
    name: 'Secure Checkout',
    description: 'Protected payment flow designed for quick, low-friction purchasing.',
    icon: ShieldCheck,
  },
];

const DetailStars = ({ rating }: { rating: number }) => (
  <div className="detail-stars" aria-label={`Rated ${rating} out of 5`}>
    {[1, 2, 3, 4, 5].map((star) => (
      <Star
        key={star}
        size={16}
        fill={star <= Math.floor(rating) ? '#f4b740' : 'transparent'}
        color={star <= Math.floor(rating) ? '#f4b740' : '#d8ccbf'}
      />
    ))}
  </div>
);

const ProductDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const fetchProductDetails = async () => {
      if (!id) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const [productData, productsData] = await Promise.all([
          api.get(`/products/${id}`) as unknown as Promise<Product>,
          api.get('/products') as unknown as Promise<Product[]>,
        ]);

        setProduct(productData);
        setRelatedProducts(
          productsData
            .filter((item) => item.id !== productData.id && item.categoryName === productData.categoryName)
            .slice(0, 3),
        );
      } catch (error) {
        console.error('Error fetching product:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProductDetails();
  }, [id]);

  if (loading) {
    return (
      <div className="product-detail-page">
        <button className="detail-back-link" onClick={() => navigate(-1)}>
          <ArrowLeft size={18} /> Back to Shop
        </button>
        <Skeleton type="details" />
      </div>
    );
  }

  if (!product) {
    return <div className="page-loader">Product not found</div>;
  }

  const storyPoints = PRODUCT_STORIES[product.categoryName] ?? [
    'Chosen to make everyday shopping feel more thoughtful and less overwhelming.',
    'Balanced between practical value and a softer premium presentation.',
    'A strong fit for customers looking for comfort, utility, and cleaner styling.',
  ];

  const rating = product.isNew ? 4.8 : 4.6;
  const reviewCount = product.isNew ? 42 : 128;
  const estimatedDelivery = product.isNew ? 'Arrives in 3-5 business days' : 'Ready to ship in 1-3 business days';

  return (
    <div className="product-detail-page">
      <button className="detail-back-link" onClick={() => navigate(-1)}>
        <ArrowLeft size={18} /> Back to Shop
      </button>

      <section className="detail-hero-shell">
        <div className="detail-media-column">
          <div className="detail-image-frame">
            {product.isNew && <span className="detail-badge">New Arrival</span>}
            <img src={product.imageUrl || undefined} alt={product.name} className="detail-main-image" />
          </div>

          <div className="detail-media-notes">
            <div className="detail-note-card">
              <span className="detail-note-label">Why Customers Pick It</span>
              <p>Comfort-led design, cleaner styling, and a simpler premium buying experience.</p>
            </div>
            <div className="detail-note-card accent">
              <Leaf size={18} />
              <div>
                <span className="detail-note-label">Mindful Selection</span>
                <p>Chosen for daily use, long-term value, and an easier lifestyle fit.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="detail-info-column">
          <div className="detail-breadcrumbs">
            <Link to="/">Home</Link>
            <span>/</span>
            <Link to="/shop">Shop</Link>
            <span>/</span>
            <Link to={`/shop?category=${encodeURIComponent(product.categoryName)}`}>{product.categoryName}</Link>
          </div>

          <div className="detail-header-block">
            <span className="detail-category-pill">{product.categoryName}</span>
            <h1 className="detail-title">{product.name}</h1>
            <p className="detail-subtitle">
              Premium essentials with softer styling, practical comfort, and the kind of polish that makes everyday shopping feel effortless.
            </p>
          </div>

          <div className="detail-rating-row">
            <DetailStars rating={rating} />
            <span className="detail-rating-copy">{rating.toFixed(1)} rating</span>
            <span className="detail-rating-separator">/</span>
            <span className="detail-rating-copy">{reviewCount} reviews</span>
          </div>

          <div className="detail-purchase-card">
            <div className="detail-price-row">
              <div>
                <span className="detail-price-label">Price</span>
                <div className="detail-price">${product.price.toFixed(2)}</div>
              </div>
              <div className="detail-delivery-chip">
                <Truck size={16} />
                <span>{estimatedDelivery}</span>
              </div>
            </div>

            <p className="detail-description">{product.description}</p>

            <div className="detail-actions-row">
              <div className="detail-quantity-selector" aria-label="Quantity selector">
                <button type="button" onClick={() => setQuantity(Math.max(1, quantity - 1))}>-</button>
                <span>{quantity}</span>
                <button type="button" onClick={() => setQuantity(quantity + 1)}>+</button>
              </div>

              <button
                className="btn btn-primary detail-add-button"
                onClick={() => addToCart(product.id, quantity)}
              >
                <ShoppingCart size={18} />
                Add to Cart
              </button>
            </div>

            <div className="detail-meta-grid">
              <div className="detail-meta-item">
                <span className="detail-meta-label">Availability</span>
                <span className="detail-meta-value in-stock">In Stock</span>
              </div>
              <div className="detail-meta-item">
                <span className="detail-meta-label">Delivery</span>
                <span className="detail-meta-value">{estimatedDelivery}</span>
              </div>
              <div className="detail-meta-item">
                <span className="detail-meta-label">Returns</span>
                <span className="detail-meta-value">30-day easy returns</span>
              </div>
              <div className="detail-meta-item">
                <span className="detail-meta-label">Category</span>
                <span className="detail-meta-value">{product.categoryName}</span>
              </div>
            </div>
          </div>

          <div className="detail-story-card">
            <p className="detail-story-kicker">Why You&apos;ll Love It</p>
            <ul className="detail-story-list">
              {storyPoints.map((point) => (
                <li key={point}>{point}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="detail-assurance-grid">
        {DETAIL_PROMISES.map(({ name, description, icon: Icon }) => (
          <article key={name} className="detail-assurance-card">
            <span className="detail-assurance-icon">
              <Icon size={18} />
            </span>
            <h3>{name}</h3>
            <p>{description}</p>
          </article>
        ))}
      </section>

      <section className="detail-editorial-band">
        <div className="detail-editorial-copy">
          <p className="detail-story-kicker">Designed For Everyday Use</p>
          <h2>A product page that sells through reassurance, not noise.</h2>
          <p>
            This redesign follows the same Allbirds-inspired principle as the homepage: larger surfaces, fewer distractions,
            and short, helpful messages around delivery, returns, and comfort.
          </p>
        </div>
        <Link to={`/shop?category=${encodeURIComponent(product.categoryName)}`} className="detail-editorial-link">
          Browse More {product.categoryName} <ArrowRight size={16} />
        </Link>
      </section>

      {relatedProducts.length > 0 && (
        <section className="detail-related-section">
          <div className="detail-related-header">
            <p className="detail-story-kicker">Keep Exploring</p>
            <h2>More in {product.categoryName}</h2>
          </div>
          <div className="detail-related-grid">
            {relatedProducts.map((item) => (
              <ProductCard
                key={item.id}
                id={item.id}
                name={item.name}
                price={item.price}
                imageUrl={item.imageUrl || ''}
                categoryName={item.categoryName}
                isNew={item.isNew}
              />
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default ProductDetails;
