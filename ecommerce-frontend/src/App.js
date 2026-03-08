import React, { useMemo, useState } from "react";
import { BrowserRouter, Link, Navigate, Route, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage";
import ProductListPage from "./pages/ProductListPage";
import ProductDetailPage from "./pages/ProductDetailPage";
import CartPage from "./pages/CartPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import AdminProductsPage from "./pages/AdminProductsPage";
import { clearAuthSession, getAuthSession } from "./lib/auth";
import Header from "./components/Header";
import Footer from "./components/Footer";

function App() {
  const [session, setSession] = useState(getAuthSession());
  const isLoggedIn = useMemo(() => Boolean(session.token), [session.token]);
  const isAdmin = useMemo(() => session.role === "ADMIN", [session.role]);

  const handleLogout = () => {
    clearAuthSession();
    setSession({ token: "", role: "" });
  };

  return (
    <BrowserRouter>
      <div className="layout">
        <Header isLoggedIn={isLoggedIn} isAdmin={isAdmin} onLogout={handleLogout} />

        <main className="container">
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
            <Route
              path="/admin/products"
              element={
                isAdmin ? <AdminProductsPage authToken={session.token} /> : <Navigate to="/login" replace />
              }
            />
          </Routes>
        </main>
        <Footer />

        <nav className="bottom-nav">
          <Link to="/">Home</Link>
          <Link to="/products">Products</Link>
          {!isAdmin && <Link to={isLoggedIn ? "/cart" : "/login"}>Cart</Link>}
          {isAdmin && <Link to="/admin/products">Admin</Link>}
        </nav>
      </div>
    </BrowserRouter>
  );
}

export default App;
