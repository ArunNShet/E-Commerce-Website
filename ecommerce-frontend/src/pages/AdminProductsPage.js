import React, { useEffect, useState } from "react";
import {
  createProduct,
  uploadProductImage
} from "../api/productsApi";
import ProductImage from "../components/ProductImage";
import { showErrorToast, showSuccessToast } from "../lib/toast";

const initialForm = {
  name: "",
  weight: "",
  description: "",
  price: "",
  stock: "0"
};

function AdminProductsPage({ authToken }) {
  const [form, setForm] = useState(initialForm);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState("");

  useEffect(() => {
    return () => {
      if (imagePreviewUrl.startsWith("blob:")) {
        URL.revokeObjectURL(imagePreviewUrl);
      }
    };
  }, [imagePreviewUrl]);

  const onChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const toPayload = (imageUrl) => ({
    name: form.name.trim(),
    weight: form.weight.trim(),
    description: form.description.trim(),
    imageUrl,
    price: Number(form.price),
    stock: Number(form.stock)
  });

  const resetForm = () => {
    if (imagePreviewUrl.startsWith("blob:")) {
      URL.revokeObjectURL(imagePreviewUrl);
    }
    setForm(initialForm);
    setImageFile(null);
    setImagePreviewUrl("");
  };

  const onImageChange = (file) => {
    if (imagePreviewUrl.startsWith("blob:")) {
      URL.revokeObjectURL(imagePreviewUrl);
    }

    if (!file) {
      setImageFile(null);
      setImagePreviewUrl("");
      return;
    }

    setImageFile(file);
    setImagePreviewUrl(URL.createObjectURL(file));
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    try {
      let uploadedImageUrl = "";
      if (imageFile) {
        const uploadResponse = await uploadProductImage(imageFile, authToken);
        uploadedImageUrl = uploadResponse?.imageUrl || "";
      }

      await createProduct(toPayload(uploadedImageUrl), authToken);
      showSuccessToast("Product created.");
      resetForm();
    } catch (err) {
      showErrorToast(err.message);
    }
  };

  return (
    <section className="admin-products-page">
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
            Upload File
            <div className="file-upload-row">
              <input
                type="file"
                accept="image/*"
                onChange={(e) => onImageChange(e.target.files?.[0] || null)}
              />
              {imagePreviewUrl && (
                <div className="admin-image-preview admin-image-preview-inline">
                  <ProductImage
                    imageUrl={imagePreviewUrl}
                    productName={form.name || "Product preview"}
                    className="admin-image-preview-media admin-image-preview-inline-media"
                  />
                </div>
              )}
            </div>
            <small className="form-help-text">
              Image files are saved in backend folder `uploads/products`.
            </small>
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
