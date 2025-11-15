import React from "react";
import "./arrivalsection.css";
import arrivalImg from "../images/arrival-bg.png"; // adjust path

const ArrivalSection = () => {
  return (
    <section className="arrival_section">
      <div className="arrival_container">
        <div className="arrival_img">
          <img src={arrivalImg} alt="New Arrivals" />
        </div>

        <div className="arrival_content">
          <h2>#NewArrivals</h2>
          <p>
            Vitae fugiat laboriosam officia perferendis provident aliquid
            voluptatibus dolorem, fugit ullam sit earum id eaque nisi hic?
            Tenetur commodi, nisi rem vel, ea eaque ab ipsa, autem similique ex
            unde!
          </p>
          <a href="#" className="arrival_btn">
            Shop Now
          </a>
        </div>
      </div>
    </section>
  );
};

export default ArrivalSection;
