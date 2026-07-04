import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import sliderImg from "../images/slider-img-new.png";
import "./slidersection.css";

const bgGradient = "linear-gradient(135deg, #a855f7 0%, #ec4899 50%, #f59e0b 100%)";

const slides = [
  {
    price: "From $49.90",
    title: "Summer Collection",
    subtitle: "2024",
    description:
      "Discover this season’s hottest trends. Premium quality clothing designed for style and comfort.",
    to: "/shop",
    cta: "Shop Now",
  },
  {
    price: "From $39.99",
    title: "Spring Vibes",
    subtitle: "2024",
    description:
      "Fresh styles for the new season. Comfortable and trendy pieces for every occasion.",
    to: "/shop?isNewArrival=true",
    cta: "Explore Collection",
  },
  {
    price: "From $59.99",
    title: "Winter Warmth",
    subtitle: "2024",
    description:
      "Stay cozy and stylish. Premium collection designed for comfort in cold weather.",
    to: "/shop",
    cta: "Discover More",
  },
];

const SliderSection = () => {
  const [current, setCurrent] = useState(0);
  const slide = slides[current];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="slider_section" style={{ background: bgGradient }}>
      <div className="slider_container">
        {/* Left Image */}
        <div className="slider_image_side slide_effect">
          <div className="image_frame">
            <img src={sliderImg} alt={slide.title} className="slider_product_img" />
          </div>
        </div>

        {/* Right Content */}
        <div className="slider_content_side slide_effect">
          <div className="content_box">
            <p className="price_label">{slide.price}</p>
            <h1 className="slider_title">{slide.title}</h1>
            <p className="slider_description">{slide.description}</p>
            <Link to={slide.to} className="btn1">
              {slide.cta}
            </Link>
          </div>
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
