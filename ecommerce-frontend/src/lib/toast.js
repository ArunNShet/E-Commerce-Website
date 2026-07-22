import { Bounce, toast } from "react-toastify";

const CART_TOAST_ID = "cart-toast";

const baseOptions = {
  position: "top-right",
  autoClose: 2000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  theme: "colored",
  transition: Bounce,
};

export function showCartToast(totalItems) {
  const message = `${totalItems} item${totalItems > 1 ? "s" : ""} in cart`;

  if (toast.isActive(CART_TOAST_ID)) {
    toast.update(CART_TOAST_ID, {
      render: message,
      type: "success",
      autoClose: 2000,
    });
  } else {
    toast.success(message, {
      ...baseOptions,
      toastId: CART_TOAST_ID,
    });
  }
}

export function showSuccessToast(message) {
  toast.success(message, baseOptions);
}

export function showErrorToast(message) {
  toast.error(message, baseOptions);
}

export function showWarningToast(message) {
  toast.warning(message, baseOptions);
}
