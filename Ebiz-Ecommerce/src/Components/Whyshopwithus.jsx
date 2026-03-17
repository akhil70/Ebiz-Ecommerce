import React from "react";
import "./whyshopwithus.css";

import truckIcon from "../images/truckicon.png";
import freeIcon from "../images/freeicon.png";
import qualityIcon from "../images/qualityicon.png";




const WhyShopWithUs = () => {
  return (
    <section className="why_section">
      <div className="container">
        <div className="heading_container heading_center">
          <h2>Why Shop With Us</h2>
          <div className="underline"></div>
        </div>

        <div className="row">

          {/* CARD 1 */}
          <div className="col-md-4">
            <div className="box">
              <div className="img-box">
                <img src={truckIcon} alt="Fast Delivery" className="icon-img" />
              </div>
              <div className="detail-boxs">
                <h5>Fast Delivery</h5>
                <p>Variations of passages of Lorem Ipsum available</p>
              </div>
            </div>
          </div>


          {/* CARD 2 */}
          <div className="col-md-4">
            <div className="box">
              <div className="img-box">
                <img src={freeIcon} alt="Free Shipping" className="icon-img" />
              </div>

              <div className="detail-boxs">
                <h5>Free Shipping</h5>
                <p>Variations of passages of Lorem Ipsum available</p>
              </div>
            </div>
          </div>

          {/* CARD 3 */}
          <div className="col-md-4">
            <div className="box">
              <div className="img-box">
                <img src={qualityIcon} alt="Best Quality" className="icon-img" />
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
