import React, { useState } from 'react';
import './ProductListing.css';
import { Header } from '../Header';
import Footer from './Footer';
import LastFooter from './LastFooter';
import { ChevronDown, Star } from 'lucide-react';
import { Link } from 'react-router-dom';

const ProductListing = () => {
    const products = [
        {
            id: 1,
            name: "Trendy Polo T-Shirt",
            price: "₹334",
            oldPrice: "₹454",
            discount: "26% off",
            rating: "4.1",
            reviews: "10K",
            img: "/polo-tshirt-green.jpg",
            freeDelivery: true
        },
        {
            id: 2,
            name: "Classic Grey Polo",
            price: "₹419",
            oldPrice: "₹599",
            discount: "30% off",
            rating: "3.8",
            reviews: "17K",
            img: "/polo-tshirt-grey.jpg",
            freeDelivery: true
        },
        {
            id: 3,
            name: "Modern Purple Polo",
            price: "₹311",
            oldPrice: "₹399",
            discount: "22% off",
            rating: "3.9",
            reviews: "1.5K",
            img: "/polo-tshirt-purple.jpg",
            freeDelivery: true
        },
        {
            id: 4,
            name: "Casual Blue Polo",
            price: "₹271",
            oldPrice: "₹349",
            discount: "22% off",
            rating: "3.9",
            reviews: "7.4K",
            img: "/polo-tshirt.jpg",
            freeDelivery: true
        },
        {
            id: 5,
            name: "Essential Green Polo",
            price: "₹469",
            oldPrice: "₹549",
            discount: "15% off",
            rating: "3.9",
            reviews: "2.8K",
            img: "/polo-tshirt-green.jpg",
            freeDelivery: true
        },
        {
            id: 6,
            name: "Premium Grey Polo",
            price: "₹295",
            oldPrice: "₹399",
            discount: "26% off",
            rating: "4.0",
            reviews: "3.6K",
            img: "/polo-tshirt-grey.jpg",
            freeDelivery: true
        },
        {
            id: 7,
            name: "Stylish Purple Polo",
            price: "₹418",
            oldPrice: "₹529",
            discount: "21% off",
            rating: "3.8",
            reviews: "3.4K",
            img: "/polo-tshirt-purple.jpg",
            freeDelivery: true
        },
        {
            id: 8,
            name: "Basic White Polo",
            price: "₹442",
            oldPrice: "₹454",
            discount: "3% off",
            rating: "4.0",
            reviews: "5.7K",
            img: "/polo-tshirt.jpg",
            freeDelivery: true
        }
    ];

    const filterCategories = [
        "Category", "Gender", "Color", "Fabric", "Size", "Price", "Rating", "Combo", "Discount"
    ];

    return (
        <div className="listing-page">
            <Header />
            <div className="listing-container">
                {/* Sidebar */}
                <aside className="sidebar">
                    <div className="filter-header">
                        <h3>FILTERS</h3>
                        <p>1000+ Products</p>
                    </div>

                    <div className="filter-groups">
                        <div className="filter-group">
                            <div className="filter-title">
                                <span>Category</span>
                                <ChevronDown size={18} />
                            </div>
                            <div className="filter-options">
                                <label><input type="checkbox" /> Shoes</label>
                                <label><input type="checkbox" /> Sports Shoes</label>
                            </div>
                        </div>

                        <div className="filter-group">
                            <div className="filter-title">
                                <span>Gender</span>
                                <ChevronDown size={18} />
                            </div>
                            <div className="filter-options">
                                <button className="gender-btn active">Men</button>
                            </div>
                        </div>

                        {filterCategories.slice(2).map((cat) => (
                            <div key={cat} className="filter-group">
                                <div className="filter-title">
                                    <span>{cat}</span>
                                    <ChevronDown size={18} />
                                </div>
                            </div>
                        ))}
                    </div>
                </aside>

                {/* Main Content */}
                <main className="main-content">
                    <div className="toolbar">
                        <div className="sort-by">
                            <span>Sort by :</span>
                            <div className="sort-dropdown">
                                Relevance <ChevronDown size={16} />
                            </div>
                        </div>
                    </div>

                    <div className="product-grid">
                        {products.map((product) => (
                            <div key={product.id} className="listing-card">
                                <div className="card-img-wrapper">
                                    <img src={product.img} alt={product.name} />
                                    <span className="variant-tag">+4 More</span>
                                    <div className="card-option-overlay">
                                        <Link to="/product" className="buy-now-btn">Buy Now</Link>
                                    </div>
                                </div>
                                <div className="card-details">
                                    <p className="p-name">{product.name}</p>
                                    <div className="p-price-row">
                                        <span className="p-price">{product.price}</span>
                                        <span className="p-old-price">{product.oldPrice}</span>
                                        <span className="p-discount">{product.discount}</span>
                                    </div>
                                    {product.freeDelivery && <p className="free-del">Free Delivery</p>}
                                    <div className="p-rating-row">
                                        <div className="p-rating">
                                            {product.rating} <Star size={12} fill="white" />
                                        </div>
                                        <span className="p-reviews">{product.reviews} Reviews</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </main>
            </div>
            <Footer />
            <LastFooter />
        </div>
    );
};

export default ProductListing;
