import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { IoMdArrowRoundBack } from "react-icons/io";
import { getProduct } from "../api/productsApi";
import { addToCart, getCartItems, removeFromCart, updateCartQuantity } from "../lib/cartStore";
import { formatPricePerWeight } from "../lib/currency";
import ProductImage from "../components/ProductImage";
import { showSuccessToast, showWarningToast } from "../lib/toast";

function ProductDetailPage({ isAdmin }) {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [error, setError] = useState("");
  const [quantity, setQuantity] = useState(0);

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
  }, [id]);

  if (error) {
    return <p className="error">{error}</p>;
  }

  if (!product) {
    return (
      <div className="loading-state">
        <div className="loading-spinner" aria-hidden="true"></div>
        <p className="muted">Loading product...</p>
      </div>
    );
  }

  const isOutOfStock = Number(product.stock) <= 0;

  const onIncreaseQuantity = () => {
    addToCart(product);
    const cartItem = getCartItems().find((item) => item.id === product.id);
    setQuantity(cartItem ? Number(cartItem.quantity) || 0 : 0);
    showSuccessToast("Added to cart.");
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
      <Link to="/products" className="product-detail-back">
        <span className="nav-item-icon">
          <IoMdArrowRoundBack />
        </span>
        Back to products
      </Link>
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
                    <button
                      type="button"
                      className="add-cart"
                      onClick={() => {
                        if (isOutOfStock) {
                          showWarningToast("Product not available.");
                          return;
                        }
                        onIncreaseQuantity();
                      }}
                    >
                      +
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    className="add-cart"
                    onClick={() => {
                      if (isOutOfStock) {
                        showWarningToast("Product not available.");
                        return;
                      }
                      onIncreaseQuantity();
                    }}
                  >
                    {"\uD83D\uDED2"} Add Cart
                  </button>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}

export default ProductDetailPage;
