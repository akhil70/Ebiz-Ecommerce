import React, { useState, useEffect } from "react";
import "./ProductListing.css";
import { Header } from "../Header";
import Footer from "./Footer";
import LastFooter from "./LastFooter";
import { ChevronDown, ChevronRight, Star, X, Menu } from "lucide-react";
import { Link, useSearchParams } from "react-router-dom";
import API from "../Utils/AxiosConfig";
import { PublicAPI } from "../Utils/AxiosConfig";

// Map API product to UI format
const mapProduct = (p) => {
  const originalPrice = Number(p.price) || 0;
  const salePrice = Number(p.discountPrice) || originalPrice;
  const displayPrice = salePrice > 0 ? salePrice : originalPrice;
  const discountPct =
    originalPrice > 0 && salePrice < originalPrice
      ? Math.round(((originalPrice - salePrice) / originalPrice) * 100)
      : 0;
  return {
    id: p.id,
    name: p.name || "",
    price: `₹${displayPrice}`,
    oldPrice: discountPct > 0 ? `₹${originalPrice}` : null,
    discount: discountPct > 0 ? `${discountPct}% off` : null,
    rating: "4.2",
    reviews: "0",
    img:
      p.thumbnail ||
      (p.images && p.images[0]) ||
      "https://via.placeholder.com/200?text=Product",
    freeDelivery: true,
  };
};

