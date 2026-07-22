import React, { useEffect, useMemo, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { BsCart4 } from "react-icons/bs";
import { IoLogInOutline, IoLogOutOutline } from "react-icons/io5";
import { getCartItems } from "../lib/cartStore";

function Header({ isLoggedIn, isAdmin, onLogout }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [cartCount, setCartCount] = useState(() =>
    getCartItems().reduce((total, item) => total + Number(item.quantity || 0), 0)
  );

  useEffect(() => {
    const handleScroll = () => {
      document.body.classList.toggle("nav-scrolled", window.scrollY > 10);
    };

    const syncCartCount = () => {
      setCartCount(getCartItems().reduce((total, item) => total + Number(item.quantity || 0), 0));
    };

    handleScroll();
    syncCartCount();
    window.addEventListener("scroll", handleScroll);
    window.addEventListener("storage", syncCartCount);
    window.addEventListener("focus", syncCartCount);
    window.addEventListener("cart-updated", syncCartCount);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("storage", syncCartCount);
      window.removeEventListener("focus", syncCartCount);
      window.removeEventListener("cart-updated", syncCartCount);
    };
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [isLoggedIn, isAdmin]);

  const navigationItems = useMemo(
    () => [
      { to: "/", label: "Home", end: true },
      { to: "/products", label: "Shop" },
      ...(isAdmin ? [{ to: "/admin/products", label: "Admin" }] : []),
      ...(!isAdmin ? [{ to: isLoggedIn ? "/cart" : "/login", label: `Cart (${cartCount})` }] : []),
    ],
    [cartCount, isAdmin, isLoggedIn]
  );

  const authLink = isLoggedIn
    ? {
        label: "Logout",
        icon: <IoLogOutOutline />,
        action: onLogout,
        to: "/",
      }
    : {
        label: "Login",
        icon: <IoLogInOutline />,
        to: "/login",
      };

  return (
    <>
      <header className="site-nav">
        <div className="site-nav-inner">
          <Link to="/" className="site-brand" aria-label="Revankar Condiments home">
            <div className="site-brand-icon">DRC</div>
            <div className="site-brand-text">
              <span className="site-brand-name">Daivajna Revankar Condiments</span>
              <span className="site-brand-sub">Authentic Flavours & Spices</span>
            </div>
          </Link>

          <nav className="site-nav-links" aria-label="Primary navigation">
            <NavLink to="/" end className={({ isActive }) => (isActive ? "active" : "")}>
              Home
            </NavLink>
            <NavLink to="/products" className={({ isActive }) => (isActive ? "active" : "")}>
              Shop
            </NavLink>
            {isAdmin ? (
              <NavLink to="/admin/products" className={({ isActive }) => (isActive ? "active" : "")}>
                Admin
              </NavLink>
            ) : (
              <NavLink
  to="/contact"
  className={({ isActive }) => (isActive ? "active" : "")}
>
  Contact
</NavLink>
            )}
          </nav>

          <div className="site-nav-actions">
            {!isAdmin && (
              <NavLink to={isLoggedIn ? "/cart" : "/login"} className="cart-pill">
                <BsCart4 />
                <span>Cart ({cartCount})</span>
              </NavLink>
            )}

            {isLoggedIn ? (
              <button type="button" className="auth-pill auth-pill-logout" onClick={authLink.action}>
                {authLink.icon}
                <span>{authLink.label}</span>
              </button>
            ) : (
              <NavLink to={authLink.to} className="auth-pill">
                {authLink.icon}
                <span>{authLink.label}</span>
              </NavLink>
            )}

            <button
              type="button"
              className={`nav-hamburger ${menuOpen ? "is-open" : ""}`}
              onClick={() => setMenuOpen((current) => !current)}
              aria-expanded={menuOpen}
              aria-label="Toggle menu"
            >
              <span />
              <span />
              <span />
            </button>
          </div>
        </div>
      </header>

      <div className={`mobile-drawer ${menuOpen ? "open" : ""}`}>
        <nav className="mobile-drawer-links" aria-label="Mobile navigation">
          {navigationItems.map((item) => (
            <NavLink
              key={item.label}
              to={item.to}
              end={item.end}
              onClick={() => setMenuOpen(false)}
              className={({ isActive }) => (isActive ? "active" : "")}
            >
              {item.label}
            </NavLink>
          ))}

          {!isAdmin && (
<>

<NavLink
  to="/contact"
  onClick={() => setMenuOpen(false)}
  className={({ isActive }) => (isActive ? "active" : "")}
>
  Contact
</NavLink>

</>
)}


          {isLoggedIn ? (
            <button
              type="button"
              className="mobile-auth-action"
              onClick={() => {
                setMenuOpen(false);
                onLogout();
              }}
            >
              Logout
            </button>
          ) : (
            <NavLink to="/login" onClick={() => setMenuOpen(false)}>
              Login
            </NavLink>
          )}
        </nav>
      </div>
    </>
  );
}

export default Header;
