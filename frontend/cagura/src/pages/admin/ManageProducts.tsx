import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2 } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { productService } from '../../services/productService';
import { categoryService } from '../../services/categoryService';
import type { ProductResponseDto as Product, CategoryResponseDto } from '../../types';
import { withDerivedProductFields } from '../../utils/product';
import './ManageProducts.css';
import ProductModal, { type ProductFormData } from '../../components/ProductModal';
import Pagination from '../../components/Pagination';

const PAGE_SIZE = 10;

const ManageProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<CategoryResponseDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    fetchProducts();
    fetchCategories();
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

  const fetchCategories = async () => {
    try {
      const data = await categoryService.getAll();
      setCategories(data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await productService.remove(id);
        setProducts((prev) => prev.filter((p) => p.id !== id));
        toast.success('Product deleted');
      } catch {
        toast.error('Failed to delete product');
      }
    }
  };

  const handleAddProduct = () => {
    setEditingProduct(null);
    setIsModalOpen(true);
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingProduct(null);
  };

  const handleProductSubmit = async (formData: ProductFormData) => {
    try {
      if (editingProduct) {
        await productService.update(editingProduct.id, {
          name: formData.name,
          description: formData.description,
          price: formData.price,
          imageUrl: formData.imageUrl,
          stockQuantity: formData.stockQuantity,
          categoryId: formData.categoryId,
          isActive: formData.isActive,
        });
        toast.success('Product updated');
      } else {
        await productService.create({
          name: formData.name,
          description: formData.description,
          price: formData.price,
          imageUrl: formData.imageUrl,
          stockQuantity: formData.stockQuantity,
          categoryId: formData.categoryId,
        });
        toast.success('Product created');
      }
      handleCloseModal();
      fetchProducts();
    } catch {
      toast.error(editingProduct ? 'Failed to update product' : 'Failed to create product');
    }
  };

  const productToFormData = (product: Product): ProductFormData => ({
    name: product.name,
    description: product.description || '',
    price: product.price,
    imageUrl: product.imageUrl || '',
    stockQuantity: product.stockQuantity,
    categoryId: product.categoryId,
    isActive: product.isActive,
  });

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
            <div style={{ overflowX: 'auto' }}>
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
                  {products.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE).map((product) => (
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
                          <button
                            className="icon-btn edit-btn"
                            title="Edit"
                            onClick={() => handleEditProduct(product)}
                          >
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
            </div>
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
        key={editingProduct?.id ?? 'new'}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSubmit={handleProductSubmit}
        initialData={editingProduct ? productToFormData(editingProduct) : undefined}
        categories={categories}
      />
    </div>
  );
};

export default ManageProducts;
