import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2 } from 'lucide-react';
import api from '../../services/api';
import type { Product } from '../../contexts/CartContext';
import './ManageProducts.css';

const ManageProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, []);

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

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      // In a real scenario we'd call api.delete(`/products/${id}`)
      setProducts(products.filter(p => p.id !== id));
    }
  };

  return (
    <div className="manage-products">
      <div className="admin-page-header flex-between">
        <div>
          <h1>Manage Products</h1>
          <p>View, edit, or add new products to your catalog.</p>
        </div>
        <button className="btn btn-primary flex-align-center gap-sm">
          <Plus size={20} /> Add Product
        </button>
      </div>

      <div className="glass-panel p-md">
        {loading ? (
          <div>Loading products...</div>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Image</th>
                <th>Name</th>
                <th>Category</th>
                <th>Price</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map(product => (
                <tr key={product.id}>
                  <td>
                    <img src={product.image} alt={product.title} className="table-img" />
                  </td>
                  <td>{product.title}</td>
                  <td>{product.category}</td>
                  <td>${product.price.toFixed(2)}</td>
                  <td>
                    <div className="action-buttons">
                      <button className="icon-btn edit-btn" title="Edit">
                        <Edit2 size={18} />
                      </button>
                      <button 
                        className="icon-btn delete-btn" 
                        title="Delete"
                        onClick={() => handleDelete(product.id)}
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default ManageProducts;
