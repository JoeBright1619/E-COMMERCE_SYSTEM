import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2 } from 'lucide-react';
import api from '../../services/api';
import { productService } from '../../services/productService';
import type { ProductResponseDto as Product } from '../../types';
import { withDerivedProductFields } from '../../utils/product';
import './ManageProducts.css';
import ProductModal, { type ProductFormData } from '../../components/ProductModal';
import Pagination from '../../components/Pagination';

const PAGE_SIZE = 10;

const ManageProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const data = await productService.getAll();
      setProducts(data.map(withDerivedProductFields));
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

  const handleAddProduct = () => {
  setIsModalOpen(true);
};

  const handleProductSubmit = async (formData: ProductFormData) => {
    await api.post('/products', formData);
    setIsModalOpen(false);
    fetchProducts();
  };

  return (
    <div className="manage-products">
      <div className="admin-page-header flex-between">
        <div>
          <h1>Manage Products</h1>
          <p>View, edit, or add new products to your catalog.</p>
        </div>
        <button className="btn btn-primary flex-align-center gap-sm" onClick={handleAddProduct}>
          <Plus size={20} /> Add Product
        </button>
      </div>

      <div className="glass-panel p-md">
        {loading ? (
          <div>Loading products...</div>
        ) : (
          <>
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Image</th>
                  <th>Name</th>
                  <th>Category</th>
                  <th>Price</th>
                  <th>Stock</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE).map(product => (
                  <tr key={product.id}>
                    <td>
                      <img src={product.imageUrl || undefined} alt={product.name} className="table-img" />
                    </td>
                    <td>{product.name}</td>
                    <td>{product.categoryName}</td>
                    <td>${product.price.toFixed(2)}</td>
                    <td>{product.stockQuantity}</td>
                    <td>{product.isActive ? 'Active' : 'Inactive'}</td>
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
            <Pagination
              currentPage={currentPage}
              totalItems={products.length}
              pageSize={PAGE_SIZE}
              onPageChange={setCurrentPage}
            />
          </>
        )}
      </div>

      <ProductModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleProductSubmit}
      />
    </div>
  );
};

export default ManageProducts;
