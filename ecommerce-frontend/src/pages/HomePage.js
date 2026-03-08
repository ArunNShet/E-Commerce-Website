import React from "react";
import { Link } from "react-router-dom";

function HomePage() {
  return (
    <section className="home">
      <div className="hero card">
        <div>
          <p className="eyebrow">Revankar Candiments</p>
          <h2>Authentic Taste. Pure Ingredients.</h2>
          <p className="muted">
            Discover handcrafted spice blends and traditional condiments made with premium raw
            ingredients, balanced flavors, and time-tested preparation methods.
          </p>
          <div className="row">
            <Link to="/products" className="button-link">
              Explore Products
            </Link>
          </div>
        </div>
        <div className="hero-panel">
          <div className="panel-item">
            <span className="panel-title">Small-Batch Quality</span>
            <span className="panel-value">Premium</span>
          </div>
          <div className="panel-item">
            <span className="panel-title">Traditional Recipes</span>
            <span className="panel-value">Authentic</span>
          </div>
          <div className="panel-item">
            <span className="panel-title">Pure Ingredients</span>
            <span className="panel-value">Trusted</span>
          </div>
        </div>
      </div>

      <div className="card about">
        <h3>About Revankar Candiments</h3>
        <p>
          Revankar Candiments focuses on premium spices and classic condiments crafted for everyday
          cooking. Each product is prepared to preserve aroma, depth, and consistency so you get the
          same rich taste in every dish.
        </p>
      </div>

      <footer className="home-footer card">
        <p>Revankar Candiments | Authentic Taste. Pure Ingredients.</p>
        <p className="muted">Premium spices and traditional condiments for every kitchen.</p>
      </footer>
    </section>
  );
}

export default HomePage;
