import { ShoppingCart, Heart, Star, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import './ProductCard.css';

interface ProductCardProps {
  id: number;
  name: string;
  price: number;
  imageUrl: string;
  categoryName: string;
  stockQuantity: number;
  isNew?: boolean;
  rating?: number;
  reviews?: number;
}

const ProductCard = ({ id, name, price, imageUrl, categoryName, stockQuantity, isNew, rating = 4.5, reviews = 128 }: ProductCardProps) => {
  const { addToCart } = useCart();

  const isOutOfStock = stockQuantity === 0;
  const isLowStock = stockQuantity > 0 && stockQuantity <= 5;

  const renderStars = (rating: number) => {
    return (
      <div className="product-stars">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            size={14}
            fill={star <= Math.floor(rating) ? '#fbbf24' : '#e5e7eb'}
            color={star <= Math.floor(rating) ? '#fbbf24' : '#e5e7eb'}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="product-card">
      <div className="product-image-container">
        {isLowStock ? (
          <span className="product-badge stock-low">Only {stockQuantity} left</span>
        ) : isNew ? (
          <span className="product-badge">New</span>
        ) : null}
        <button className="wishlist-btn" aria-label="Add to wishlist">
          <Heart size={16} />
        </button>
        <Link to={`/product/${id}`}>
          <img src={imageUrl || undefined} alt={name} className="product-image" />
        </Link>
        <button
          className={`product-cart-overlay${isOutOfStock ? ' out-of-stock' : ''}`}
          aria-label={isOutOfStock ? 'Out of stock' : 'Add to cart'}
          disabled={isOutOfStock}
          onClick={(e) => { e.preventDefault(); addToCart(id, 1); }}
        >
          {isOutOfStock ? 'Out of Stock' : <><Plus size={15} /> Add to Cart</>}
        </button>
      </div>

      <div className="product-info">
        <span className="product-category">{categoryName}</span>
        <Link to={`/product/${id}`} className="product-title-link">
          <h3 className="product-title">{name}</h3>
        </Link>

        <div className="product-rating">
          {renderStars(rating)}
          <span className="product-reviews">({reviews})</span>
        </div>

        <div className="product-bottom">
          <span className="product-price">${price.toFixed(2)}</span>
          <ShoppingCart size={16} color="var(--text-tertiary)" />
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
