import React, { useState } from "react";
import "./style.css";
import { ShoppingCart, Search, Menu, X, LogIn, User, ClipboardList } from "lucide-react";
import loginIllustration from "./images/fammmlogo.png";

import { NavLink } from "react-router-dom";
import HomePage from "./Homepage";

export const Header = () => {
  const [activeLink, setActiveLink] = useState("home");
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLinkClick = (link) => {
    setActiveLink(link);
    setMenuOpen(false);
  };

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
                    <button className="signup-btn">Sign Up</button>
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
    </header>
  );
};
