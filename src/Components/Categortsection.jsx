import React from "react";
import "./categorysection.css";

import p1 from "../images/p1.png";
import p2 from "../images/p2.png";
import p3 from "../images/p3.png";
import p4 from "../images/p4.png";
import p5 from "../images/p5.png";
import p6 from "../images/p6.png";
import p7 from "../images/p7.png";
import p8 from "../images/p8.png";
import p9 from "../images/p9.png";
import p10 from "../images/p10.png";
import p11 from "../images/p11.png";
import p12 from "../images/p12.png";

const products = [
  { id: 1, name: "Men's Shirt", price: "$75", img: p1 },
  { id: 2, name: "Men's Shirt", price: "$80", img: p2 },
  { id: 3, name: "Women's Dress", price: "$68", img: p3 },
  { id: 4, name: "Women's Dress", price: "$70", img: p4 },
  { id: 5, name: "Women's Dress", price: "$75", img: p5 },
  { id: 6, name: "Women's Dress", price: "$58", img: p6 },
  { id: 7, name: "Women's Dress", price: "$80", img: p7 },
  { id: 8, name: "Men's Shirt", price: "$65", img: p8 },
  { id: 9, name: "Men's Shirt", price: "$65", img: p9 },
  { id: 10, name: "Men's Shirt", price: "$65", img: p10 },
  { id: 11, name: "Men's Shirt", price: "$65", img: p11 },
  { id: 12, name: "Women's Dress", price: "$65", img: p12 },
];

const CategorySection = () => {
  return (
    <section className="product_section layout_padding">
      <div className="container">
        <div className="heading_container heading_center">
          <h2>
            Our <span>Products</span>
             <div className="heading_underline"></div>
          </h2>
        </div>

        <div className="row">
          {products.map((product) => (
            <div key={product.id} className="col-sm-6 col-md-4 col-lg-4">
              <div className="box">
                <div className="option_container">
                  <div className="options">
                    <a href="#" className="option1">Add To Cart</a>
                    <a href="#" className="option2">Buy Now</a>
                  </div>
                </div>

                <div className="img-box">
                  <img src={product.img} alt={product.name} />
                </div>

                <div className="detail-box">
                  <h5>{product.name}</h5>
                  <h6>{product.price}</h6>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="btn-box">
          <a href="#">View All Products</a>
        </div>
      </div>
    </section>
  );
};

export default CategorySection;
