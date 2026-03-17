import React from "react";
import "./footer.css";
import logo from "../images/fammmlogo.png";

const Footer = () => {
  return (
    <footer className="footer_section">
      <div className="container">
        <div className="row">
          {/* Logo & Contact Info */}
          <div className="col-md-4">
            <div className="full">
              <div className="logo_footer">
                <a href="#"><img src={logo} alt="Logo" width="210" /></a>
              </div>
              <div className="information_f">
                <p><strong>ADDRESS:</strong> 28 White tower, Street Name New York City, USA</p>
                <p><strong>TELEPHONE:</strong> +91 987 654 3210</p>
                <p><strong>EMAIL:</strong> yourmain@gmail.com</p>
              </div>
            </div>
          </div>

          {/* Menu & Newsletter */}
          <div className="col-md-8">
            <div className="row">
              {/* Menus */}
              <div className="col-md-7">
                <div className="row">
                  <div className="col-md-6">
                    <div className="widget_menu">
                      <h3>Menu</h3>
                      <ul>
                        <li><a href="#">Home</a></li>
                        <li><a href="#">About</a></li>
                        <li><a href="#">Services</a></li>
                        <li><a href="#">Testimonial</a></li>
                        <li><a href="#">Blog</a></li>
                        <li><a href="#">Contact</a></li>
                      </ul>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="widget_menu">
                      <h3>Account</h3>
                      <ul>
                        <li><a href="#">Account</a></li>
                        <li><a href="#">Checkout</a></li>
                        <li><a href="#">Login</a></li>
                        <li><a href="#">Register</a></li>
                        <li><a href="#">Shopping</a></li>
                        <li><a href="#">Widget</a></li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              {/* Newsletter */}
              <div className="col-md-5">
                <div className="widget_menu">
                  <h3>Newsletter</h3>
                  <div className="information_f">
                    <p>Subscribe by our newsletter and get update protidin.</p>
                  </div>
                  <div className="form_sub">
                    <form>
                      {/* <fieldset> */}
                        <div className="field">
                          <input type="email" placeholder="Enter Your Email" name="email" />
                          <input type="submit" value="Subscribe" />
                        </div>
                      {/* </fieldset> */}
                    </form>
                  </div>

                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
