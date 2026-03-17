import React, { useState } from "react";
import "./clientsection.css";
import clientImg from "../images/client.jpg"; // adjust path if needed

const ClientSection = () => {
  const [slide, setSlide] = useState(false);

  const handleSlide = () => {
    setSlide((prev) => !prev);
  };

  const testimonial = {
    name: "Anna Trevor",
    role: "Customer",
    text: "Dignissimos reprehenderit repellendus nobis error quibusdam? Atque animi sint unde quis reprehenderit, et perspiciatis, debitis totam est deserunt eius officiis ipsum ducimus ad labore modi voluptatibus accusantium sapiente nam! Quaerat.",
    img: clientImg,
  };

  return (
    <section className="client_section">
      <div className="container">
        <div className="heading_container heading_center">
          <h2>Customer&apos;s Testimonial</h2>
          <div className="heading_underline"></div>
        </div>

        <div className="testimonial_wrapper">
          {/* Left arrow */}
          <button className="arrow_btn left" onClick={handleSlide}>
            <i className="fa fa-chevron-left" aria-hidden="true"></i>
          </button>

          {/* Testimonial content */}
          <div className={`testimonial_content ${slide ? "fade" : ""}`}>
            <div className="img_box">
              <img src={testimonial.img} alt={testimonial.name} />
            </div>
            <h5>{testimonial.name}</h5>
            <h6>{testimonial.role}</h6>
            <p>{testimonial.text}</p>
          </div>

          {/* Right arrow */}
          <button className="arrow_btn right" onClick={handleSlide}>
            <i className="fa fa-chevron-right" aria-hidden="true"></i>
          </button>
        </div>
      </div>
    </section>
  );
};

export default ClientSection;
