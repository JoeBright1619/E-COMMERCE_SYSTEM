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
  isNew?: boolean;
  rating?: number;
  reviews?: number;
}

const ProductCard = ({ id, name, price, imageUrl, categoryName, isNew, rating = 4.5, reviews = 128 }: ProductCardProps) => {
  const { addToCart } = useCart();

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
        {isNew && <span className="product-badge">New</span>}
        <button className="wishlist-btn" aria-label="Add to wishlist">
          <Heart size={16} />
        </button>
        <Link to={`/product/${id}`}>
          <img src={imageUrl} alt={name} className="product-image" />
        </Link>
        <button
          className="product-cart-overlay"
          aria-label="Add to cart"
          onClick={(e) => { e.preventDefault(); addToCart(id, 1); }}
        >
          <Plus size={15} /> Add to Cart
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
