import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ShoppingCart, ArrowLeft, Star } from 'lucide-react';
import Skeleton from '../components/Skeleton';
import api from '../services/api';
import { useCart } from '../contexts/CartContext';
import type { Product } from '../contexts/CartContext';
import './ProductDetails.css';

const ProductDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const data = (await api.get(`/products/${id}`)) as unknown as Product;
        setProduct(data);
      } catch (error) {
        console.error('Error fetching product:', error);
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchProduct();
  }, [id]);

  if (loading) {
    return (
      <div className="product-details-page">
        <button className="back-btn" onClick={() => navigate(-1)}>
          <ArrowLeft size={20} /> Back to Shop
        </button>
        <Skeleton type="details" />
      </div>
    );
  }

  if (!product) return <div className="page-loader">Product not found</div>;

  return (
    <div className="product-details-page">
      <button className="back-btn" onClick={() => navigate(-1)}>
        <ArrowLeft size={20} /> Back to Shop
      </button>

      <div className="product-details-container glass-panel">
        <div className="product-image-section">
          {product.isNew && <span className="product-badge">New</span>}
          <img src={product.image} alt={product.title} className="detail-image" />
        </div>
        
        <div className="product-info-section">
          <span className="product-category">{product.category}</span>
          <h1 className="product-title">{product.title}</h1>
          
          <div className="product-rating">
            <Star className="star filled" size={18} />
            <Star className="star filled" size={18} />
            <Star className="star filled" size={18} />
            <Star className="star filled" size={18} />
            <Star className="star" size={18} />
            <span className="rating-text">(4.0) 24 reviews</span>
          </div>
          
          <div className="product-price">${product.price.toFixed(2)}</div>
          
          <p className="product-description">{product.description}</p>
          
          <div className="add-to-cart-section">
            <div className="quantity-selector">
              <button onClick={() => setQuantity(Math.max(1, quantity - 1))}>-</button>
              <span>{quantity}</span>
              <button onClick={() => setQuantity(quantity + 1)}>+</button>
            </div>
            
            <button 
              className="btn btn-primary add-btn"
              onClick={() => addToCart(product.id, quantity)}
            >
              <ShoppingCart size={20} /> Add to Cart
            </button>
          </div>
          
          <div className="product-meta">
            <div className="meta-item">
              <span className="meta-label">Availability:</span>
              <span className="meta-value in-stock">In Stock</span>
            </div>
            <div className="meta-item">
              <span className="meta-label">Shipping:</span>
              <span className="meta-value">Free worldwide shipping</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
