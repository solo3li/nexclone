"use client";

import Link from "next/link";

export default function Sidebar({ isOpen }: { isOpen: boolean }) {
  return (
    <div className={`sidebar ${isOpen ? "open" : ""}`} id="sidebar">
      <div className="sidebar-header">
        <div className="slide-profile">
          <img className="profile-circle" src="/static/img/avatar.jpg" alt="Profile Image" />
          <span className="username">Guest</span>
          <div className="subscription-status">
            <div className="status-badge inactive">
              <i className="fas fa-times-circle"></i>
              <span>Free Plan</span>
            </div>
          </div>
        </div>
      </div>

      <div className="sidebar-nav">
        <Link href="/#container-sub" className="nav-link upgrade">
          <i className="fas fa-rocket"></i>
          Subscribe Now
        </Link>
        <Link href="/history" className="nav-link">
          <i className="fas fa-history"></i>
          History
        </Link>
        <Link href="/profile" className="nav-link">
          <i className="fas fa-user"></i>
          Profile
        </Link>
        <Link href="/#fourth" className="nav-link">
          <i className="fas fa-info-circle"></i>
          About Us
        </Link>
        <Link href="/#fourth" className="nav-link">
          <i className="fas fa-envelope"></i>
          Contact
        </Link>
        <div className="sidebar-lang-switcher">
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
    </div>
  );
}
