import React, { useState } from "react";
import "./style.css";
import { ShoppingCart, Search, Menu, X, LogIn, User, ClipboardList, Eye, EyeOff } from "lucide-react";
import signupProduct1 from "./images/p1.png";
import signupProduct2 from "./images/p2.png";
import signupProduct3 from "./images/p3.png";
import signupProduct4 from "./images/p6.png";

import { NavLink } from "react-router-dom";
import HomePage from "./Homepage";
import { PublicAPI } from "./Utils/AxiosConfig";
import { useDispatch } from "react-redux";
import { setAuth } from "./store/authSlice";

const loginIllustration = "/Logo.png";

export const Header = () => {
  const dispatch = useDispatch();
  const [activeLink, setActiveLink] = useState("home");
  const [menuOpen, setMenuOpen] = useState(false);
  const [isSignupOpen, setIsSignupOpen] = useState(false);
  const [isLoginMode, setIsLoginMode] = useState(false);
  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");
  const [password, setPassword] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otpInput, setOtpInput] = useState("");
  const [otpVerified, setOtpVerified] = useState(false);
  const [signupError, setSignupError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loginUsername, setLoginUsername] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [loginSuccess, setLoginSuccess] = useState(false);
  const [isLoginSubmitting, setIsLoginSubmitting] = useState(false);
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [showSignupPassword, setShowSignupPassword] = useState(false);

  const SEND_OTP_URL = "auth/signup/send-otp";
  const VERIFY_SIGNUP_URL = "auth/signup/verify-otp";
  const LOGIN_URL = "auth/login";

  const handleLinkClick = (link) => {
    setActiveLink(link);
    setMenuOpen(false);
  };

  const openSignup = () => {
    setIsSignupOpen(true);
    setIsLoginMode(false);
    setEmail("");
    setFullName("");
    setPassword("");
    setOtpSent(false);
    setOtpInput("");
    setOtpVerified(false);
    setSignupError("");
    setIsSubmitting(false);
    setLoginUsername("");
    setLoginPassword("");
    setLoginError("");
    setLoginSuccess(false);
    setIsLoginSubmitting(false);
    setShowLoginPassword(false);
    setShowSignupPassword(false);
  };

  const closeSignup = () => {
    setIsSignupOpen(false);
  };

  const handleContinue = async () => {
    if (!email.trim()) {
      setSignupError("Enter your email address.");
      return;
    }

    setIsSubmitting(true);
    setSignupError("");

    try {
      await PublicAPI.post(SEND_OTP_URL, { email: email.trim() });

      setOtpSent(true);
      setOtpVerified(false);
      setOtpInput("");
    } catch (error) {
      setSignupError(error?.message || "Unable to send OTP.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleVerify = async () => {
    if (!otpSent) {
      setSignupError("Please request an OTP first.");
      return;
    }
    if (!otpInput.trim()) {
      setSignupError("Enter the OTP sent to your email.");
      return;
    }
    if (!fullName.trim()) {
      setSignupError("Enter your name.");
      return;
    }
    if (!password.trim()) {
      setSignupError("Enter a password.");
      return;
    }

    setIsSubmitting(true);
    setSignupError("");

    try {
      await PublicAPI.post(VERIFY_SIGNUP_URL, {
        email: email.trim(),
        otp: otpInput.trim(),
        password: password.trim(),
        name: fullName.trim(),
        role: "user",
      });

      setOtpVerified(true);
    } catch (error) {
      setOtpVerified(false);
      setSignupError(error?.message || "Invalid OTP. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLogin = async () => {
    if (!loginUsername.trim()) {
      setLoginError("Enter your username.");
      return;
    }
    if (!loginPassword.trim()) {
      setLoginError("Enter your password.");
      return;
    }

    setIsLoginSubmitting(true);
    setLoginError("");

    try {
      const response = await PublicAPI.post(LOGIN_URL, {
        username: loginUsername.trim(),
        password: loginPassword.trim(),
      });

      const data = response?.data || {};
      const token =
        data.access_token ||
        data.token ||
        data.accessToken ||
        data.authToken ||
        data.jwtToken ||
        data.jwt ||
        data.data?.access_token ||
        data.data?.token ||
        data.data?.accessToken ||
        "";

      if (!token) {
        setLoginSuccess(false);
        setLoginError("Login succeeded but token was not returned.");
        return;
      }

      const user =
        data.user ||
        data.data?.user ||
        {
          username: data.preferred_username || loginUsername.trim(),
          email: data.email || "",
          name: data.name || "",
          role: data.role || data.data?.role || "",
        };

      localStorage.setItem("token", token);
      localStorage.setItem("authToken", token);
      localStorage.setItem("accessToken", token);
      localStorage.setItem("refreshToken", data.refresh_token || data.refreshToken || "");
      localStorage.setItem("tokenType", data.token_type || data.tokenType || "Bearer");
      localStorage.setItem("expiresIn", String(data.expires_in || data.expiresIn || ""));
      localStorage.setItem("user", JSON.stringify(user));

      dispatch(
        setAuth({
          user,
          token,
        })
      );

      setLoginSuccess(true);
      closeSignup();
    } catch (error) {
      setLoginSuccess(false);
      const message =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        error?.message ||
        "Login failed. Please try again.";
      setLoginError(message);
    } finally {
      setIsLoginSubmitting(false);
    }
  };

  return (
    <header className="header_section">
      <div className="container-fluid">
        <nav className="navbar custom_nav-container">

          <a className="navbar-brand" href="#">
            <img
              src={loginIllustration}
              alt="TOTAL EBIZ LLC"
              style={{ height: "40px", marginRight: "8px" }}
            />
            <span className="brand-text">TOTAL EBIZ LLC</span>
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
              {isLoginMode ? (
                <>
                  <h3>Log In to view your profile</h3>
                  <div className="phone-input">
                    <label htmlFor="login-username">Username</label>
                    <input
                      id="login-username"
                      type="text"
                      value={loginUsername}
                      onChange={(event) => setLoginUsername(event.target.value)}
                      placeholder="Enter username"
                    />
                  </div>
                  <div className="phone-input" style={{ marginTop: "10px" }}>
                    <label htmlFor="login-password">Password</label>
                    <div className="password-field">
                      <input
                        id="login-password"
                        type={showLoginPassword ? "text" : "password"}
                        value={loginPassword}
                        onChange={(event) => setLoginPassword(event.target.value)}
                        placeholder="Enter password"
                      />
                      <button
                        type="button"
                        className="password-toggle"
                        onClick={() => setShowLoginPassword((prev) => !prev)}
                        aria-label={showLoginPassword ? "Hide password" : "Show password"}
                      >
                        {showLoginPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                  </div>

                  <button className="signup-continue" onClick={handleLogin} disabled={isLoginSubmitting}>
                    {isLoginSubmitting ? "Logging in..." : "Login"}
                  </button>

                  {loginError && <p className="signup-error">{loginError}</p>}
                  {loginSuccess && <p className="signup-success">Login successful.</p>}

                  <p className="signup-login-hint">
                    Don't have an account?{" "}
                    <button
                      type="button"
                      className="signup-login-hint-btn"
                      onClick={() => setIsLoginMode(false)}
                    >
                      Sign up
                    </button>
                  </p>
                </>
              ) : (
                <>
                  <h3>Sign Up to view your profile</h3>
                  <div className="phone-input">
                    <label htmlFor="signup-email">Email</label>
                    <input
                      id="signup-email"
                      type="email"
                      value={email}
                      onChange={(event) => setEmail(event.target.value)}
                      placeholder="Enter email address"
                    />
                  </div>

                  <button className="signup-continue" onClick={handleContinue} disabled={isSubmitting}>
                    {isSubmitting ? "Sending..." : otpSent ? "Resend OTP" : "Continue"}
                  </button>
                  <p className="signup-login-hint">
                    Already have an account?{" "}
                    <button
                      type="button"
                      className="signup-login-hint-btn"
                      onClick={() => setIsLoginMode(true)}
                    >
                      Try to login
                    </button>
                  </p>

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
                        <button className="otp-verify" onClick={handleVerify} disabled={isSubmitting}>
                          {isSubmitting ? "Verifying..." : "Verify"}
                        </button>
                      </div>
                      <p className="otp-helper">
                        OTP sent to {email}.
                      </p>
                      <div className="otp-row" style={{ marginTop: "12px" }}>
                        <input
                          id="signup-name"
                          type="text"
                          value={fullName}
                          onChange={(event) => setFullName(event.target.value)}
                          placeholder="Full name"
                        />
                      </div>
                      <div className="otp-row" style={{ marginTop: "10px" }}>
                        <div className="password-field">
                          <input
                            id="signup-password"
                            type={showSignupPassword ? "text" : "password"}
                            value={password}
                            onChange={(event) => setPassword(event.target.value)}
                            placeholder="Create password"
                          />
                          <button
                            type="button"
                            className="password-toggle"
                            onClick={() => setShowSignupPassword((prev) => !prev)}
                            aria-label={showSignupPassword ? "Hide password" : "Show password"}
                          >
                            {showSignupPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  {otpVerified && <p className="signup-success">OTP verified successfully.</p>}

                  <p className="signup-terms">
                    By continuing, you agree to Ebizz's Terms &amp; Conditions and Privacy Policy.
                  </p>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
