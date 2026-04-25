import { useState, useEffect } from 'react';
import { ArrowRight, Leaf, PackageCheck, ShieldCheck, Truck } from 'lucide-react';
import { Link } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import Skeleton from '../components/Skeleton';
import { productService } from '../services/productService';
import type { ProductResponseDto as Product } from '../types';
import { withDerivedProductFields } from '../utils/product';
import './Home.css';

const FALLBACK_PRODUCTS: Product[] = [
  {
    id: 3,
    name: 'AeroGlide Future Sneakers',
    description: 'Lightweight movement for busy commutes and long city days.',
    price: 189.99,
    imageUrl: '/assets/product_sneakers_1776467199864.png',
    stockQuantity: 20,
    isActive: true,
    createdAt: new Date().toISOString(),
    categoryId: 1,
    categoryName: 'Footwear',
    averageRating: 4.8,
    reviewCount: 42,
    isNew: true,
  },
  {
    id: 2,
    name: 'SonicPro Wireless Headphones',
    description: 'Clean sound, soft fit, and a clutter-free desk setup.',
    price: 349.5,
    imageUrl: '/assets/product_headphones_1776467120598.png',
    stockQuantity: 20,
    isActive: true,
    createdAt: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString(),
    categoryId: 2,
    categoryName: 'Audio',
    averageRating: 4.6,
    reviewCount: 128,
    isNew: false,
  },
  {
    id: 1,
    name: 'Aura Sync Smartwatch',
    description: 'Everyday tracking with a softer, more refined silhouette.',
    price: 299.99,
    imageUrl: '/assets/product_watch_1776467103171.png',
    stockQuantity: 20,
    isActive: true,
    createdAt: new Date().toISOString(),
    categoryId: 3,
    categoryName: 'Wearables',
    averageRating: 4.7,
    reviewCount: 76,
    isNew: true,
  },
];

const CATEGORY_COPY: Record<string, { eyebrow: string; description: string }> = {
  Footwear: {
    eyebrow: 'Move Lighter',
    description: 'Sneakers and daily carry pieces designed for long walks, short commutes, and smooth transitions.',
  },
  Audio: {
    eyebrow: 'Hear Better',
    description: 'Desk-to-travel audio essentials with cleaner silhouettes and fewer distractions.',
  },
  Wearables: {
    eyebrow: 'Track Smarter',
    description: 'Useful wearable tech that stays comfortable from early starts through evening resets.',
  },
  Accessories: {
    eyebrow: 'Finish The Setup',
    description: 'Utility-first add-ons that keep your workspace and daily routine feeling intentional.',
  },
  Displays: {
    eyebrow: 'See More',
    description: 'Elevated screen setups for focused work, creative sessions, and everyday enjoyment.',
  },
  "Men's Clothing": {
    eyebrow: 'Elevated Essentials',
    description: 'Modern menswear designed with premium fabrics, perfect fits, and clean, versatile silhouettes.',
  },
  "Women's Clothing": {
    eyebrow: 'Effortless Style',
    description: 'Beautifully crafted womenswear pieces that transition seamlessly from relaxed mornings to evenings out.',
  },
};

const PROMISES = [
  {
    title: 'Free Shipping',
    description: 'All qualifying orders over $100 ship free, with easy tracking from checkout onward.',
    icon: Truck,
  },
  {
    title: 'Simple Returns',
    description: 'Try it at home and send it back within 30 days if it is not the right fit for your routine.',
    icon: PackageCheck,
  },
  {
    title: 'Mindful Materials',
    description: 'A cleaner storefront look backed by products selected for comfort, utility, and longevity.',
    icon: Leaf,
  },
  {
    title: 'Protected Checkout',
    description: 'Fast, secure checkout flows that keep the buying experience smooth on desktop and mobile.',
    icon: ShieldCheck,
  },
];

