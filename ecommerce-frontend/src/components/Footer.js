import React from "react";
import { Link } from "react-router-dom";
import { FaInstagram } from "react-icons/fa";
import { FaFacebook } from "react-icons/fa";
import { FaWhatsapp } from "react-icons/fa";

function Footer() {
  return (
    <footer className="site-footer">
      <div className="site-footer-top">
        <div className="site-footer-brand">
          <div className="site-brand site-brand-footer">
            <div className="site-brand-icon">DRC</div>
            <div className="site-brand-text">
              <span className="site-brand-name">Daivajna Revankar Condiments</span>
              <span className="site-brand-sub">Condiments & Spices</span>
            </div>
          </div>
          <p className="site-footer-tagline">
            Four generations of handcrafted pickles, masalas, and spices made with honest ingredients
            and family recipes.
          </p>
          <div className="site-footer-socials" aria-label="Social links">
            <a href="https://www.instagram.com/daivajna_revankar_condiments?utm_source=qr&igsh=YnNjY2wydHFjYW1i" target="_blank" rel="noopener noreferrer" className="social-btn" aria-label="Instagram">
              <FaInstagram />
            </a>
            <a href="/" className="social-btn" aria-label="Facebook">
              <FaFacebook />
            </a>
            <a href="/" className="social-btn" aria-label="WhatsApp">
              <FaWhatsapp />
            </a>
          </div>
        </div>

        <div className="site-footer-column">
          <h4>Shop</h4>
          <ul>
            <li>
              <Link to="/products">Pickles & Achaar</Link>
            </li>
            <li>
              <Link to="/products">Masala Blends</Link>
            </li>
            <li>
              <Link to="/products">All Products</Link>
            </li>
            <li>
              <Link to="/cart">Go to Cart</Link>
            </li>
          </ul>
        </div>

        <div className="site-footer-column">
          <h4>Explore</h4>
          <ul>
            <li>
              <a href="/#story">Our Story</a>
            </li>
            <li>
              <a href="/#craft">Our Process</a>
            </li>
            <li>
              <a href="/#reviews">Customer Reviews</a>
            </li>
            <li>
              <a href="/contact">Contact Us</a>
            </li>
          </ul>
        </div>

        <div className="site-footer-column">
          <h4>Contact</h4>
          <ul>
            <li>Deepak S M</li>
            <li>+91 9916231259</li>
            <li>No. 8/1, 5th Cross, Near Rangaswamy Temple, Avenue Road, Bangalore - 560053</li>
          </ul>
        </div>
      </div>

      <div className="site-footer-bottom">
        <p>© 2026 Revankar Condiments. All rights reserved.</p>
      </div>
    </footer>
  );
}

export default Footer;
