import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";

const marqueeItems = [
  "Authentic Karnataka Recipes",
  "Free Shipping",
  "Farm-to-Jar Sourcing",
  "No Artificial Preservatives",
  "Stone-Ground Masalas"
];

const categories = [
  { icon: "Jar", name: "Pickles", count: "24 items" },
  { icon: "Chilli", name: "Spices", count: "18 items" },
  { icon: "Blend", name: "Masalas", count: "22 items" },
  { icon: "Crisp", name: "Papad", count: "10 items" },
  { icon: "Table", name: "Condiments", count: "16 items" },
];

const craftSteps = [
  {
    title: "Sourcing",
    text: "We work with trusted growers across Karnataka for chillies, coconuts, lentils, and spice crops.",
  },
  {
    title: "Sun-Drying",
    text: "Traditional drying methods deepen flavour naturally and preserve the texture each recipe depends on.",
  },
  {
    title: "Stone Grinding",
    text: "Slow-ground masalas hold on to their oils, aroma, and warmth far better than fast industrial blends.",
  },
  {
    title: "Sealed Fresh",
    text: "Packed in small batches so every jar and pouch reaches the kitchen bright, balanced, and ready to use.",
  },
];

const testimonials = [
  {
    name: "Arun N Shet",
    location: "Bengaluru",
    text: "The mango pickle tastes like the jars we grew up opening at lunch. It feels personal, not factory made.",
  },
  {
    name: "Praveen",
    location: "Bengaluru",
    text: "The Byadagi chilli powder has a deep colour and clean aroma that instantly lifts everyday cooking.",
  },
  {
    name: "Umesh",
    location: "Bengaluru",
    text: "The gift hamper packaging felt premium, and the flavours inside were even better than expected.",
  },
];

function HomePage() {
  const heroSlides = useMemo(() => ["/images/DRC-2.jpeg"], []);
  const [activeSlide, setActiveSlide] = useState(0);

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      setActiveSlide((current) => (current + 1) % heroSlides.length);
    }, 4000);

    return () => window.clearInterval(intervalId);
  }, [heroSlides.length]);

  return (
    <div className="home-page">
      <section className="hero-section" id="home">
        <div className="hero-background" />
        <div className="hero-content-shell">
          <div className="hero-copy">
            <div className="hero-eyebrow">Authentic Karnataka Flavours Since 1978</div>
            <h1>
              The Soul of
              <span> Indian Spice</span>
              in Every Jar
            </h1>
            <p>
              Handcrafted condiments, sun-dried pickles, stone-ground masalas, and aromatic spices
              made from recipes passed through four generations.
            </p>
            <div className="hero-actions">
              <Link to="/products" className="primary-cta">
                Shop Now
              </Link>
              <a href="#story" className="secondary-cta">
                Our Story
              </a>
            </div>
            <div className="hero-stats">
              <article>
                <strong>46+</strong>
                <span>Years of Craft</span>
              </article>
              <article>
                <strong>80+</strong>
                <span>Recipes</span>
              </article>
              <article>
                <strong>12K+</strong>
                <span>Happy Families</span>
              </article>
            </div>
          </div>

          <div className="hero-visual">
            <div className="hero-carousel">
              {heroSlides.map((slide, index) => (
                <div key={slide} className={`hero-slide ${index === activeSlide ? "active" : ""}`}>
                  <img src={slide} alt={`Revankar speciality ${index + 1}`} />
                </div>
              ))}
            </div>
            <div className="hero-shipping-badge">Free Shipping</div>
          </div>
        </div>
      </section>

      <section className="marquee-strip" aria-label="Brand highlights">
        <div className="marquee-track">
          {[...marqueeItems, ...marqueeItems].map((item, index) => (
            <span key={`${item}-${index}`} className="marquee-item">
              {item}
            </span>
          ))}
        </div>
      </section>

      <section className="home-section category-section">
        <div className="section-heading centered">
          <p className="section-label">Browse by Category</p>
          <h2>
            Discover Our <span>Range</span>
          </h2>
          <p>
            From fiery pickles to fragrant masalas, each category is shaped by old recipes and careful
            sourcing.
          </p>
        </div>
        <div className="category-grid">
          {categories.map((category) => (
            <article key={category.name} className="category-card">
              <div className="category-icon">{category.icon}</div>
              <h3>{category.name}</h3>
              <p>{category.count}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="home-section story-section" id="story">
        <div className="story-visual">
          <div className="story-main-image">
            <img src="/images/DRC-1.jpeg" alt="Traditional Revankar condiments" />
          </div>
          <div className="story-accent-image">
            <img src="/images/DRC-2.jpeg" alt="Revankar spice range" />
          </div>
          <div className="story-years-badge">
            <strong>46</strong>
            <span>Years</span>
          </div>
        </div>

        <div className="story-copy">
          <p className="section-label">Our Story</p>
          <h2>
            A Kitchen Born in <span>Karnataka</span>
          </h2>
          <p>
            Revankar Condiments began as a family kitchen tradition and grew into a trusted name by
            preserving the same care in every batch.
          </p>
          <p>
            We still focus on direct ingredients, balanced spice profiles, and the kind of flavour that
            belongs on real dining tables, not just product labels.
          </p>
          <div className="story-pillars">
            <article>
              <strong>100% Natural Ingredients</strong>
              <span>No artificial colours or unnecessary shortcuts.</span>
            </article>
            <article>
              <strong>Farm-to-Jar Sourcing</strong>
              <span>Trusted regional supply from Karnataka farming communities.</span>
            </article>
            <article>
              <strong>Heirloom Recipes</strong>
              <span>Family methods refined over decades, not trend-driven formulas.</span>
            </article>
          </div>
        </div>
      </section>

      <section className="home-section craft-section" id="craft">
        <div className="section-heading centered">
          <p className="section-label">How We Make It</p>
          <h2>
            Craft in <span>Every Step</span>
          </h2>
        </div>
        <div className="craft-grid">
          {craftSteps.map((step, index) => (
            <article key={step.title} className="craft-card">
              <div className="craft-number">0{index + 1}</div>
              <h3>{step.title}</h3>
              <p>{step.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="offer-section">
        <div className="offer-card">
          <p className="offer-tag">Online Ordering Coming Soon</p>
          <h2>
            Currently not available for placing orders. 
            {/* <span>20% Off</span> */}
          </h2>
          <p>
            The products, descriptions, and prices displayed are for information purposes only. For purchases, bulk orders, or product enquiries, please contact us directly through our Contact Us page.
          </p>
          <p>Thank you for choosing Daivajna Revankar Condiments.</p>
          <Link to="/products" className="primary-cta">
            Shop Products
          </Link>
        </div>
      </section>

      <section className="home-section reviews-section" id="reviews">
        <div className="section-heading centered">
          <p className="section-label">Customer Love</p>
          <h2>
            What Families <span>Say</span>
          </h2>
        </div>
        <div className="review-grid">
          {testimonials.map((review) => (
            <article key={review.name} className="review-card">
              <div className="review-stars">★★★★★</div>
              <p>{review.text}</p>
              <div className="review-author">
                <strong>{review.name}</strong>
                <span>{review.location}</span>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}

export default HomePage;
