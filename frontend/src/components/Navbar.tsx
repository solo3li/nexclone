"use client";

import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="navbar">
      <div className="nav-container">
        <Link href="/" className="logo">
          <img src="/static/home/img/logo.png" alt="AI Studio Logo" />
        </Link>

        <div className="nav-menu">
          <div className="nav-item">
            <Link href="/profile">Profile</Link>
          </div>
          <div className="nav-item dropdown" id="product-menu">
            <a href="#" className="dropdown-toggle" onClick={(e) => e.preventDefault()}>
              Products
              <i className="fas fa-chevron-down" id="dropdown-icon"></i>
            </a>
            <div className="dropdown-menu" id="dropdown-menu">
              <Link href="/voice-to-text/" className="dropdown-item">
                <i className="fas fa-microphone"></i>
                Voice to Text
              </Link>
              <Link href="/text-to-voice/" className="dropdown-item">
                <i className="fas fa-volume-up"></i>
                Text to Speech
              </Link>
              <span className="dropdown-item maintenance-item">
                <i className="fas fa-plane"></i>
                Make My Trip
                <span className="maintenance-tag">
                  <i className="fas fa-tools"></i> Maintenance
                </span>
              </span>
              <span className="dropdown-item maintenance-item">
                <i className="fas fa-video"></i>
                Video Caption
                <span className="maintenance-tag">
                  <i className="fas fa-tools"></i> Maintenance
                </span>
              </span>
              <span className="dropdown-item maintenance-item">
                <i className="fas fa-film"></i>
                Video BG Remover
                <span className="maintenance-tag">
                  <i className="fas fa-tools"></i> Maintenance
                </span>
              </span>
            </div>
          </div>
          <div className="nav-item">
            <Link href="/#fourth">Help</Link>
          </div>
          <div className="nav-item">
            <Link href="/history">History</Link>
          </div>
          <div className="nav-item subscription-status">
            <Link href="/#container-sub" className="upgrade-btn">
              <i className="fas fa-bolt"></i>
              Upgrade
            </Link>
          </div>
        </div>

        <div className="profile-section">
          <span className="username">Guest</span>
          <img src="/static/img/avatar.jpg" alt="Profile Image" className="profile-img" />
          <div className="lang-switcher">
            <button className="lang-btn" title="Switch Language" aria-label="Switch Language">
              <span className="lang-globe">
                <i className="fas fa-globe"></i>
              </span>
              <span className="lang-current">EN</span>
              <i className="fas fa-chevron-down lang-arrow"></i>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
