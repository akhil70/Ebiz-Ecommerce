import React, { useState, useEffect } from 'react';
import { PublicAPI } from '../Utils/AxiosConfig';
import './BrandSection.css';

const BrandSection = () => {
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBrands = async () => {
      try {
        setLoading(true);
        const response = await PublicAPI.get('/brands');
        setBrands(response.data || []);
      } catch (error) {
        console.error("Error fetching brands:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchBrands();
  }, []);

  if (loading) {
    return (
      <div className="brand-section-loading">
        <div className="loading-spinner"></div>
        <p>Discovering premium brands...</p>
      </div>
    );
  }

  if (brands.length === 0) {
    return null; // Don't render if there are no brands
  }

  return (
    <section className="brand-showcase-section">
      <div className="section-container">
        <div className="section-header">
          <span className="subtitle">Premium Partners</span>
          <h2 className="title">Shop by Brand</h2>
          <div className="title-underline"></div>
        </div>

        <div className="brands-grid">
          {brands.map((brand, index) => (
            <div
              key={brand.id || index}
              className="brand-card"
              style={{ '--animation-delay': `${index * 0.1}s` }}
            >
              <div className="brand-logo-container">
                {brand.logo ? (
                  <img src={brand.logo} alt={brand.name} className="brand-logo-img" />
                ) : (
                  <div className="brand-logo-fallback">
                    <span className="brand-initials">
                      {brand.name ? brand.name.substring(0, 2).toUpperCase() : 'B'}
                    </span>
                  </div>
                )}
              </div>
              <div className="brand-info">
                <h3 className="brand-name">{brand.name}</h3>
                {brand.description && <p className="brand-description">{brand.description}</p>}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BrandSection;
