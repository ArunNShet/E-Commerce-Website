const AUTH_TOKEN_KEY = "ecommerce_auth_token";
const AUTH_ROLE_KEY = "ecommerce_auth_role";

export function getAuthSession() {
  return {
    token: localStorage.getItem(AUTH_TOKEN_KEY) || "",
    role: localStorage.getItem(AUTH_ROLE_KEY) || ""
  };
}

export function setAuthSession(token, role) {
  localStorage.setItem(AUTH_TOKEN_KEY, token);
  localStorage.setItem(AUTH_ROLE_KEY, role || "");
  return { token, role };
}

export function clearAuthSession() {
  localStorage.removeItem(AUTH_TOKEN_KEY);
  localStorage.removeItem(AUTH_ROLE_KEY);
}
