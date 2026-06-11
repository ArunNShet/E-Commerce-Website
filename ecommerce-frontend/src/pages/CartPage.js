import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { IoMdArrowRoundBack } from "react-icons/io";
import { clearCart, getCartItems, removeFromCart, updateCartQuantity } from "../lib/cartStore";
import { formatCurrency } from "../lib/currency";
import ProductImage from "../components/ProductImage";
import { showWarningToast } from "../lib/toast";

function CartPage() {
  const [items, setItems] = useState(getCartItems());

  const total = useMemo(
    () => items.reduce((sum, item) => sum + Number(item.price) * Number(item.quantity), 0),
    [items]
  );

  const onQuantityChange = (id, quantity) => {
    setItems(updateCartQuantity(id, quantity));
  };

  const onRemove = (id) => {
    setItems(removeFromCart(id));
    showWarningToast("Removed from cart.");
  };

  const onIncrease = (id, currentQuantity) => {
    onQuantityChange(id, Number(currentQuantity) + 1);
  };

  const onDecrease = (id, currentQuantity) => {
    const nextQuantity = Number(currentQuantity) - 1;
    if (nextQuantity <= 0) {
      onRemove(id);
      return;
    }
    onQuantityChange(id, nextQuantity);
  };

  const onClear = () => {
    clearCart();
    setItems([]);
    showWarningToast("Cart cleared.");
  };

  const onProceedToPay = () => {
    showWarningToast("Payment option is not available now.");
  };

  return (
    <section className="card cart-page">
      <Link to="/products" className="product-detail-back">
        <span className="nav-item-icon">
          <IoMdArrowRoundBack />
        </span>
        Back to products
      </Link>
      <h2>Cart</h2>
      {items.length === 0 && <p className="muted">Your cart is empty.</p>}
      {items.map((item) => (
        <div key={item.id} className="cart-item">
          <div className="cart-item-main">
            <div className="cart-item-image-wrap">
              <ProductImage
                imageUrl={item.imageUrl}
                productName={item.name}
                className="cart-item-image"
              />
            </div>
            <div className="cart-item-info">
              <h4>{item.name}</h4>
              <p>{formatCurrency(item.price)}</p>
            </div>
          </div>
          <div className="cart-item-actions">
            <div className="cart-stepper cart-page-stepper">
              <button type="button" className="secondary" onClick={() => onDecrease(item.id, item.quantity)}>
                -
              </button>
              <span>{item.quantity}</span>
              <button type="button" className="add-cart" onClick={() => onIncrease(item.id, item.quantity)}>
                +
              </button>
            </div>
            <button type="button" className="danger cart-remove-button" onClick={() => onRemove(item.id)}>
              Remove
            </button>
          </div>
        </div>
      ))}
      {items.length > 0 && (
        <div className="cart-summary">
          <h3>Total: {formatCurrency(total)}</h3>
          <div className="cart-summary-actions">
            <button type="button" className="secondary cart-clear-button" onClick={onClear}>
              Clear Cart
            </button>
            <button type="button" className="cart-pay-button" onClick={onProceedToPay}>
              Proceed to Pay
            </button>
          </div>
        </div>
      )}
    </section>
  );
}

export default CartPage;
