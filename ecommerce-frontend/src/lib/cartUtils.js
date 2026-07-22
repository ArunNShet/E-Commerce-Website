import { addToCart, getCartItems } from "./cartStore";
import { showCartToast } from "./toast";

export function increaseCart(product) {
  addToCart(product);

  const cartItems = getCartItems();

  const totalItems = cartItems.reduce(
    (total, item) => total + Number(item.quantity || 0),
    0
  );

  showCartToast(totalItems);

  return cartItems;
}