import React, { useState, useEffect } from "react";
import sliderImg from "../images/slider-bgecomm.jpg"; 
import "./slidersection.css";

const slides = [1, 2, 3]; // soft sliding illusion

const SliderSection = () => {
  const [current, setCurrent] = useState(0);

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
            <span>Sale 20% Off</span>
            <br />
            On Everything
          </h1>
          <p>
            Explicabo esse amet tempora quibusdam laudantium, laborum eaque
            magnam fugiat hic? Esse dicta aliquid error repudiandae earum
            suscipit fugiat molestias, veniam, vel architecto veritatis delectus
            repellat modi impedit sequi.
          </p>
          <a href="#" className="btn1">
            Shop Now
          </a>
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
