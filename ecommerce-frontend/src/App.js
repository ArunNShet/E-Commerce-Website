import React, { useEffect, useMemo, useState } from "react";
import { BrowserRouter, NavLink, Navigate, Route, Routes, useLocation } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AiFillHome, AiOutlineHome } from "react-icons/ai";
import { BsCart4, BsCartFill } from "react-icons/bs";
import {
  MdAdminPanelSettings,
  MdOutlineAdminPanelSettings,
  MdOutlineShoppingBag,
  MdShoppingBag,
} from "react-icons/md";
import HomePage from "./pages/HomePage";
import Contact from "./pages/Contact";
import ProductListPage from "./pages/ProductListPage";
import ProductDetailPage from "./pages/ProductDetailPage";
import CartPage from "./pages/CartPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import AdminProductsPage from "./pages/AdminProductsPage";
import { clearAuthSession, getAuthSession } from "./lib/auth";
import Header from "./components/Header";
import Footer from "./components/Footer";
import { showSuccessToast } from "./lib/toast";

function AppShell() {
  const location = useLocation();

useEffect(() => {
  window.scrollTo({
    top: 0,
    left: 0,
    behavior: "smooth",
  });
}, [location.pathname]);
  const [session, setSession] = useState(getAuthSession());
  const isLoggedIn = useMemo(() => Boolean(session.token), [session.token]);
  const isAdmin = useMemo(() => session.role === "ADMIN", [session.role]);
  const isHomeRoute = location.pathname === "/";

  const handleLogout = () => {
    clearAuthSession();
    setSession({ token: "", role: "" });
    showSuccessToast("Logged out successfully.");
  };

  return (
    <div className="layout">
      <Header isLoggedIn={isLoggedIn} isAdmin={isAdmin} onLogout={handleLogout} />

      <main className={isHomeRoute ? "page-shell page-shell-home" : "page-shell"}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route
            path="/products"
            element={
              <ProductListPage
                isLoggedIn={isLoggedIn}
                isAdmin={isAdmin}
                authToken={session.token}
              />
            }
          />
          <Route
            path="/products/:id"
            element={isLoggedIn ? <ProductDetailPage isAdmin={isAdmin} /> : <Navigate to="/login" replace />}
          />
          <Route
            path="/cart"
            element={isLoggedIn && !isAdmin ? <CartPage /> : <Navigate to={isLoggedIn ? "/products" : "/login"} replace />}
          />
          <Route path="/login" element={<LoginPage onLogin={setSession} />} />
          <Route path="/register" element={<RegisterPage onRegister={setSession} />} />
          <Route path="/contact" element={<Contact />} />
          <Route
            path="/admin/products"
            element={isAdmin ? <AdminProductsPage authToken={session.token} /> : <Navigate to="/login" replace />}
          />
        </Routes>
      </main>
      <Footer />
      <ToastContainer newestOnTop pauseOnFocusLoss={false} />

      <nav className="bottom-nav">
        <NavLink to="/" end>
          {({ isActive }) => (
            <>
              <span className="nav-item-icon">
                {isActive ? <AiFillHome /> : <AiOutlineHome />}
              </span>
              Home
            </>
          )}
        </NavLink>
        <NavLink to="/products">
          {({ isActive }) => (
            <>
              <span className="nav-item-icon">
                {isActive ? <MdShoppingBag /> : <MdOutlineShoppingBag />}
              </span>
              Products
            </>
          )}
        </NavLink>
        {!isAdmin && (
          <NavLink to={isLoggedIn ? "/cart" : "/login"}>
            {({ isActive }) => (
              <>
                <span className="nav-item-icon">
                  {isActive ? <BsCartFill /> : <BsCart4 />}
                </span>
                Cart
              </>
            )}
          </NavLink>
        )}
        {isAdmin && (
          <NavLink to="/admin/products">
            {({ isActive }) => (
              <>
                <span className="nav-item-icon">
                  {isActive ? <MdAdminPanelSettings /> : <MdOutlineAdminPanelSettings />}
                </span>
                Admin
              </>
            )}
          </NavLink>
        )}
      </nav>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppShell />
    </BrowserRouter>
  );
}

export default App;
