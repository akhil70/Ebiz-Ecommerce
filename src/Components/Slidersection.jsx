import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import sliderImg from "../images/slider-bgecomm.jpg"; 
import "./slidersection.css";

const slides = [
  {
    badge: "Sale 20% Off",
    title: "On Everything",
    description:
      "Refresh your wardrobe for less. Hand-picked styles across clothing, footwear, and accessories—same quality you love, prices you will notice at checkout.",
    to: "/shop",
    cta: "Shop Now",
  },
  {
    badge: "New Arrivals",
    title: "Just Landed",
    description:
      "Discover this season’s latest drops before they sell out. Trend-led pieces, everyday essentials, and statement finds—curated for you and updated weekly.",
    to: "/shop?isNewArrival=true",
    cta: "Explore New In",
  },
  {
    badge: "Free Shipping",
    title: "On Orders Over ₹999",
    description:
      "Shop with confidence: easy returns, secure checkout, and reliable delivery. Stock up on favorites or try something new—your order is in good hands.",
    to: "/shop",
    cta: "Start Shopping",
  },
];

const SliderSection = () => {
  const [current, setCurrent] = useState(0);
  const slide = slides[current];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="slider_section">
      {/* FULL IMAGE BACKGROUND (sharp & full quality) */}
      <div className="slider_bg_box">
        <img src={sliderImg} alt="Slider Background" />
      </div>

      {/* Light overlay */}
      <div className="overlay"></div>

      {/* Content */}
      <div className="content_wrapper">
        <div key={current} className="detail_box slide_effect">
          <h1>
            <span>{slide.badge}</span>
            <br />
            {slide.title}
          </h1>
          <p>{slide.description}</p>
          <Link to={slide.to} className="btn1">
            {slide.cta}
          </Link>
        </div>

        {/* Dots */}
        <div className="carousel_indicators">
          {slides.map((_, i) => (
            <span
              key={i}
              className={`dot ${i === current ? "active" : ""}`}
              onClick={() => setCurrent(i)}
            ></span>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SliderSection;
