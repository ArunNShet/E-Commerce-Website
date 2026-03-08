const CART_KEY = "ecommerce_cart";

export function getCartItems() {
  try {
    const raw = localStorage.getItem(CART_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function addToCart(product) {
  if (Number(product?.stock) <= 0) {
    return getCartItems();
  }

  const items = getCartItems();
  const existing = items.find((item) => item.id === product.id);
  if (existing) {
    existing.quantity += 1;
  } else {
    items.push({
      id: product.id,
      name: product.name,
      price: Number(product.price),
      quantity: 1
    });
  }
  localStorage.setItem(CART_KEY, JSON.stringify(items));
  return items;
}

export function updateCartQuantity(productId, quantity) {
  const items = getCartItems().map((item) =>
    item.id === productId ? { ...item, quantity: Math.max(1, Number(quantity)) } : item
  );
  localStorage.setItem(CART_KEY, JSON.stringify(items));
  return items;
}

export function removeFromCart(productId) {
  const items = getCartItems().filter((item) => item.id !== productId);
  localStorage.setItem(CART_KEY, JSON.stringify(items));
  return items;
}

export function clearCart() {
  localStorage.removeItem(CART_KEY);
}
