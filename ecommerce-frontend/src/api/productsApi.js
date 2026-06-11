import { apiRequest } from "./http";

export function listProducts(name = "") {
  const query = name ? `?name=${encodeURIComponent(name)}` : "";
  return apiRequest(`/api/products${query}`);
}

export function getProduct(id) {
  return apiRequest(`/api/products/${id}`);
}

export function createProduct(payload, authToken) {
  return apiRequest("/api/products", {
    method: "POST",
    headers: { Authorization: `Bearer ${authToken}` },
    body: JSON.stringify(payload)
  });
}

export function updateProduct(id, payload, authToken) {
  return apiRequest(`/api/products/${id}`, {
    method: "PUT",
    headers: { Authorization: `Bearer ${authToken}` },
    body: JSON.stringify(payload)
  });
}

export function deleteProduct(id, authToken) {
  return apiRequest(`/api/products/${id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${authToken}` }
  });
}

export function uploadProductImage(file, authToken) {
  const formData = new FormData();
  formData.append("file", file);

  return apiRequest("/api/uploads/products", {
    method: "POST",
    headers: { Authorization: `Bearer ${authToken}` },
    body: formData
  });
}
