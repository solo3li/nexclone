"use client";

import Link from "next/link";
import { useAuthStore } from "../store/useAuthStore";

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuthStore();

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
            </div>
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

        <div className="profile-section" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          {isAuthenticated ? (
            <>
              <span className="username font-bold text-sm truncate max-w-[150px]">{user?.email}</span>
              <img src="/static/img/avatar.jpg" alt="Profile Image" className="profile-img" style={{ width: '40px', borderRadius: '50%' }} />
              <button 
                onClick={() => {
                  logout();
                  window.location.href = "/login";
                }}
                className="bento-btn px-4 py-2 rounded-xl bg-red-500/10 text-red-500 hover:bg-red-500/20 transition-all font-bold text-xs"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className="bento-btn px-4 py-2 rounded-xl font-bold text-sm">Log in</Link>
              <Link href="/register" className="bento-btn-primary px-4 py-2 rounded-xl font-bold text-sm">Sign up</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
