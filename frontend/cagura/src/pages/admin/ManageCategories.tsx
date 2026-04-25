import { useEffect, useState } from 'react';
import { Pencil, Plus, Trash2, X } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { categoryService } from '../../services/categoryService';
import type { CategoryCreateDto, CategoryResponseDto, CategoryUpdateDto } from '../../types';

const EMPTY_FORM = {
  name: '',
  description: '',
};

const ManageCategories = () => {
  const [categories, setCategories] = useState<CategoryResponseDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingCategory, setEditingCategory] = useState<CategoryResponseDto | null>(null);
  const [formState, setFormState] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);

  const loadCategories = async () => {
    try {
      setLoading(true);
      const data = await categoryService.getAll();
      setCategories(data);
    } catch (error) {
      toast.error('Failed to load categories');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const resetForm = () => {
    setEditingCategory(null);
    setFormState(EMPTY_FORM);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!formState.name.trim()) {
      toast.error('Category name is required');
      return;
    }

    try {
      setSaving(true);

      if (editingCategory) {
        const payload: CategoryUpdateDto = {
          name: formState.name.trim(),
          description: formState.description.trim() || undefined,
        };
        await categoryService.update(editingCategory.id, payload);
        toast.success('Category updated');
      } else {
        const payload: CategoryCreateDto = {
          name: formState.name.trim(),
          description: formState.description.trim() || undefined,
        };
        await categoryService.create(payload);
        toast.success('Category created');
      }

      resetForm();
      await loadCategories();
    } catch (error) {
      toast.error('Failed to save category');
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (category: CategoryResponseDto) => {
    setEditingCategory(category);
    setFormState({
      name: category.name,
      description: category.description || '',
    });
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Delete this category?')) {
      return;
    }

    try {
      await categoryService.remove(id);
      toast.success('Category deleted');
      await loadCategories();
    } catch (error) {
      toast.error('Failed to delete category');
    }
  };

  return (
    <div className="manage-products">
      <div className="admin-page-header flex-between">
        <div>
          <h1>Manage Categories</h1>
          <p>Create, edit, and remove storefront categories from the live backend.</p>
        </div>
      </div>

      <div className="glass-panel p-md" style={{ marginBottom: '1.5rem' }}>
        <form onSubmit={handleSubmit} className="auth-form">
          <div className="flex-between" style={{ gap: '1rem', alignItems: 'center', marginBottom: '1rem' }}>
            <h2 style={{ margin: 0 }}>{editingCategory ? 'Edit Category' : 'Add Category'}</h2>
            {editingCategory && (
              <button type="button" className="btn btn-secondary" onClick={resetForm}>
                <X size={16} /> Cancel
              </button>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="category-name">Name</label>
            <input
              id="category-name"
              type="text"
              value={formState.name}
              onChange={(event) => setFormState((current) => ({ ...current, name: event.target.value }))}
              placeholder="Category name"
            />
          </div>

          <div className="form-group" style={{ marginTop: '1rem' }}>
            <label htmlFor="category-description">Description</label>
            <textarea
              id="category-description"
              value={formState.description}
              onChange={(event) => setFormState((current) => ({ ...current, description: event.target.value }))}
              placeholder="Short category description"
              rows={3}
              style={{ width: '100%', borderRadius: '12px', padding: '0.9rem 1rem', background: 'rgba(255,255,255,0.06)', color: 'var(--text-primary)', border: '1px solid rgba(255,255,255,0.08)' }}
            />
          </div>

          <button type="submit" className="btn btn-primary flex-align-center gap-sm" disabled={saving} style={{ marginTop: '1rem' }}>
            <Plus size={18} /> {saving ? 'Saving...' : editingCategory ? 'Update Category' : 'Create Category'}
          </button>
        </form>
      </div>

      <div className="glass-panel p-md">
        {loading ? (
          <div>Loading categories...</div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Description</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {categories.map((category) => (
                  <tr key={category.id}>
                    <td>{category.name}</td>
                    <td>{category.description || 'No description provided'}</td>
                    <td>
                      <div className="action-buttons">
                        <button className="icon-btn edit-btn" title="Edit" onClick={() => handleEdit(category)}>
                          <Pencil size={18} />
                        </button>
                        <button className="icon-btn delete-btn" title="Delete" onClick={() => handleDelete(category.id)}>
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageCategories;