const Home = () => {
  const [products, setProducts] = useState<Product[]>(FALLBACK_PRODUCTS);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await productService.getAll();
        setProducts(data.map(withDerivedProductFields));
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Intersection Observer for scroll animations
  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: '0px',
      threshold: 0.15,
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
        }
      });
    }, observerOptions);

    const revealElements = document.querySelectorAll('.reveal');
    revealElements.forEach((el) => observer.observe(el));

    return () => {
      revealElements.forEach((el) => observer.unobserve(el));
    };
  }, [products]); // Re-run when products load so new cards are observed

  const featuredProducts = products.filter(p => ["Men's Clothing", "Women's Clothing"].includes(p.categoryName) || p.isNew).slice(0, 4);
  const heroLead = products.find((product) => product.categoryName === "Men's Clothing") ?? products[0];
  const heroSupport = products.find((product) => product.categoryName === "Women's Clothing") ?? products[1] ?? heroLead;
  const newestProducts = products.filter((product) => product.isNew).slice(0, 2);
  const spotlightCategories = ["Men's Clothing", "Women's Clothing", "Footwear"].filter(cat => products.some(p => p.categoryName === cat));
  
  // Fallback to dynamic if hardcoded ones aren't available yet
  const finalSpotlightCategories = spotlightCategories.length >= 3 
    ? spotlightCategories 
    : Array.from(new Set(products.map((product) => product.categoryName))).slice(0, 3);

  return (
    <div className="home-page">
      <section className="home-hero watermark-container">
        <div className="watermark-bg">CAGURA</div>
        <div className="home-hero-content reveal">
          <div className="hero-copy">
            <p className="hero-kicker">The Daily Edit</p>
            <h1 className="hero-title">A calmer storefront for the <span className="text-highlight">things you use</span> every day.</h1>
            <p className="hero-subtitle">
              Inspired by the clean rhythm of Allbirds, this refresh gives your shop a softer premium feel:
              fewer distractions, stronger product stories, and faster paths into what is new, useful, and ready to ship.
            </p>

            <div className="hero-actions">
              <Link to={`/shop?category=${encodeURIComponent(heroLead?.categoryName ?? 'Footwear')}`} className="btn btn-primary">
                Shop {heroLead?.categoryName ?? 'Collection'}
              </Link>
              <Link to="/shop?view=new" className="btn btn-secondary">
                Explore What&apos;s New
              </Link>
            </div>

            <div className="hero-meta">
              <div className="hero-meta-item">
                <span className="hero-meta-value">30-Day</span>
                <span className="hero-meta-label">Returns</span>
              </div>
              <div className="hero-meta-item">
                <span className="hero-meta-value">Free</span>
                <span className="hero-meta-label">Shipping $100+</span>
              </div>
              <div className="hero-meta-item">
                <span className="hero-meta-value">Curated</span>
                <span className="hero-meta-label">Daily Essentials</span>
              </div>
            </div>
          </div>

          <div className="hero-stage">
            <article className="hero-panel hero-panel-large">
              <div className="hero-panel-image">
                <img src={heroLead?.imageUrl || undefined} alt={heroLead?.name} />
              </div>
              <div className="hero-panel-content">
                <p className="hero-panel-eyebrow">{heroLead?.categoryName}</p>
                <h2>{heroLead?.name}</h2>
                <p>{heroLead?.description}</p>
                <Link to={`/product/${heroLead?.id ?? 1}`} className="hero-inline-link">
                  View Product <ArrowRight size={16} />
                </Link>
              </div>
            </article>

            <article className="hero-panel hero-panel-accent">
              <div className="hero-panel-copy">
                <p className="hero-panel-eyebrow">Now Trending</p>
                <h3>{heroSupport?.name}</h3>
                <p>{heroSupport?.description}</p>
                <Link to={`/shop?category=${encodeURIComponent(heroSupport?.categoryName ?? 'Audio')}`} className="hero-inline-link light">
                  Shop {heroSupport?.categoryName ?? 'Audio'} <ArrowRight size={16} />
                </Link>
              </div>
              <img src={heroSupport?.imageUrl || undefined} alt={heroSupport?.name} className="hero-accent-image" />
            </article>
          </div>
        </div>
      </section>

      <section className="home-story-strip reveal">
        <div className="story-pill">Soft premium palette</div>
        <div className="story-pill">Editorial category entry points</div>
        <div className="story-pill">Search-first navigation</div>
        <div className="story-pill">Mobile-friendly browsing</div>
      </section>

      <section className="home-collection-section reveal watermark-container">
        <div className="watermark-bg" style={{ top: '30%', fontSize: '14vw' }}>ESSENTIALS</div>
        <div className="home-section-header">
          <p className="home-section-eyebrow">Shop By Focus</p>
          <h2>Guided entry points instead of one <span className="text-highlight">crowded wall</span> of products.</h2>
          <p className="home-section-subtitle">
            These collection cards borrow the Allbirds idea of easing people into shopping through clear, thematic choices.
          </p>
        </div>

        <div className="collection-grid">
          {finalSpotlightCategories.map((category, index) => {
            const product = products.find((item) => item.categoryName === category);
            const copy = CATEGORY_COPY[category] ?? {
              eyebrow: `Edit 0${index + 1}`,
              description: 'A curated set of products selected to keep the browsing experience focused and easy to scan.',
            };

            return (
              <Link
                key={category}
                to={`/shop?category=${encodeURIComponent(category)}`}
                className="collection-card"
              >
                <div className="collection-card-media">
                  <img src={product?.imageUrl || undefined} alt={product?.name ?? category} />
                </div>
                <div className="collection-card-content">
                  <p className="collection-card-eyebrow">{copy.eyebrow}</p>
                  <h3>{category}</h3>
                  <p>{copy.description}</p>
                  <span className="collection-card-link">
                    Shop {category} <ArrowRight size={16} />
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      <section className="editorial-section reveal">
        <div className="editorial-card editorial-story">
          <p className="home-section-eyebrow">Why This Direction Works</p>
          <h2>It feels premium because it gives the products <span className="text-highlight">room to breathe</span>.</h2>
          <p>
            Allbirds is effective because it mixes calm whitespace, large product imagery, and short reassuring messages.
            This version adapts that approach to your ecommerce project without copying the site outright.
          </p>
          <ul className="editorial-list">
            <li>Cleaner navigation with direct pathways for deals, new arrivals, and delivery information.</li>
            <li>Large editorial cards that spotlight categories before customers hit the full catalog.</li>
            <li>Supportive trust cues that make the experience feel lighter and easier to buy from.</li>
          </ul>
          <Link to="/about" className="btn btn-secondary">Read Our Story</Link>
        </div>

        <div className="editorial-card editorial-arrivals">
          <div className="home-section-header compact">
            <p className="home-section-eyebrow">Fresh Picks</p>
            <h2>What&apos;s New</h2>
          </div>

          <div className="arrival-grid">
            {newestProducts.map((product) => (
              <Link key={product.id} to={`/product/${product.id}`} className="arrival-card">
                <div className="arrival-media">
                  <img src={product.imageUrl || undefined} alt={product.name} />
                </div>
                <div className="arrival-copy">
                  <span>{product.categoryName}</span>
                  <h3>{product.name}</h3>
                  <p>${product.price.toFixed(2)}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="home-featured-section reveal watermark-container">
        <div className="watermark-bg">DISCOVER</div>
        <div className="home-section-header">
          <p className="home-section-eyebrow">Featured Products</p>
          <h2>Bestsellers presented with a little <span className="text-highlight">more polish</span>.</h2>
          <p className="home-section-subtitle">
            Product cards stay functional, but the surrounding layout now feels more curated and brand-led.
          </p>
        </div>

        {loading ? (
          <div className="home-product-grid">
            <Skeleton type="card" count={4} />
          </div>
        ) : (
          <div className="home-product-grid">
            {featuredProducts.map((product) => (
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
            ))}
          </div>
        )}

        <div className="home-section-cta">
          <Link to="/shop" className="btn btn-secondary">View All Products</Link>
        </div>
      </section>

      <section className="promise-section reveal">
        <div className="promise-grid">
          {PROMISES.map(({ title, description, icon: Icon }) => (
            <article key={title} className="promise-card">
              <span className="promise-icon">
                <Icon size={20} />
              </span>
              <h3>{title}</h3>
              <p>{description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="newsletter-section reveal">
        <div className="newsletter-card">
          <p className="newsletter-eyebrow">Stay In The Loop</p>
          <h2>Join the CAGURA community for <span className="text-highlight">launch drops</span>, offers, and curated picks.</h2>
          <p>
            The new homepage encourages slower, more intentional browsing. Email is still the fastest way to bring people back.
          </p>
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
