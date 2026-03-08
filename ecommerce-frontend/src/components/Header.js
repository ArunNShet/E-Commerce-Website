import React from "react";
import { Link } from "react-router-dom";

function Header({ isLoggedIn, isAdmin, onLogout }) {
  return (
    <header className="topbar">
      <div className="brand">
        <h1>Revankar Candiments</h1>
        <p>Authentic Taste. Pure Ingredients.</p>
      </div>

      {isLoggedIn ? (
        <button type="button" onClick={onLogout} className="danger mobile-auth-link">
          Logout
        </button>
      ) : (
        <Link to="/login" className="mobile-auth-link">
          Login
        </Link>
      )}

      <nav className="main-nav">
        <Link to="/">Home</Link>
        <Link to="/products">Products</Link>
        {isLoggedIn && !isAdmin && <Link to="/cart">Cart</Link>}
        {isAdmin && <Link to="/admin/products">Add Product</Link>}
        {!isLoggedIn && <Link to="/login">Login</Link>}
        {isLoggedIn && (
          <button type="button" onClick={onLogout} className="danger nav-logout">
            Logout
          </button>
        )}
      </nav>
    </header>
  );
}

export default Header;
