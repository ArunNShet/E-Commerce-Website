import React, { useEffect, useRef, useState } from "react";
import {
  createProduct
} from "../api/productsApi";

const initialForm = {
  name: "",
  weight: "",
  description: "",
  imageUrl: "",
  price: "",
  stock: "0"
};

function AdminProductsPage({ authToken }) {
  const [form, setForm] = useState(initialForm);
  const [toast, setToast] = useState(null);
  const toastTimerRef = useRef(null);

  useEffect(() => {
    return () => {
      if (toastTimerRef.current) {
        clearTimeout(toastTimerRef.current);
      }
    };
  }, []);

  const showToast = (message, type = "success") => {
    if (toastTimerRef.current) {
      clearTimeout(toastTimerRef.current);
    }
    setToast({ message, type });
    toastTimerRef.current = setTimeout(() => {
      setToast(null);
      toastTimerRef.current = null;
    }, 3000);
  };

  const onChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const toPayload = () => ({
    name: form.name.trim(),
    weight: form.weight.trim(),
    description: form.description.trim(),
    imageUrl: form.imageUrl.trim(),
    price: Number(form.price),
    stock: Number(form.stock)
  });

  const resetForm = () => setForm(initialForm);

  const onSubmit = async (event) => {
    event.preventDefault();
    try {
      await createProduct(toPayload(), authToken);
      showToast("Product created.");
      resetForm();
    } catch (err) {
      showToast(err.message, "error");
    }
  };

  return (
    <section className="admin-products-page">
      {toast && <div className={`toast-message ${toast.type}`}>{toast.message}</div>}
      <div className="card">
        <h2>Create New Products</h2>
        <form className="admin-products-form" onSubmit={onSubmit}>
          <label>
            Name
            <input
              value={form.name}
              onChange={(e) => onChange("name", e.target.value)}
              required
              maxLength={180}
            />
          </label>
          <label>
            Weight
            <input
              value={form.weight}
              onChange={(e) => onChange("weight", e.target.value)}
              required
              maxLength={50}
            />
          </label>
          <label>
            Description
            <textarea
              value={form.description}
              onChange={(e) => onChange("description", e.target.value)}
              rows={4}
              maxLength={1500}
              placeholder="Enter product description"
            />
          </label>
          <label>
            Image URL
            <input
              value={form.imageUrl}
              onChange={(e) => onChange("imageUrl", e.target.value)}
              maxLength={500}
              placeholder="https://example.com/product.jpg"
            />
          </label>
          <label>
            Price
            <input
              type="number"
              step="0.01"
              min="0.01"
              value={form.price}
              onChange={(e) => onChange("price", e.target.value)}
              required
            />
          </label>
          <label>
            Stock
            <input
              type="number"
              min="0"
              value={form.stock}
              onChange={(e) => onChange("stock", e.target.value)}
              required
            />
          </label>
          <div className="row admin-form-actions">
            <button type="submit">Create Product</button>
          </div>
        </form>
      </div>
    </section>
  );
}

export default AdminProductsPage;
