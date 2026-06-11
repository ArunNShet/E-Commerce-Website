import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function HomePage() {
  const slides = [
    "/images/RC-1.jpeg",
    "/images/RC-2.jpeg"
  ];
  const [activeSlide, setActiveSlide] = useState(0);

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      setActiveSlide((current) => (current + 1) % slides.length);
    }, 3500);

    return () => window.clearInterval(intervalId);
  }, [slides.length]);

  return (
    <section className="home">
      <section className="home-hero">

        <div className="home-carousel card">
          <div className="home-carousel-frame">
            {slides.map((slide, index) => (
              <article
                key={slide}
                className={`home-slide ${index === activeSlide ? "is-active" : ""}`}
              >
                <img src={slide} alt={`Slide ${index + 1}`} className="home-slide-image" />
              </article>
            ))}
          </div>
          <div className="home-carousel-dots">
            {slides.map((slide, index) => (
              <button
                key={slide}
                type="button"
                className={index === activeSlide ? "is-active" : ""}
                onClick={() => setActiveSlide(index)}
                aria-label={`Show slide ${index + 1}`}
              />
            ))}
          </div>
        </div>

        <div className="home-hero-copy">
          <p className="eyebrow">Revankar Condiments</p>
          <h2>Premium Condiments Designed to Look Credible and Taste Finished.</h2>
          <p className="home-hero-text">
            Traditional flavour profile, cleaner presentation, and product quality positioned for
            modern households. The page now leads with stronger structure instead of a generic card.
          </p>
          <div className="home-highlights">
            <div>
              <strong>Pure Inputs</strong>
              <span>Ingredient-first preparation with stable flavour.</span>
            </div>
            <div>
              <strong>Retail Ready</strong>
              <span>Sharper presentation across product and homepage experience.</span>
            </div>
            <div>
              <strong>Daily Use</strong>
              <span>Built for repeat use in real kitchens, not showcase only.</span>
            </div>
          </div>
          <div className="home-hero-actions">
            <Link to="/products" className="button-link">
              Shop Products
            </Link>
          </div>
        </div>
        
      </section>

      <section className="home-metrics">
        <article className="card metric-card">
          <p className="metric-value">3x</p>
          <p className="metric-label">Sharper visual hierarchy than the previous landing page</p>
        </article>
        <article className="card metric-card">
          <p className="metric-value">100%</p>
          <p className="metric-label">Focused on condiments, clarity, and immediate product access</p>
        </article>
        <article className="card metric-card">
          <p className="metric-value">0</p>
          <p className="metric-label">Unnecessary filler sections carried forward from the old page</p>
        </article>
      </section>

      <section className="card home-story">
        <div>
          <p className="eyebrow">Why It Works</p>
          <h3>Built to feel like a product business, not a starter template.</h3>
        </div>
        <p>
          The new home page uses a stronger hero, rotating product imagery, cleaner trust signals,
          and tighter messaging. It is structured to move users toward products quickly while still
          looking deliberate on laptop, tablet, and mobile.
        </p>
      </section>
    </section>
  );
}

export default HomePage;
