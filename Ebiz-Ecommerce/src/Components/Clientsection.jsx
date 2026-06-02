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
      <Quote className="bg_quote bg_quote_one" aria-hidden size={260} />
      <Quote className="bg_quote bg_quote_two" aria-hidden size={200} />

      <div className="container client_section_inner">
        <header className="client_heading">
          <span className="client_kicker">
            <span className="kicker_dot" /> Testimonials
          </span>
          <h2 id="testimonials-heading">
            Loved by <span className="gradient_text">customers</span> worldwide
          </h2>
          <p className="client_subtitle">
            Real stories from shoppers who trust TOTAL EBIZ LLC
          </p>

          <div className="rating_pill" aria-label="5 out of 5 rating">
            <div className="rating_stars">
              {[1, 2, 3, 4, 5].map((n) => (
                <Star key={n} size={16} fill="currentColor" strokeWidth={0} />
              ))}
            </div>
            <span className="rating_text">
              <strong>4.9</strong> / 5 · Trusted by happy customers
            </span>
          </div>
        </header>

        <article key={testimonial.id} className="testimonial_card fade">
          <aside className="card_left">
            <div className="left_glow" aria-hidden />
            <div className="avatar_ring">
              <img src={testimonial.img} alt="" />
              <span className="avatar_badge" aria-hidden>
                <Star size={12} fill="currentColor" strokeWidth={0} />
              </span>
            </div>
            <cite className="author_name">{testimonial.name}</cite>
            <span className="author_role">{testimonial.role}</span>
            <div className="left_stars" aria-label="5 stars">
              {[1, 2, 3, 4, 5].map((n) => (
                <Star key={n} size={14} fill="currentColor" strokeWidth={0} />
              ))}
            </div>
          </aside>

          <div className="card_right">
            <Quote className="quote_mark" size={48} strokeWidth={1.5} aria-hidden />
            <blockquote className="testimonial_quote">
              <p>{testimonial.text}</p>
            </blockquote>
          </div>
        </article>

        <div className="testimonial_controls">
          <button
            type="button"
            className="arrow_btn"
            onClick={goPrev}
            aria-label="Previous testimonial"
          >
            <ChevronLeft size={22} strokeWidth={2.25} />
          </button>

          <div
            className="thumb_nav"
            role="tablist"
            aria-label="Choose testimonial"
          >
            {testimonials.map((t, i) => (
              <button
                key={t.id}
                type="button"
                role="tab"
                aria-selected={i === slideIndex}
                aria-label={`Show testimonial from ${t.name}`}
                className={`thumb ${i === slideIndex ? "active" : ""}`}
                onClick={() => setSlideIndex(i)}
              >
                <img src={t.img} alt="" />
              </button>
            ))}
          </div>

          <button
            type="button"
            className="arrow_btn"
            onClick={goNext}
            aria-label="Next testimonial"
          >
            <ChevronRight size={22} strokeWidth={2.25} />
          </button>
        </div>

        <div className="progress_track" aria-hidden>
          <div
            className="progress_fill"
            style={{
              width: `${((slideIndex + 1) / testimonials.length) * 100}%`,
            }}
          />
        </div>
      </div>
    </section>
  );
};

export default ClientSection;
