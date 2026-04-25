import React, { useState } from "react";
import api from "../services/api";
import "./ProductModal.css";

export type ProductFormData = {
  name: string;
  description: string;
  price: number;
  imageUrl?: string;
  stockQuantity: number;
  category: string;
  isActive: boolean;
};

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: ProductFormData) => void;
  initialData?: ProductFormData;
};

const categories = ["Electronics", "Clothing", "Food", "Books"];

const ProductModal: React.FC<Props> = ({
  isOpen,
  onClose,
  onSubmit,
  initialData,
}) => {
  const [form, setForm] = useState<ProductFormData>(
    initialData ?? {
      name: "",
      description: "",
      price: 0,
      imageUrl: "",
      stockQuantity: 0,
      category: "",
      isActive: true,
    }
  );
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    setForm((prev: ProductFormData) => ({
      ...prev,
      [name]:
        type === "checkbox"
          ? (e.target as HTMLInputElement).checked
          : type === "number"
          ? Number(value)
          : value,
    }));
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setUploadError(null);

    try {
      const body = new FormData();
      body.append("file", file);
      const url = await api.post("/products/upload-image", body, {
        headers: { "Content-Type": "multipart/form-data" },
      }) as unknown as string;
      setForm((prev) => ({ ...prev, imageUrl: url }));
    } catch (err) {
      setUploadError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = () => {
    if (!form.name || !form.price) return;
    onSubmit(form);
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <div className="modal-header">
          <h2>{initialData ? "Edit Product" : "Create Product"}</h2>
          <button onClick={onClose} className="modal-close-btn">✕</button>
        </div>

        <div className="modal-body">
          <label className="modal-field">
            <span>Product Name</span>
            <input
              name="name"
              placeholder="e.g. Wireless Headphones"
              value={form.name}
              onChange={handleChange}
            />
          </label>

          <label className="modal-field">
            <span>Description</span>
            <textarea
              name="description"
              placeholder="Short product description"
              value={form.description}
              onChange={handleChange}
            />
          </label>

          <div className="modal-row">
            <label className="modal-field">
              <span>Price ($)</span>
              <input
                type="number"
                name="price"
                placeholder="0.00"
                min="0"
                step="0.01"
                value={form.price}
                onChange={handleChange}
              />
            </label>

            <label className="modal-field">
              <span>Stock Quantity</span>
              <input
                type="number"
                name="stockQuantity"
                placeholder="0"
                min="0"
                value={form.stockQuantity}
                onChange={handleChange}
              />
            </label>
          </div>

          <label className="modal-field">
            <span>Category</span>
            <select name="category" value={form.category} onChange={handleChange}>
              <option value="">Select a category</option>
              {categories.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </label>

          <label className="modal-field">
            <span>Product Image</span>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              disabled={uploading}
            />
          </label>

          {uploading && (
            <div className="modal-upload-status uploading">Uploading image...</div>
          )}

          {uploadError && (
            <div className="modal-upload-status error">{uploadError}</div>
          )}

          {!uploading && form.imageUrl && (
            <div className="modal-image-preview">
              <img src={form.imageUrl} alt="Preview" />
            </div>
          )}

          <label className="modal-checkbox-row">
            <input
              type="checkbox"
              name="isActive"
              checked={form.isActive}
              onChange={handleChange}
            />
            <span>Active product</span>
          </label>
        </div>

        <div className="modal-footer">
          <button className="modal-cancel-btn" onClick={onClose}>
            Cancel
          </button>
          <button
            className="modal-submit-btn"
            onClick={handleSubmit}
            disabled={uploading}
          >
            Save Product
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductModal;
