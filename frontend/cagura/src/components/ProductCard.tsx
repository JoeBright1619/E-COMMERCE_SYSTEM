import { ShoppingCart, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import './ProductCard.css';

interface ProductCardProps {
  id: number;
  title: string;
  price: number;
  image: string;
  category: string;
  isNew?: boolean;
}

const ProductCard = ({ id, title, price, image, category, isNew }: ProductCardProps) => {
  const { addToCart } = useCart();

  return (
    <div className="product-card glass-panel">
      <div className="product-image-container">
        {isNew && <span className="product-badge">New</span>}
        <button className="wishlist-btn" aria-label="Add to wishlist">
          <Heart size={18} />
        </button>
        <Link to={`/product/${id}`}>
          <img src={image} alt={title} className="product-image" />
        </Link>
      </div>
      
      <div className="product-info">
        <span className="product-category">{category}</span>
        <Link to={`/product/${id}`} className="product-title-link">
          <h3 className="product-title">{title}</h3>
        </Link>
        <div className="product-bottom">
          <span className="product-price">${price.toFixed(2)}</span>
          <button 
            className="add-to-cart-btn" 
            aria-label="Add to cart"
            onClick={(e) => {
              e.preventDefault();
              addToCart(id, 1);
            }}
          >
            <ShoppingCart size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
