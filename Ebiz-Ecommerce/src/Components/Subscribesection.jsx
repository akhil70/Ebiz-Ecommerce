import React from "react";
import "./subscribesection.css";

const SubscribeSection = () => {
  return (
    <section className="subscribe_section">
      <div className="content_box">
        <div className="heading_container heading_center">
          <h3>Subscribe To Get Discount Offers</h3>
        </div>
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
        </p>
        <form className="form_box">
          <input
            type="email"
            placeholder="Enter your email"
            required
            className="email_input"
          />
          <button type="submit" className="subscribe_btn">
            Subscribe
          </button>
        </form>
      </div>
    </section>
  );
};

export default SubscribeSection;
