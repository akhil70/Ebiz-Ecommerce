import React from "react";
import "./whyshopwithus.css";

const WhyShopWithUs = () => {
  return (
    <section className="why_section">
      <div className="container">
        <div className="heading_container heading_center">
          <h2>Why Shop With Us</h2>
          <div className="underline"></div>
        </div>

        <div className="row">
          {/* Card 1 */}
          <div className="col-md-4">
            <div className="box">
              <div className="img-box">
                {/* Truck Icon */}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="icon"
                >
                  <path d="M3 3h15v13H3z" />
                  <path d="M18 8h4v8h-4z" />
                  <circle cx="7.5" cy="16.5" r="1.5" />
                  <circle cx="17.5" cy="16.5" r="1.5" />
                </svg>
              </div>
              <div className="detail-boxs">
                <h5>Fast Delivery</h5>
                <p>Variations of passages of Lorem Ipsum available</p>
              </div>
            </div>
          </div>

          {/* Card 2 */}
          <div className="col-md-4">
            <div className="box">
              <div className="img-box">
                {/* Free Icon */}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="icon"
                >
                  <circle cx="12" cy="12" r="10" />
                  <text
                    x="12"
                    y="16"
                    textAnchor="middle"
                    fontSize="8"
                    fill="white"
                  >
                    FREE
                  </text>
                </svg>
              </div>
              <div className="detail-boxs">
                <h5>Free Shipping</h5>
                <p>Variations of passages of Lorem Ipsum available</p>
              </div>
            </div>
          </div>

          {/* Card 3 */}
          <div className="col-md-4">
            <div className="box">
              <div className="img-box">
                {/* Quality Icon */}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="2"
                  stroke="currentColor"
                  className="icon"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 12l2 2l4 -4m-9 9a9 9 0 1 1 18 0a9 9 0 0 1 -18 0z"
                  />
                </svg>
              </div>
              <div className="detail-boxs">
                <h5>Best Quality</h5>
                <p>Variations of passages of Lorem Ipsum available</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhyShopWithUs;
