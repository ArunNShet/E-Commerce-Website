import React, { useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getProduct } from "../api/productsApi";
import { addToCart, getCartItems, removeFromCart, updateCartQuantity } from "../lib/cartStore";
import { formatPricePerWeight } from "../lib/currency";
import ProductImage from "../components/ProductImage";

function ProductDetailPage({ isAdmin }) {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [error, setError] = useState("");
  const [toast, setToast] = useState(null);
  const [quantity, setQuantity] = useState(0);
  const toastTimerRef = useRef(null);

  useEffect(() => {
    const loadProduct = async () => {
      setError("");
      try {
        const data = await getProduct(id);
        setProduct(data);
        const cartItem = getCartItems().find((item) => item.id === data.id);
        setQuantity(cartItem ? Number(cartItem.quantity) || 0 : 0);
      } catch (err) {
        setError(err.message);
      }
    };
    loadProduct();
    return () => {
      if (toastTimerRef.current) {
        clearTimeout(toastTimerRef.current);
      }
    };
  }, [id]);

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

  if (error) {
    return <p className="error">{error}</p>;
  }

  if (!product) {
    return <p className="muted">Loading product...</p>;
  }

  const isOutOfStock = Number(product.stock) <= 0;

  const onIncreaseQuantity = () => {
    addToCart(product);
    const cartItem = getCartItems().find((item) => item.id === product.id);
    setQuantity(cartItem ? Number(cartItem.quantity) || 0 : 0);
    showToast("Added to cart.");
  };

  const onDecreaseQuantity = () => {
    if (quantity <= 1) {
      removeFromCart(product.id);
      setQuantity(0);
      return;
    }
    updateCartQuantity(product.id, quantity - 1);
    setQuantity(quantity - 1);
  };

  return (
    <article className="card product-detail-card">
      {toast && <div className={`toast-message ${toast.type}`}>{toast.message}</div>}
      <div className="product-detail-layout">
        <div className="product-detail-media">
          <div className="product-detail-image-wrap">
            <ProductImage
              imageUrl={product.imageUrl}
              productName={product.name}
              className="product-detail-image"
            />
          </div>
        </div>
        <div className="product-detail-info">
          <h2>{product.name}</h2>
          <p>Price: {formatPricePerWeight(product.price, product.weight)}</p>
          {product.description && <p className="product-description">{product.description}</p>}
          {isOutOfStock && <p className="out-of-stock">Out of stock</p>}
          <div className="row">
            {!isAdmin && (
              <>
                {quantity > 0 ? (
                  <div className="cart-stepper">
                    <button type="button" className="secondary" onClick={onDecreaseQuantity}>
                      -
                    </button>
                    <span>{quantity}</span>
                    <button type="button" className="add-cart" disabled={isOutOfStock} onClick={onIncreaseQuantity}>
                      +
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    className="add-cart"
                    disabled={isOutOfStock}
                    onClick={() => {
                      if (isOutOfStock) {
                        return;
                      }
                      onIncreaseQuantity();
                    }}
                  >
                    Add to Cart
                  </button>
                )}
              </>
            )}
            <Link to="/products">Back to products</Link>
          </div>
        </div>
      </div>
    </article>
  );
}

export default ProductDetailPage;
