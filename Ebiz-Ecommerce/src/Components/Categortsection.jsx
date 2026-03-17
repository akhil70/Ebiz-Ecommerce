import React, { useState, useEffect } from "react";
import "./categorysection.css";
import { Link } from "react-router-dom";
import API from "../Utils/AxiosConfig";

const CategorySection = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const response = await API.get('/categories');
        const data = Array.isArray(response.data) ? response.data : response.data?.data ?? [];
        setCategories(data);
      } catch (error) {
        console.error("Error fetching categories:", error);
        setCategories([]);
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  return (
    <section className="product_section layout_padding">
      <div className="container">
        <div className="heading_container heading_center">
          <h2>
            Our <span>Categories</span>
            <div className="heading_underline"></div>
          </h2>
        </div>

        <div className="product_grid">
          {loading ? (
            <p style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '40px', color: '#666' }}>Loading categories...</p>
          ) : categories.length === 0 ? (
            <p style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '40px', color: '#666' }}>No categories available</p>
          ) : (
            categories.map((category) => (
              <div key={category.id} className="product_card">
                <div className="option_container">
                  <div className="options">
                    <Link to={`/shop?categoryId=${category.id}`} className="option1">Shop Now</Link>
                    <Link to={`/shop?categoryId=${category.id}`} className="option2">View Products</Link>
                  </div>
                </div>

                <div className="img-boxs">
                  <img
                    src={category.image || "https://via.placeholder.com/150?text=Category"}
                    alt={category.name}
                    onError={(e) => { e.target.src = "https://via.placeholder.com/150?text=Category"; }}
                  />
                </div>

                <div className="detail-box">
                  <h5>{category.name}</h5>
                  <Link to={`/shop?categoryId=${category.id}`} className="category-shop-link">Shop →</Link>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="btn-box">
          <Link to="/shop">View All Products</Link>
        </div>
      </div>
    </section>
  );
};

export default CategorySection;
