import { useState } from 'react';
import { Product } from '../types';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import '../styles/ProductCard.css';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { addToCart, isLoading } = useCart();
  const { isAuthenticated } = useAuth();
  const [quantity, setQuantity] = useState(1);
  const [error, setError] = useState<string | null>(null);

  const handleAddToCart = async () => {
    setError(null);
    if (!isAuthenticated) {
      setError('Please log in to add items to cart');
      return;
    }
    try {
      await addToCart(product.id, quantity);
      setQuantity(1);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to add to cart');
    }
  };

  return (
    <div className="product-card">
      <div className="product-image">
        {product.imageUrl ? (
          <img src={product.imageUrl} alt={product.name} />
        ) : (
          <div className="image-placeholder"></div>
        )}
      </div>

      <div className="product-body">
        <h3 className="product-name">{product.name}</h3>
        <p className="product-description">{product.description.substring(0, 60)}...</p>

        <div className="product-category">
          {product.categoryName}
        </div>

        <div className="product-rating">
          {'★'.repeat(Math.round(product.averageRating))}
          <span className="rating-text">({product.reviewCount})</span>
        </div>

        <div className="product-footer">
          <p className="product-price">${product.price.toFixed(2)}</p>
          
          {error && <p className="product-error">{error}</p>}

          <div className="quantity-control">
            <button onClick={() => setQuantity(Math.max(1, quantity - 1))} disabled={isLoading || quantity <= 1}>
              −
            </button>
            <span>{quantity}</span>
            <button onClick={() => setQuantity(quantity + 1)} disabled={isLoading}>
              +
            </button>
          </div>

          <button className="add-to-cart-btn" onClick={handleAddToCart} disabled={isLoading}>
            {isLoading ? 'ADDING...' : 'ADD TO CART'}
          </button>
        </div>
      </div>
    </div>
  );
}
