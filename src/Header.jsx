import React, { useState } from "react";
import "./style.css";
import { ShoppingCart, Search, Menu, X, LogIn, User, ClipboardList } from "lucide-react";
import loginIllustration from "./images/fammmlogo.png";
import signupProduct1 from "./images/p1.png";
import signupProduct2 from "./images/p2.png";
import signupProduct3 from "./images/p3.png";
import signupProduct4 from "./images/p6.png";

import { NavLink } from "react-router-dom";
import HomePage from "./Homepage";

export const Header = () => {
  const [activeLink, setActiveLink] = useState("home");
  const [menuOpen, setMenuOpen] = useState(false);
  const [isSignupOpen, setIsSignupOpen] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [generatedOtp, setGeneratedOtp] = useState("");
  const [otpInput, setOtpInput] = useState("");
  const [otpVerified, setOtpVerified] = useState(false);
  const [signupError, setSignupError] = useState("");

  const handleLinkClick = (link) => {
    setActiveLink(link);
    setMenuOpen(false);
  };

  const openSignup = () => {
    setIsSignupOpen(true);
    setPhoneNumber("");
    setOtpSent(false);
    setGeneratedOtp("");
    setOtpInput("");
    setOtpVerified(false);
    setSignupError("");
  };

  const closeSignup = () => {
    setIsSignupOpen(false);
  };

  const handleContinue = () => {
    const cleaned = phoneNumber.replace(/\D/g, "");
    if (cleaned.length !== 10) {
      setSignupError("Enter a valid 10-digit mobile number.");
      return;
    }

    setOtpSent(true);
    setOtpVerified(false);
    setOtpInput("");
    setSignupError("");
  };

  const handleVerify = () => {
    if (!otpSent) {
      setSignupError("Please request an OTP first.");
      return;
    }
    if (otpInput.trim() === generatedOtp) {
      setOtpVerified(true);
      setSignupError("");
    } else {
      setOtpVerified(false);
      setSignupError("Invalid OTP. Please try again.");
    }
  };

  const cleanedPhone = phoneNumber.replace(/\D/g, "");

  return (
    <header className="header_section">
      <div className="container-fluid">
        <nav className="navbar custom_nav-container">

          <a className="navbar-brand" href="#">
            <img
              src={loginIllustration}
              alt="Famms Logo"
              style={{ height: "40px", marginRight: "5px" }}
            />
          </a>


          <button
            className="navbar-toggler"
            type="button"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>


          <div
            className={`navbar-menu ${menuOpen ? "show" : ""}`}
            id="navbarSupportedContent"
          >
            <ul className="navbar-nav">
              {/* <li className="nav-item">
                <a
                  className={`nav-link ${activeLink === "home" ? "active" : ""}`}
                  href="#home"
                  onClick={() => handleLinkClick("home")}
                >
                  HOME
                </a>
              </li> */}
              <li className="nav-item">
                <NavLink
                  to="/"
                  className={`nav-link ${activeLink === "home" ? "active" : ""}`}
                  onClick={() => handleLinkClick("home")}
                >
                  HOME
                </NavLink>
              </li>


              <li className="nav-item dropdown">
                <a
                  className={`nav-link ${activeLink === "pages" ? "active" : ""
                    } dropdown-toggle`}
                  href="#pages"
                  onClick={() => handleLinkClick("pages")}
                >
                  PAGES
                </a>
                <ul className="dropdown-menu">
                  <li>
                    <a href="#about">About</a>
                  </li>
                  <li>
                    <a href="#testimonial">Testimonial</a>
                  </li>
                </ul>
              </li>

              <li className="nav-item">
                <a
                  className={`nav-link ${activeLink === "products" ? "active" : ""
                    }`}
                  href="#products"
                  onClick={() => handleLinkClick("products")}
                >
                  PRODUCTS
                </a>
              </li>

              <li className="nav-item">
                <a
                  className={`nav-link ${activeLink === "blog" ? "active" : ""}`}
                  href="#blog"
                  onClick={() => handleLinkClick("blog")}
                >
                  BLOG
                </a>
              </li>

              <li className="nav-item">
                <a
                  className={`nav-link ${activeLink === "contact" ? "active" : ""
                    }`}
                  href="#contact"
                  onClick={() => handleLinkClick("contact")}
                >
                  CONTACT
                </a>
              </li>


              <li className="nav-item">
                <div className="profile-nav-container">
                  <div className="nav-icon-group">
                    <User size={20} stroke="black" />
                    <span>Profile</span>
                  </div>

                  <div className="profile-popup">
                    <div className="popup-header">
                      <h3>Hello User</h3>
                      <p>To access your Ebizz account</p>
                    </div>
                    <button className="signup-btn" onClick={openSignup}>Sign Up</button>
                    <div className="popup-divider"></div>
                    <ul className="popup-menu">
                      <li>
                        <a href="/orders">
                          <ClipboardList size={18} />
                          My Orders
                        </a>
                      </li>
                    </ul>
                    <div className="popup-divider"></div>
                    <div className="popup-footer">
                      <a href="/delete-account" className="delete-link">Delete Account</a>
                    </div>
                  </div>
                </div>
              </li>

              <li className="nav-item">
                <a
                  className={`nav-link ${activeLink === "cart" ? "active" : ""}`}
                  href="/cart"
                  onClick={() => handleLinkClick("cart")}
                >
                  <div className="nav-icon-group">
                    <ShoppingCart size={20} fill="black" stroke="black" />
                    <span>Cart</span>
                  </div>
                </a>
              </li>
            </ul>
          </div>
        </nav>
      </div>

      {isSignupOpen && (
        <div className="signup-modal-overlay" onClick={closeSignup}>
          <div className="signup-modal" onClick={(event) => event.stopPropagation()}>
            <button className="signup-close" onClick={closeSignup} aria-label="Close sign up">
              <X size={18} />
            </button>
            <div className="signup-hero">
              <div className="signup-hero-cards">
                <div className="signup-card card-top">
                  <img src={signupProduct1} alt="Sarees" />
                
                </div>
                <div className="signup-card card-right">
                  <img src={signupProduct2} alt="Kurtis" />
                 
                </div>
                <div className="signup-card card-left">
                  <img src={signupProduct3} alt="Furniture" />
                 
                </div>
                <div className="signup-card card-bottom">
                  <img src={signupProduct4} alt="Menswear" />
                
                </div>
              </div>
              <div className="signup-hero-text">
                <h2>Great Quality</h2>
                <p>Lowest prices</p>
              </div>
            </div>

            <div className="signup-body">
              <h3>Sign Up to view your profile</h3>
              <div className="signup-fields">
                <div className="country-code">
                  <span>Country</span>
                  <strong>IN +91</strong>
                </div>
                <div className="phone-input">
                  <label htmlFor="signup-phone">Phone Number</label>
                  <input
                    id="signup-phone"
                    type="tel"
                    inputMode="numeric"
                    value={phoneNumber}
                    onChange={(event) => setPhoneNumber(event.target.value)}
                    placeholder="Enter mobile number"
                  />
                </div>
              </div>

              <button className="signup-continue" onClick={handleContinue}>
                {otpSent ? "Resend OTP" : "Continue"}
              </button>

              {signupError && <p className="signup-error">{signupError}</p>}

              {otpSent && (
                <div className="otp-section">
                  <label htmlFor="signup-otp">Enter OTP</label>
                  <div className="otp-row">
                    <input
                      id="signup-otp"
                      type="text"
                      inputMode="numeric"
                      maxLength={6}
                      value={otpInput}
                      onChange={(event) => setOtpInput(event.target.value)}
                      placeholder="6-digit OTP"
                    />
                    <button className="otp-verify" onClick={handleVerify}>
                      Verify
                    </button>
                  </div>
                  <p className="otp-helper">
                    OTP sent to +91 {cleanedPhone}.
                  </p>
                </div>
              )}

              {otpVerified && <p className="signup-success">OTP verified successfully.</p>}

              <p className="signup-terms">
                By continuing, you agree to Ebizz's Terms &amp; Conditions and Privacy Policy.
              </p>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
