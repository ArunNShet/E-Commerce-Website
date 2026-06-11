import React from "react";
import { Link, NavLink } from "react-router-dom";
import { AiFillHome, AiOutlineHome } from "react-icons/ai";
import { BsCart4, BsCartFill } from "react-icons/bs";
import { IoLogInOutline, IoLogOutOutline } from "react-icons/io5";
import {
  MdAdminPanelSettings,
  MdOutlineAdminPanelSettings,
  MdOutlineShoppingBag,
  MdShoppingBag,
} from "react-icons/md";

function Header({ isLoggedIn, isAdmin, onLogout }) {
  return (
    <header className="topbar">
      <div className="brand">
        <h1>Revankar Condiments</h1>
        <p>Natural. Fresh. Homemade.</p>
      </div>

      <nav className="main-nav">
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
        {isLoggedIn ? (
          <Link to="/" className="nav-logout" onClick={onLogout}>
            <span className="nav-item-icon">
              <IoLogOutOutline />
            </span>
            Logout
          </Link>
        ) : (
          <NavLink to="/login">
            {() => (
              <>
                <span className="nav-item-icon">
                  <IoLogInOutline />
                </span>
                Login
              </>
            )}
          </NavLink>
        )}
      </nav>

      {isLoggedIn ? (
        <button type="button" className="mobile-auth-btn" onClick={onLogout}>
          <span className="nav-item-icon">
            <IoLogOutOutline />
          </span>
          Logout
        </button>
      ) : (
        <NavLink to="/login" className="mobile-auth-link">
          <span className="nav-item-icon">
            <IoLogInOutline />
          </span>
          Login
        </NavLink>
      )}
    </header>
  );
}

export default Header;
