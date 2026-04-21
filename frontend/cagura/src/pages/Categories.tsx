import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Grid3X3 } from 'lucide-react';
import type { CategoryResponseDto, ProductResponseDto } from '../types';
import { categoryService } from '../services/categoryService';
import api from '../services/api';
import './Categories.css';

const Categories = () => {
  const [categories, setCategories] = useState<CategoryResponseDto[]>([]);
  const [products, setProducts] = useState<ProductResponseDto[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [categoryData, productData] = await Promise.all([
          categoryService.getAll(),
          api.get('/products') as Promise<ProductResponseDto[]>,
        ]);

        setCategories(categoryData);
        setProducts(productData);
      } catch (error) {
        console.error('Failed to load categories:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const productCounts = useMemo(() => {
    return products.reduce<Record<number, number>>((acc, product) => {
      acc[product.categoryId] = (acc[product.categoryId] || 0) + 1;
      return acc;
    }, {});
  }, [products]);

  return (
    <div className="page-background categories-bg">
      <div className="categories-page">
        <div className="page-header text-center mb-5">
          <h1>Shop by <span className="text-gradient">Category</span></h1>
          <p className="text-secondary">Explore our curated collections driven by the live backend catalog.</p>
        </div>

        {loading ? (
          <p className="text-secondary">Loading categories...</p>
        ) : (
          <div className="category-grid">
            {categories.map((category) => (
              <Link
                to={`/shop?category=${encodeURIComponent(category.name)}`}
                key={category.id}
                className="category-card glass-panel"
              >
                <div className="category-icon-wrapper">
                  <Grid3X3 size={32} className="category-icon" />
                </div>
                <h2>{category.name}</h2>
                <p className="text-secondary">{category.description || 'Explore everything currently available in this collection.'}</p>
                <span className="item-count">{productCounts[category.id] || 0} items</span>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Categories;
