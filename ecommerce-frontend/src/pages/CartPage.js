import React, { useEffect, useMemo, useRef, useState } from "react";
import { clearCart, getCartItems, removeFromCart, updateCartQuantity } from "../lib/cartStore";
import { formatCurrency } from "../lib/currency";

function CartPage() {
  const [items, setItems] = useState(getCartItems());
  const [toast, setToast] = useState(null);
  const toastTimerRef = useRef(null);

  useEffect(() => {
    return () => {
      if (toastTimerRef.current) {
        clearTimeout(toastTimerRef.current);
      }
    };
  }, []);

  const total = useMemo(
    () => items.reduce((sum, item) => sum + Number(item.price) * Number(item.quantity), 0),
    [items]
  );

  const onQuantityChange = (id, quantity) => {
    setItems(updateCartQuantity(id, quantity));
  };

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

  const onRemove = (id) => {
    setItems(removeFromCart(id));
    showToast("Removed from cart.");
  };

  const onClear = () => {
    clearCart();
    setItems([]);
    showToast("Cart cleared.");
  };

  return (
    <section className="card">
      {toast && <div className={`toast-message ${toast.type}`}>{toast.message}</div>}
      <h2>Cart</h2>
      {items.length === 0 && <p className="muted">Your cart is empty.</p>}
      {items.map((item) => (
        <div key={item.id} className="card">
          <h4>{item.name}</h4>
          <p>{formatCurrency(item.price)}</p>
          <div className="row">
            <label>
              Quantity
              <input
                type="number"
                min="1"
                value={item.quantity}
                onChange={(e) => onQuantityChange(item.id, e.target.value)}
              />
            </label>
            <button type="button" className="danger" onClick={() => onRemove(item.id)}>
              Remove
            </button>
          </div>
        </div>
      ))}
      <h3>Total: {formatCurrency(total)}</h3>
      <button type="button" className="secondary" onClick={onClear}>
        Clear Cart
      </button>
    </section>
  );
}

export default CartPage;
