import React, { useState } from "react";

function Contact() {
const [formData, setFormData] = useState({
name: "",
email: "",
phone: "",
message: "",
});

const handleChange = (e) => {
setFormData({
...formData,
[e.target.name]: e.target.value,
});
};

const handleSubmit = (e) => {
e.preventDefault();

alert("Thank you! Your message has been submitted.");

setFormData({
  name: "",
  email: "",
  phone: "",
  message: "",
});

};

return ( 
<section className="contact-page"> 
<div className="contact-hero">
  <h2>Daivajna Revankar Condiments</h2>

  <p className="contact-description">
    We are happy to assist you with product enquiries,
    bulk orders, dealership opportunities, gifting solutions,
    and customer support.
  </p></div>
  <div className="contact-container">
    {/* Left Side */}
    <div className="contact-info">
<p className="section-label">Get In Touch</p>
  <div className="contact-card">
    <div className="contact-item">
      <div className="contact-icon">👤</div>
      <div>
        <p>Deepak S M</p>
      </div>
    </div>

    <div className="contact-item">
      <div className="contact-icon">📞</div>
      <div>
        <h4>Phone</h4>
        <a href="tel:+919916231259">+91 9916231259</a>
      </div>
    </div>

    <div className="contact-item">
      <div className="contact-icon">📍</div>
      <div>
        <h4>Address</h4>
        <p>
          No. 8/1, 5th Cross,<br />
          Near Rangaswamy Temple,
          Avenue Road,<br />
          Bangalore - 560053
        </p>
      </div>
    </div>

    <div className="contact-item">
      <div className="contact-icon">🕒</div>
      <div>
        <h4>Business Hours</h4>
        <p>Monday - Saturday</p>
        <p>9:00 AM - 7:00 PM</p>
      </div>
    </div>
  </div>
</div>

    {/* Right Side */}
    <div className="contact-form-section">
      <h2>Contact Us</h2>

      <form onSubmit={handleSubmit} className="contact-form">
        <input
          type="text"
          name="name"
          placeholder="Full Name"
          value={formData.name}
          onChange={handleChange}
          required
        />

        <input
          type="email"
          name="email"
          placeholder="Email Address"
          value={formData.email}
          onChange={handleChange}
          required
        />

        <input
          type="tel"
          name="phone"
          placeholder="Phone Number"
          value={formData.phone}
          onChange={handleChange}
          required
        />

        <textarea
          name="message"
          rows="6"
          placeholder="Write your message..."
          value={formData.message}
          onChange={handleChange}
          required
        />

        <button type="submit">
          Send Message
        </button>
      </form>
    </div>

  </div>
</section>

);
}

export default Contact;
