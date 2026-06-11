import { Bounce, toast } from "react-toastify";

const baseOptions = {
  position: "top-right",
  autoClose: 3000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  theme: "colored",
  transition: Bounce
};

export function showSuccessToast(message) {
  toast.success(message, baseOptions);
}

export function showErrorToast(message) {
  toast.error(message, baseOptions);
}

export function showWarningToast(message) {
  toast.warning(message, baseOptions);
}