const ProductListing = () => {
  const [searchParams] = useSearchParams();
  const categoryId = searchParams.get("categoryId");
  const brandId = searchParams.get("brandId");
  const isFeatured = searchParams.get("isFeatured");
  const isNewArrival = searchParams.get("isNewArrival");

  const [products, setProducts] = useState([]);
  const [productsLoading, setProductsLoading] = useState(true);
  const [filters, setFilters] = useState([]);
  const [filtersLoading, setFiltersLoading] = useState(true);
  const [expandedFilterIds, setExpandedFilterIds] = useState(new Set());
  const [selectedFilters, setSelectedFilters] = useState({}); // { "Color": ["Red", "Blue"], "Material": ["Cotton"] }
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  const toggleFilter = (filterId) => {
    setExpandedFilterIds((prev) => {
      const next = new Set(prev);
      if (next.has(filterId)) next.delete(filterId);
      else next.add(filterId);
      return next;
    });
  };

  const handleFilterOptionChange = (filterName, option, checked) => {
    setSelectedFilters((prev) => {
      const current = prev[filterName] || [];
      const next = checked
        ? [...current, option]
        : current.filter((o) => o !== option);
      const updated = { ...prev };
      if (next.length > 0) updated[filterName] = next;
      else delete updated[filterName];
      return updated;
    });
  };

  const isFilterOptionChecked = (filterName, option) => {
    return (selectedFilters[filterName] || []).includes(option);
  };

  useEffect(() => {
    const fetchFilters = async () => {
      try {
        setFiltersLoading(true);
        const response = await API.get("/filters");
        const data = Array.isArray(response.data)
          ? response.data
          : (response.data?.data ?? []);
        setFilters(
          data.map((f) => ({
            id: f.id,
            name: f.filterName ?? f.name,
            options: f.filterOptions ?? f.options ?? [],
          })),
        );
      } catch (error) {
        console.error("Error fetching filters:", error);
        setFilters([]);
      } finally {
        setFiltersLoading(false);
      }
    };
    fetchFilters();
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setProductsLoading(true);
        const params = new URLSearchParams();
        if (categoryId) params.set("categoryId", categoryId);
        if (brandId) params.set("brandId", brandId);
        if (isFeatured === "true") params.set("isFeatured", "true");
        if (isNewArrival === "true") params.set("isNewArrival", "true");
        Object.entries(selectedFilters).forEach(([key, values]) => {
          values.forEach((v) => params.append(key, v));
        });
        const query = params.toString();
        const url = query ? `/products?${query}` : "/products";
        const response = await PublicAPI.get(url);
        const data = Array.isArray(response.data)
          ? response.data
          : (response.data?.data ?? []);
        setProducts(data.map(mapProduct));
      } catch (error) {
        console.error("Error fetching products:", error);
        setProducts([]);
      } finally {
        setProductsLoading(false);
      }
    };
    fetchProducts();
  }, [categoryId, brandId, isFeatured, isNewArrival, selectedFilters]);

  return (
    <div className="listing-page">
      <Header />
      {/* Mobile Sidebar Overlay */}
      {isMobileSidebarOpen && (
        <div
          className="sidebar-overlay-visible"
          onClick={() => setIsMobileSidebarOpen(false)}
        ></div>
      )}

      <div className="listing-container">
        {/* Sidebar */}
        <aside className={`sidebar ${isMobileSidebarOpen ? "mobile-open" : ""}`}>
          <div className="sidebar-mobile-header">
            <h3>FILTERS</h3>
            <button className="close-sidebar" onClick={() => setIsMobileSidebarOpen(false)}>
              <X size={24} />
            </button>
          </div>
          <div className="filter-header hidden-mobile">
            <h3>FILTERS</h3>
            <p>{products.length}+ Products</p>
          </div>

          <div className="filter-groups">
            {filtersLoading ? (
              <p
                style={{ fontSize: "0.9rem", color: "#888", padding: "1rem 0" }}
              >
                Loading filters...
              </p>
            ) : filters.length === 0 ? (
              <p
                style={{ fontSize: "0.9rem", color: "#888", padding: "1rem 0" }}
              >
                No filters available
              </p>
            ) : (
              filters.map((filter) => {
                const isExpanded = expandedFilterIds.has(filter.id);
                const hasOptions = (filter.options || []).length > 0;
                return (
                  <div key={filter.id} className="filter-group">
                    <div
                      className={`filter-title ${!hasOptions ? "filter-title--disabled" : ""}`}
                      onClick={() => hasOptions && toggleFilter(filter.id)}
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e) =>
                        hasOptions &&
                        (e.key === "Enter" || e.key === " ") &&
                        toggleFilter(filter.id)
                      }
                      aria-expanded={isExpanded}
                    >
                      <span>{filter.name}</span>
                      {hasOptions ? (
                        isExpanded ? (
                          <ChevronDown size={18} className="filter-chevron" />
                        ) : (
                          <ChevronRight size={18} className="filter-chevron" />
                        )
                      ) : null}
                    </div>
                    {hasOptions && isExpanded && (
                      <div className="filter-options">
                        {filter.options.map((opt, i) => (
                          <label key={i}>
                            <input
                              type="checkbox"
                              checked={isFilterOptionChecked(filter.name, opt)}
                              onChange={(e) =>
                                handleFilterOptionChange(
                                  filter.name,
                                  opt,
                                  e.target.checked,
                                )
                              }
                            />
                            {opt}
                          </label>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </aside>

        {/* Main Content */}
        <main className={`main-content ${isMobileSidebarOpen ? "content-blurred" : ""}`}>
          <div className="toolbar">
            <button className="mobile-filter-btn" onClick={() => setIsMobileSidebarOpen(true)}>
              <Menu size={18} /> Filters
            </button>
            <div className="sort-by">
              <span>Sort by :</span>
              <div className="sort-dropdown">
                Relevance <ChevronDown size={16} />
              </div>
            </div>
          </div>

          <div className="product-grid">
            {productsLoading ? (
              <p
                style={{
                  gridColumn: "1 / -1",
                  textAlign: "center",
                  padding: "40px",
                  color: "#666",
                }}
              >
                Loading products...
              </p>
            ) : products.length === 0 ? (
              <p
                style={{
                  gridColumn: "1 / -1",
                  textAlign: "center",
                  padding: "40px",
                  color: "#666",
                }}
              >
                No products found
              </p>
            ) : (
              products.map((product) => (
                <div key={product.id} className="listing-card">
                  <div className="card-img-wrapper">
                    <img
                      src={product.img}
                      alt={product.name}
                      onError={(e) => {
                        e.target.src =
                          "https://via.placeholder.com/200?text=Product";
                      }}
                    />
                    <div className="card-option-overlay">
                      <Link
                        to={`/product?id=${product.id}`}
                        className="buy-now-btn"
                      >
                        Buy Now
                      </Link>
                    </div>
                  </div>
                  <div className="card-details">
                    <p className="p-name">{product.name}</p>
                    <div className="p-price-row">
                      <span className="p-price">{product.price}</span>
                      {product.oldPrice && (
                        <span className="p-old-price">{product.oldPrice}</span>
                      )}
                      {product.discount && (
                        <span className="p-discount">{product.discount}</span>
                      )}
                    </div>
                    {product.freeDelivery && (
                      <p className="free-del">Free Delivery</p>
                    )}
                    <div className="p-rating-row">
                      <div className="p-rating">
                        {product.rating} <Star size={12} fill="white" />
                      </div>
                      <span className="p-reviews">
                        {product.reviews} Reviews
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </main>
      </div>
      <Footer />
      <LastFooter />
    </div>
  );
};

export default ProductListing;
