import React, { useEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { deleteProduct, listProducts, updateProduct } from "../api/productsApi";
import { addToCart, getCartItems, removeFromCart, updateCartQuantity } from "../lib/cartStore";
import { formatPricePerWeight } from "../lib/currency";
import ProductImage from "../components/ProductImage";

function ProductListPage({ isLoggedIn, isAdmin, authToken }) {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);
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
  const toastTimerRef = useRef(null);
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

  const orderedProducts = useMemo(() => {
    const searchTerm = search.trim().toLowerCase();

    const reorderBySearch = (list) => {
      if (!searchTerm) {
        return list;
      }
      const matches = [];
      const nonMatches = [];
      list.forEach((product) => {
        const name = String(product.name || "").toLowerCase();
        if (name.includes(searchTerm)) {
          matches.push(product);
        } else {
          nonMatches.push(product);
        }
      });
      return [...matches, ...nonMatches];
    };

    const inStock = [];
    const outOfStock = [];
    products.forEach((product) => {
      if (Number(product.stock) <= 0) {
        outOfStock.push(product);
      } else {
        inStock.push(product);
      }
    });

    return [...reorderBySearch(inStock), ...reorderBySearch(outOfStock)];
  }, [products, search]);

  const onIncreaseQuantity = (product) => {
    addToCart(product);
    syncCartQuantities();
    showToast("Added to cart.");
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
    setEditingId(product.id);
    setEditForm({
      name: product.name || "",
      weight: product.weight || "",
      description: product.description || "",
      imageUrl: product.imageUrl || "",
      price: String(product.price ?? ""),
      stock: String(product.stock ?? 0)
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const onEditCancel = () => {
    setEditingId(null);
  };

  const onEditSave = async (event) => {
    event.preventDefault();
    if (!editingId) {
      return;
    }

    try {
      await updateProduct(
        editingId,
        {
          name: editForm.name.trim(),
          weight: editForm.weight.trim(),
          description: editForm.description.trim(),
          imageUrl: editForm.imageUrl.trim(),
          price: Number(editForm.price),
          stock: Number(editForm.stock)
        },
        authToken
      );
      setEditingId(null);
      showToast("Product updated.");
      await loadProducts();
    } catch (err) {
      showToast(err.message, "error");
    }
  };

  const onDeleteProduct = async (id) => {
    if (!window.confirm("Delete this product?")) {
      return;
    }
    try {
      await deleteProduct(id, authToken);
      showToast("Product deleted.");
      await loadProducts();
    } catch (err) {
      showToast(err.message, "error");
    }
  };

  return (
    <section>
      {toast && <div className={`toast-message ${toast.type}`}>{toast.message}</div>}
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
              Image URL
              <input
                value={editForm.imageUrl}
                onChange={(e) => setEditForm((prev) => ({ ...prev, imageUrl: e.target.value }))}
              />
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
        <label htmlFor="product-search">Search Products</label>
        <input
          id="product-search"
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by product name"
        />
      </div>

      {loading && <p className="muted">Loading products...</p>}
      {error && <p className="error">{error}</p>}

      <div className="grid">
        {orderedProducts.map((product) => {
          const isOutOfStock = Number(product.stock) <= 0;
          const quantity = cartQuantities[product.id] || 0;
          return (
          <article key={product.id} className="card">
            <div className={`product-card-media ${isOutOfStock ? "is-out-of-stock" : ""}`}>
              <Link
                to={isLoggedIn ? `/products/${product.id}` : "/login"}
                className="product-card-image-wrap product-image-link"
              >
                <ProductImage imageUrl={product.imageUrl} productName={product.name} className="product-card-image" />
              </Link>
              {isOutOfStock && <div className="product-card-stock-banner">Out of stock</div>}
            </div>
            <h3>{product.name}</h3>
            <p>Price: {formatPricePerWeight(product.price, product.weight)}</p>
            <div className="row">
              <Link
                to={isLoggedIn ? `/products/${product.id}` : "/login"}
                className={!isLoggedIn ? "muted" : undefined}
              >
                View
              </Link>
              {!isAdmin && (
                <>
                  {quantity > 0 ? (
                    <div className="cart-stepper">
                      <button type="button" className="secondary" onClick={() => onDecreaseQuantity(product.id, quantity)}>
                        -
                      </button>
                      <span>{quantity}</span>
                      <button type="button" className="add-cart" disabled={isOutOfStock} onClick={() => onIncreaseQuantity(product)}>
                        +
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      className="add-cart"
                      disabled={!isLoggedIn || isOutOfStock}
                      onClick={() => {
                        if (!isLoggedIn) {
                          navigate("/login");
                          return;
                        }
                        if (isOutOfStock) {
                          return;
                        }
                        onIncreaseQuantity(product);
                      }}
                    >
                      Add to Cart
                    </button>
                  )}
                </>
              )}
              {isAdmin && (
                <>
                  <button type="button" className="secondary" onClick={() => onEditStart(product)}>
                    Edit
                  </button>
                  <button type="button" className="danger" onClick={() => onDeleteProduct(product.id)}>
                    Delete
                  </button>
                </>
              )}
            </div>
            {!isLoggedIn && !isAdmin && <p className="muted">Login required to view details or add to cart.</p>}
          </article>
        )})}
      </div>
    </section>
  );
}

export default ProductListPage;
