import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { deleteProduct, listProducts, updateProduct, uploadProductImage } from "../api/productsApi";
import { addToCart, getCartItems, removeFromCart, updateCartQuantity } from "../lib/cartStore";
import { formatCurrency } from "../lib/currency";
import ProductImage from "../components/ProductImage";
import { FiSearch } from "react-icons/fi";
import { BsCart4 } from "react-icons/bs";
import { increaseCart } from "../lib/cartUtils";
import { showCartToast, showErrorToast, showSuccessToast, showWarningToast } from "../lib/toast";

function getProductBadge(product) {
  const stock = Number(product.stock) || 0;
  if (stock <= 0) {
    return { label: "Sold Out", tone: "sold-out" };
  }
  if (stock <= 5) {
    return { label: "Limited", tone: "limited" };
  }
  return { label: "Fresh Batch", tone: "fresh" };
}

function getShortDescription(description) {
  const text = String(description || "").trim();
  if (!text) {
    return "Traditional flavour, carefully prepared for everyday kitchens.";
  }
  return text.length > 110 ? `${text.slice(0, 107)}...` : text;
}

function ProductListPage({ isLoggedIn, isAdmin, authToken }) {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [cartQuantities, setCartQuantities] = useState({});
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({
    name: "",
    weight: "",
    description: "",
    imageUrl: "",
    price: "",
    stock: "0"
  });
  const [editImageFile, setEditImageFile] = useState(null);
  const [editImagePreviewUrl, setEditImagePreviewUrl] = useState("");
  const navigate = useNavigate();

  const loadProducts = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await listProducts();
      setProducts(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const syncCartQuantities = () => {
    const quantities = {};
    getCartItems().forEach((item) => {
      quantities[item.id] = Number(item.quantity) || 0;
    });
    setCartQuantities(quantities);
  };

  useEffect(() => {
    loadProducts();
    syncCartQuantities();
  }, []);

  useEffect(() => {
    return () => {
      if (editImagePreviewUrl.startsWith("blob:")) {
        URL.revokeObjectURL(editImagePreviewUrl);
      }
    };
  }, [editImagePreviewUrl]);

  const orderedProducts = useMemo(() => {
    const searchTerm = search.trim().toLowerCase();
    const matches = [];
    const remainingInStock = [];
    const remainingOutOfStock = [];

    products.forEach((product) => {
      const name = String(product.name || "").toLowerCase();
      const isMatch = searchTerm && name.includes(searchTerm);

      if (isMatch) {
        matches.push(product);
        return;
      }

      if (Number(product.stock) <= 0) {
        remainingOutOfStock.push(product);
      } else {
        remainingInStock.push(product);
      }
    });

    if (!searchTerm) {
      return [...remainingInStock, ...remainingOutOfStock];
    }

    return [...matches, ...remainingInStock, ...remainingOutOfStock];
  }, [products, search]);

const onIncreaseQuantity = (product) => {
  addToCart(product);
  syncCartQuantities();

  const totalItems = getCartItems().reduce(
    (total, item) => total + Number(item.quantity || 0),
    0
  );

  showCartToast(totalItems);
};

  const onDecreaseQuantity = (productId, currentQuantity) => {
    if (currentQuantity <= 1) {
      removeFromCart(productId);
    } else {
      updateCartQuantity(productId, currentQuantity - 1);
    }
    syncCartQuantities();
  };

  const onEditStart = (product) => {
    if (editImagePreviewUrl.startsWith("blob:")) {
      URL.revokeObjectURL(editImagePreviewUrl);
    }
    setEditingId(product.id);
    setEditForm({
      name: product.name || "",
      weight: product.weight || "",
      description: product.description || "",
      imageUrl: product.imageUrl || "",
      price: String(product.price ?? ""),
      stock: String(product.stock ?? 0)
    });
    setEditImageFile(null);
    setEditImagePreviewUrl("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const onEditCancel = () => {
    if (editImagePreviewUrl.startsWith("blob:")) {
      URL.revokeObjectURL(editImagePreviewUrl);
    }
    setEditingId(null);
    setEditImageFile(null);
    setEditImagePreviewUrl("");
  };

  const onEditImageChange = (file) => {
    if (editImagePreviewUrl.startsWith("blob:")) {
      URL.revokeObjectURL(editImagePreviewUrl);
    }

    if (!file) {
      setEditImageFile(null);
      setEditImagePreviewUrl("");
      return;
    }

    setEditImageFile(file);
    setEditImagePreviewUrl(URL.createObjectURL(file));
  };

  const onEditSave = async (event) => {
    event.preventDefault();
    if (!editingId) {
      return;
    }

    try {
      let uploadedImageUrl = editForm.imageUrl.trim();
      if (editImageFile) {
        const uploadResponse = await uploadProductImage(editImageFile, authToken);
        uploadedImageUrl = uploadResponse?.imageUrl || uploadedImageUrl;
      }

      const updatedProduct = await updateProduct(
        editingId,
        {
          name: editForm.name.trim(),
          weight: editForm.weight.trim(),
          description: editForm.description.trim(),
          imageUrl: uploadedImageUrl,
          price: Number(editForm.price),
          stock: Number(editForm.stock)
        },
        authToken
      );
      setProducts((prev) =>
        prev.map((product) => (product.id === editingId ? updatedProduct : product))
      );
      setEditForm((prev) => ({ ...prev, imageUrl: uploadedImageUrl }));
      setEditImageFile(null);
      if (editImagePreviewUrl.startsWith("blob:")) {
        URL.revokeObjectURL(editImagePreviewUrl);
      }
      setEditingId(null);
      setEditImagePreviewUrl("");
      showSuccessToast("Product updated.");
    } catch (err) {
      showErrorToast(err.message);
    }
  };

  const onDeleteProduct = async (id) => {
    if (!window.confirm("Delete this product?")) {
      return;
    }
    try {
      await deleteProduct(id, authToken);
      showWarningToast("Product deleted.");
      await loadProducts();
    } catch (err) {
      showErrorToast(err.message);
    }
  };

  const openProductCard = (productId) => {
    if (!isLoggedIn) {
      showWarningToast("Login required to view details or add to cart.");
      navigate("/login");
      return;
    }
    navigate(`/products/${productId}`);
  };

  return (
    <section>
      {isAdmin && editingId && (
        <div className="card">
          <h2>Edit Product</h2>
          <form className="admin-products-form" onSubmit={onEditSave}>
            <label>
              Name
              <input
                value={editForm.name}
                onChange={(e) => setEditForm((prev) => ({ ...prev, name: e.target.value }))}
                required
              />
            </label>
            <label>
              Weight
              <input
                value={editForm.weight}
                onChange={(e) => setEditForm((prev) => ({ ...prev, weight: e.target.value }))}
                required
              />
            </label>
            <label>
              Upload File
              <div className="file-upload-row">
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => onEditImageChange(e.target.files?.[0] || null)}
                />
                {editImagePreviewUrl && (
                  <div className="admin-image-preview admin-image-preview-inline">
                    <ProductImage
                      imageUrl={editImagePreviewUrl}
                      productName={editForm.name || "Product preview"}
                      className="admin-image-preview-media admin-image-preview-inline-media"
                    />
                  </div>
                )}
              </div>
              <small className="form-help-text">
                Choose a new image only if you want to replace the current one.
              </small>
            </label>
            <label>
              Description
              <textarea
                value={editForm.description}
                onChange={(e) => setEditForm((prev) => ({ ...prev, description: e.target.value }))}
                rows={4}
              />
            </label>
            <label>
              Price
              <input
                type="number"
                step="0.01"
                min="0.01"
                value={editForm.price}
                onChange={(e) => setEditForm((prev) => ({ ...prev, price: e.target.value }))}
                required
              />
            </label>
            <label>
              Stock
              <input
                type="number"
                min="0"
                value={editForm.stock}
                onChange={(e) => setEditForm((prev) => ({ ...prev, stock: e.target.value }))}
                required
              />
            </label>
            <div className="row admin-form-actions">
              <button type="submit">Update Product</button>
              <button type="button" className="secondary" onClick={onEditCancel}>
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}
      <div className="admin-search-block">
        <div className="search-input-wrap">
          <span className="search-input-icon" aria-hidden="true">
            <FiSearch />
          </span>
          <input
            id="product-search"
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by product name"
          />
        </div>
      </div>

      {loading && (
        <div className="loading-state">
          <div className="loading-spinner" aria-hidden="true"></div>
          <p className="muted">Loading products...</p>
        </div>
      )}
      {error && <p className="error">{error}</p>}

      {!loading && <div className="grid">
        {orderedProducts.map((product) => {
          const isOutOfStock = Number(product.stock) <= 0;
          const quantity = cartQuantities[product.id] || 0;
          const badge = getProductBadge(product);
          return (
          <article
            key={product.id}
            className={`card product-shop-card ${!isAdmin ? "product-shop-card-clickable" : ""}`}
            onClick={!isAdmin ? () => openProductCard(product.id) : undefined}
            onKeyDown={
              !isAdmin
                ? (event) => {
                    if (event.key === "Enter" || event.key === " ") {
                      event.preventDefault();
                      openProductCard(product.id);
                    }
                  }
                : undefined
            }
            role={!isAdmin ? "link" : undefined}
            tabIndex={!isAdmin ? 0 : undefined}
          >
            <div className={`product-card-media product-shop-card-media ${isOutOfStock ? "is-out-of-stock" : ""}`}>
              <div className="product-card-image-wrap product-image-link">
                <ProductImage imageUrl={product.imageUrl} productName={product.name} className="product-card-image" />
              </div>
              <div className={`product-shop-badge ${badge.tone}`}>{badge.label}</div>
            </div>
            <div className="product-shop-body">
              <p className="product-shop-weight-label">{product.weight}</p>
              <h3 className="product-shop-title">{product.name}</h3>
              <p className="product-shop-description">{getShortDescription(product.description)}</p>
              <div className="product-shop-price-row">
                <p className="product-shop-price">{formatCurrency(product.price)}</p>
                <div className="row product-shop-actions">
                  {!isAdmin && (
                    <>
                      {quantity > 0 ? (
                        <div className="cart-stepper product-shop-stepper" onClick={(event) => event.stopPropagation()}>
                          <button
                            type="button"
                            className="secondary"
                            onClick={(event) => {
                              event.stopPropagation();
                              onDecreaseQuantity(product.id, quantity);
                            }}
                          >
                            -
                          </button>
                          <span>{quantity}</span>
                          <button
                            type="button"
                            className="add-cart product-shop-add"
                            onClick={(event) => {
                              event.stopPropagation();
                              if (isOutOfStock) {
                                showWarningToast("Product not available.");
                                return;
                              }
                              onIncreaseQuantity(product);
                            }}
                          >
                            +
                          </button>
                        </div>
                      ) : (
                        <button
                          type="button"
                          className="add-cart product-shop-add"
                          onClick={(event) => {
                            event.stopPropagation();
                            if (!isLoggedIn) {
                              showWarningToast("Login required to view details or add to cart.");
                              navigate("/login");
                              return;
                            }
                            if (isOutOfStock) {
                              showWarningToast("Product not available.");
                              return;
                            }
                            onIncreaseQuantity(product);
                          }}
                        >
                          <BsCart4 />
                          <span> add</span>
                        </button>
                      )}
                    </>
                  )}
                  {isAdmin && (
                    <>
                      <button
                        type="button"
                        className="secondary"
                        onClick={(event) => {
                          event.stopPropagation();
                          onEditStart(product);
                        }}
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        className="danger"
                        onClick={(event) => {
                          event.stopPropagation();
                          onDeleteProduct(product.id);
                        }}
                      >
                        Delete
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          </article>
        )})}
      </div>}
    </section>
  );
}

export default ProductListPage;
