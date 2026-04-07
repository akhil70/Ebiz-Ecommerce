import React, { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import "./clientsection.css";
import clientImg from "../images/client.jpg";

const testimonials = [
  {
    id: 1,
    name: "Anna Trevor",
    role: "Customer",
    text: "Dignissimos reprehenderit repellendus nobis error quibusdam? Atque animi sint unde quis reprehenderit, et perspiciatis, debitis totam est deserunt eius officiis ipsum ducimus ad labore modi voluptatibus accusantium sapiente nam! Quaerat.",
    img: clientImg,
  },
  {
    id: 2,
    name: "Mia Joseph",
    role: "Customer",
    text: "Great quality and fast shipping. The fit and feel were exactly what I expected, and the support team helped me quickly when I had a size question.",
    img: clientImg,
  },
  {
    id: 3,
    name: "Daniel Brooks",
    role: "Customer",
    text: "Very smooth shopping experience. Product images matched what I got, and the checkout flow was simple. I will definitely order again.",
    img: clientImg,
  },
];

const ClientSection = () => {
  const [slideIndex, setSlideIndex] = useState(0);

  const goPrev = () => {
    setSlideIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const goNext = () => {
    setSlideIndex((prev) => (prev + 1) % testimonials.length);
  };

  const testimonial = testimonials[slideIndex];

  return (
    <section className="client_section">
      <div className="container">
        <div className="heading_container heading_center">
          <h2>Customer&apos;s Testimonial</h2>
          <div className="heading_underline"></div>
        </div>

        <div className="testimonial_wrapper">
          <button className="arrow_btn left" onClick={goPrev} aria-label="Previous testimonial">
            <ChevronLeft size={22} />
          </button>

          <div key={testimonial.id} className="testimonial_content fade">
            <div className="img_box">
              <img src={testimonial.img} alt={testimonial.name} />
            </div>
            <h5>{testimonial.name}</h5>
            <h6>{testimonial.role}</h6>
            <p>{testimonial.text}</p>
          </div>

          <button className="arrow_btn right" onClick={goNext} aria-label="Next testimonial">
            <ChevronRight size={22} />
          </button>
        </div>
      </div>
    </section>
  );
};

export default ClientSection;
