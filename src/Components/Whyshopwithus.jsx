import React from "react";
import "./whyshopwithus.css";
import { FaTruck, FaShippingFast } from "react-icons/fa";
import { MdVerified } from "react-icons/md";

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
                <FaTruck className="icon" size={48} />
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
                <FaShippingFast className="icon" size={48} />
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
                <MdVerified className="icon" size={48} />
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