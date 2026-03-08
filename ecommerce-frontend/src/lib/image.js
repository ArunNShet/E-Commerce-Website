export const PLACEHOLDER_IMAGE_URL = "https://via.placeholder.com/320x200?text=Product";

const API_BASE_URL = (process.env.REACT_APP_API_BASE_URL || "").replace(/\/$/, "");

export function resolveImageUrl(imageUrl) {
  const inputUrl = String(imageUrl || "").trim();
  if (!inputUrl) {
    return PLACEHOLDER_IMAGE_URL;
  }

  const rawUrl = inputUrl.replace(/\\/g, "/");

  if (/^(https?:)?\/\//i.test(rawUrl) || rawUrl.startsWith("data:") || rawUrl.startsWith("blob:")) {
    return rawUrl;
  }

  if (rawUrl.startsWith("public/")) {
    return `/${rawUrl.slice("public/".length)}`;
  }

  if (rawUrl.startsWith("./")) {
    return `/${rawUrl.slice(2)}`;
  }

  if (rawUrl.startsWith("images/")) {
    return `/${rawUrl}`;
  }

  if (rawUrl.startsWith("/")) {
    if (rawUrl.startsWith("/images/")) {
      return rawUrl;
    }
    return API_BASE_URL ? `${API_BASE_URL}${rawUrl}` : rawUrl;
  }

  if (!rawUrl.includes("/")) {
    return `/images/${rawUrl}`;
  }

  return API_BASE_URL ? `${API_BASE_URL}/${rawUrl}` : `/${rawUrl}`;
}
