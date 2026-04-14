import React, { useState } from "react";
import { ChevronLeft, ChevronRight, Quote, Star } from "lucide-react";
import "./clientsection.css";
import clientImg from "../images/client.jpg";

const testimonials = [
  {
    id: 1,
    name: "Anna Trevor",
    role: "Verified customer",
    text: "I have ordered several times from TOTAL EBIZ LLC and every package arrived on time. The fabrics and finishes feel premium, and returns were straightforward when one item was not quite right. Highly recommend for anyone who shops online often.",
    img: clientImg,
  },
  {
    id: 2,
    name: "Mia Joseph",
    role: "Verified customer",
    text: "Great quality and fast shipping. The fit and feel were exactly what I expected, and the support team helped me quickly when I had a size question.",
    img: clientImg,
  },
  {
    id: 3,
    name: "Daniel Brooks",
    role: "Verified customer",
    text: "Very smooth shopping experience. Product images matched what I got, and the checkout flow was simple. I will definitely order again.",
    img: clientImg,
  },
];

const ClientSection = () => {
  const [slideIndex, setSlideIndex] = useState(0);

  const goPrev = () => {
    setSlideIndex(
      (prev) => (prev - 1 + testimonials.length) % testimonials.length
    );
  };

  const goNext = () => {
    setSlideIndex((prev) => (prev + 1) % testimonials.length);
  };

  const testimonial = testimonials[slideIndex];

  return (
    <section className="client_section" aria-labelledby="testimonials-heading">
      <div className="client_section_bg" aria-hidden />
      <div className="container client_section_inner">
        <header className="client_heading">
          <span className="client_kicker">Reviews</span>
          <h2 id="testimonials-heading">What our customers say</h2>
          <p className="client_subtitle">
            Real feedback from shoppers who love TOTAL EBIZ LLC
          </p>
          <div className="heading_underline" />
        </header>

        <div className="testimonial_layout">
          <button
            type="button"
            className="arrow_btn"
            onClick={goPrev}
            aria-label="Previous testimonial"
          >
            <ChevronLeft size={24} strokeWidth={2.25} />
          </button>

          <article
            key={testimonial.id}
            className="testimonial_card fade"
          >
            <div className="testimonial_card_top">
              <span className="quote_icon_wrap" aria-hidden>
                <Quote size={28} strokeWidth={1.5} />
              </span>
              <div className="stars_row" aria-label="5 out of 5 stars">
                {[1, 2, 3, 4, 5].map((n) => (
                  <Star
                    key={n}
                    size={18}
                    className="star_filled"
                    fill="currentColor"
                    strokeWidth={0}
                  />
                ))}
              </div>
            </div>

            <blockquote className="testimonial_quote">
              <p>{testimonial.text}</p>
            </blockquote>

            <footer className="testimonial_author">
              <div className="avatar_ring">
                <img src={testimonial.img} alt="" />
              </div>
              <div className="author_meta">
                <cite className="author_name" style={{color: 'white'}}>{testimonial.name}</cite>
                <span className="author_role">{testimonial.role}</span>
              </div>
            </footer>
          </article>

          <button
            type="button"
            className="arrow_btn"
            onClick={goNext}
            aria-label="Next testimonial"
          >
            <ChevronRight size={24} strokeWidth={2.25} />
          </button>
        </div>

        <div
          className="testimonial_dots"
          role="tablist"
          aria-label="Choose testimonial"
        >
          {testimonials.map((t, i) => (
            <button
              key={t.id}
              type="button"
              role="tab"
              aria-selected={i === slideIndex}
              aria-label={`Show testimonial ${i + 1}`}
              className={`dot ${i === slideIndex ? "active" : ""}`}
              onClick={() => setSlideIndex(i)}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default ClientSection;
