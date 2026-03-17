import './ProductCollections.css';

export default function ProductCollections() {
  return (
    <div className="collections-container">
      {/* Large Left Card */}
      <div className="collection-card large-card">
        <div className="card-content">
          <p className="collection-label">CASUAL COLLECTION</p>
          <h2 className="collection-title">
            Street<br />Wear.
          </h2>
          <p className="collection-description">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Dignissim massa diam elementum.
          </p>
          <a href="#" className="shop-link">
            Shop Collection →
          </a>
        </div>
      </div>

      {/* Right Column with Two Cards */}
      <div className="right-column">
        {/* Top Right Card */}
        <div className="collection-card small-card">
          <div className="card-content">
            <p className="collection-label">BASIC COLLECTION</p>
            <h2 className="collection-title">
              Basic<br />Shoes.
            </h2>
            <a href="#" className="shop-link">
              Shop Collection →
            </a>
          </div>
        </div>

        {/* Bottom Right Card */}
        <div className="collection-card small-card">
          <div className="card-content">
            <p className="collection-label">BEST SELLING PRODUCT</p>
            <h2 className="collection-title">
              Woolen<br />Hat.
            </h2>
            <a href="#" className="shop-link">
              Shop Collection →
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}