"use client";

import { useState } from "react";
import Image from "next/image";

export default function Home() {
  const [billingCycle, setBillingCycle] = useState("month");
  const [currency, setCurrency] = useState("USD");

  const toggleBilling = (cycle: string) => setBillingCycle(cycle);

  const toggleCurrency = () => {
    setCurrency(currency === "USD" ? "EGP" : "USD");
  };

  return (
    <>
      <div className="hero-section">
        <div className="hero-content">
          <div className="hero-text">
            <h1 className="hero-title">NEX MEDIA AI</h1>
            <p className="hero-subtitle">AI-powered creativity, made easy</p>

            <div className="hero-mobile-visual">
              <div className="visual-container">
                <img className="hero-gif" src="/static/home/img/home11.gif" alt="AI Animation" />
                <img className="hero-robot" src="/static/home/img/robot.png" alt="AI Robot" />
              </div>
            </div>

            <button onClick={() => window.location.href='#second'} className="cta-button">
              <span>Try for Free</span>
              <i className="fas fa-arrow-right"></i>
            </button>
          </div>

          <div className="hero-visual desktop">
            <div className="visual-container">
              <img className="hero-gif" src="/static/home/img/home11.gif" alt="AI Animation" />
              <img className="hero-robot" src="/static/home/img/robot.png" alt="AI Robot" />
            </div>
          </div>
        </div>
      </div>

      <div id="second" className="products-section">
        <div className="container">
          <div className="section-header">
            <h2>Our Products</h2>
            <p>Discover our AI-powered tools designed to enhance your creativity</p>
          </div>

          <div className="products-grid">
            <a href="/voice-to-text/" className="product-card">
              <div className="card-image">
                <img src="/static/home/img/convertTxt.png" alt="Voice to Text" />
                <div className="card-overlay">
                  <i className="fas fa-microphone"></i>
                </div>
              </div>
              <div className="card-content">
                <h3>Voice to Text</h3>
                <p>Convert speech to text with high accuracy</p>
              </div>
            </a>

            <a href="/text-to-voice/" className="product-card">
              <div className="card-image">
                <img src="/static/home/img/convertSpeech.png" alt="Text to Voice" />
                <div className="card-overlay">
                  <i className="fas fa-volume-up"></i>
                </div>
              </div>
              <div className="card-content">
                <h3>Text to Speech</h3>
                <p>Convert text to natural-sounding speech</p>
              </div>
            </a>

            <div className="product-card product-card--maintenance">
              <div className="maintenance-badge">
                <i className="fas fa-tools"></i>
                <span>Under Maintenance</span>
              </div>
              <div className="card-image">
                <img src="/static/home/img/unnamed.png" alt="Make My Trip" />
                <div className="card-overlay">
                  <i className="fas fa-plane"></i>
                </div>
              </div>
              <div className="card-content">
                <h3>Make My Trip</h3>
                <p>AI-powered travel planning assistant</p>
              </div>
            </div>

            <div className="product-card product-card--maintenance">
              <div className="maintenance-badge">
                <i className="fas fa-tools"></i>
                <span>Under Maintenance</span>
              </div>
              <div className="card-image">
                <img src="/static/home/img/videoCaption.jpeg" alt="Video Caption" />
                <div className="card-overlay">
                  <i className="fas fa-video"></i>
                </div>
              </div>
              <div className="card-content">
                <h3>Video Caption</h3>
                <p>Add captions and translations to videos</p>
              </div>
            </div>

            <div className="product-card product-card--maintenance">
              <div className="maintenance-badge">
                <i className="fas fa-tools"></i>
                <span>Under Maintenance</span>
              </div>
              <div className="card-image">
                <img src="/static/home/img/removeImg.png" alt="Video Background Removal" />
                <div className="card-overlay">
                  <i className="fas fa-film"></i>
                </div>
              </div>
              <div className="card-content">
                <h3>Video Background</h3>
                <p>Remove background from videos seamlessly</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div id="container-sub" className="pricing-section">
        <div className="container">
          <div className="pricing-header">
            <h2>Choose Your Plan</h2>
            <p>Select the perfect plan for your needs</p>

            <div className="pricing-controls">
              <div className="billing-toggle">
                <div className="toggle-background" id="btns" style={{ left: billingCycle === 'month' ? '0' : '50%' }}></div>
                <button
                  type="button"
                  className={`toggle-btn ${billingCycle === 'month' ? 'active' : ''}`}
                  onClick={() => toggleBilling('month')}
                >
                  Monthly
                </button>
                <button
                  type="button"
                  className={`toggle-btn ${billingCycle === 'year' ? 'active' : ''}`}
                  onClick={() => toggleBilling('year')}
                >
                  Yearly
                </button>
              </div>

              <div className="currency-toggle">
                <button className="currency-btn" onClick={toggleCurrency}>
                  Switch to {currency === "USD" ? "EGP" : "USD"}
                </button>
              </div>
            </div>
          </div>

          <div className="pricing-cards">
            <div className="pricing-card premium">
              <div className="card-header">
                <div className="recommended-badge">
                  <i className="fas fa-star"></i>
                  <span>Recommended</span>
                  <i className="fas fa-star"></i>
                </div>

                <div className="plan-info">
                  <div className="plan-details">
                    <h3>ProPlus Plan</h3>
                    <p>For professionals</p>
                  </div>
                  <div className="pricing-info">
                    <span className="price">
                      {currency === "USD" ? (billingCycle === 'month' ? "$19.99" : "$199.99") : (billingCycle === 'month' ? "EGP 950" : "EGP 9500")}
                    </span>
                    <span className="duration">{billingCycle === 'month' ? "Monthly" : "Yearly"}</span>
                  </div>
                </div>
              </div>
              <div className="plan-features">
                 <ul>
                    <li><i className="fas fa-check"></i> Unlimited generations</li>
                    <li><i className="fas fa-check"></i> Priority support</li>
                    <li><i className="fas fa-check"></i> Early access to new features</li>
                 </ul>
              </div>
            </div>

            <div className="pricing-card basic">
              <div className="card-header">
                <div className="plan-info">
                  <div className="plan-details">
                    <h3>Pro Plan</h3>
                    <p>For teams</p>
                  </div>
                  <div className="pricing-info">
                    <span className="price">
                      {currency === "USD" ? (billingCycle === 'month' ? "$14.99" : "$149.99") : (billingCycle === 'month' ? "EGP 700" : "EGP 7000")}
                    </span>
                    <span className="duration">{billingCycle === 'month' ? "Monthly" : "Yearly"}</span>
                  </div>
                </div>
              </div>
              <div className="plan-features">
                 <ul>
                    <li><i className="fas fa-check"></i> 1000 generations</li>
                    <li><i className="fas fa-check"></i> Standard support</li>
                 </ul>
              </div>
            </div>

            <div className="pricing-card basic">
              <div className="card-header">
                <div className="plan-info">
                  <div className="plan-details">
                    <h3>Text to Voice</h3>
                    <p>For content creators</p>
                  </div>
                  <div className="pricing-info">
                    <span className="price">
                      {currency === "USD" ? (billingCycle === 'month' ? "$6.00" : "$60.00") : (billingCycle === 'month' ? "EGP 300" : "EGP 3000")}
                    </span>
                    <span className="duration">{billingCycle === 'month' ? "Monthly" : "Yearly"}</span>
                  </div>
                </div>
              </div>
              <div className="plan-features">
                 <ul>
                    <li><i className="fas fa-check"></i> Advanced TTS features</li>
                    <li><i className="fas fa-check"></i> 50 voices included</li>
                 </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div id="fourth" className="contact-section">
        <div className="container">
          <div className="contact-content">
            <div className="contact-info">
              <div className="section-header">
                <h2>Connect With Us</h2>
                <p>
                  For any questions or assistance you need, please don't hesitate to contact our support team. We're here to
                  help!
                </p>
              </div>

              <div className="contact-grid">
                <div className="contact-item">
                  <div className="contact-icon">
                    <i className="fas fa-envelope"></i>
                  </div>
                  <div className="contact-details">
                    <h4>Email</h4>
                    <p>support@nexmediaai.com</p>
                  </div>
                </div>

                <div className="contact-item">
                  <div className="contact-icon">
                    <i className="fab fa-telegram"></i>
                  </div>
                  <div className="contact-details">
                    <h4>Telegram</h4>
                    <a href="https://t.me/neaxai" target="_blank">
                      @neaxai
                    </a>
                  </div>
                </div>

                <div className="contact-item">
                  <div className="contact-icon">
                    <i className="fas fa-map-marker-alt"></i>
                  </div>
                  <div className="contact-details">
                    <h4>Location</h4>
                    <p>Cairo, Egypt</p>
                  </div>
                </div>

                <div className="contact-item">
                  <div className="contact-icon">
                    <i className="fas fa-phone"></i>
                  </div>
                  <div className="contact-details">
                    <h4>Phone</h4>
                    <p>+20 1553593868</p>
                  </div>
                </div>
              </div>

              <div className="social-links">
                <a href="https://www.facebook.com/share/1FkcDUXsG3/" className="social-link" target="_blank">
                  <i className="fab fa-facebook-f"></i>
                </a>
                <a href="https://www.tiktok.com/@nex.media.ai?_t=ZS-8zisE1KnRdS&_r=1" className="social-link" target="_blank">
                  <i className="fab fa-tiktok"></i>
                </a>
                <a href="https://t.me/neaxai" className="social-link" target="_blank">
                  <i className="fab fa-telegram-plane"></i>
                </a>
              </div>
            </div>

            <div className="contact-form-section">
              <div className="contact-form">
                <h3>Send us a Message</h3>
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    alert("Message sent!");
                  }}
                >
                  <div className="form-group">
                    <label htmlFor="contact-email">Email Address</label>
                    <input type="email" id="contact-email" name="email" placeholder="your@email.com" required />
                  </div>

                  <div className="form-group">
                    <label htmlFor="contact-message">Your Message</label>
                    <textarea
                      id="contact-message"
                      name="message"
                      placeholder="Tell us how we can help you..."
                      required
                    ></textarea>
                  </div>

                  <button type="submit" className="submit-btn">
                    <span>Send Message</span>
                    <i className="fas fa-paper-plane"></i>
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>

        <footer className="footer">
          <div className="footer-content">
            <div className="footer-links">
              <a href="/terms">Terms & Conditions</a>
              <span>&copy; 2026 NEX MEDIA AI. All rights reserved.</span>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}
