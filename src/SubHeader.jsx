import React, { useState } from 'react';
import './SubHeader.css';

const SubHeader = () => {
    const [hoveredCategory, setHoveredCategory] = useState(null);

    const categories = [
        {
            name: "Popular",
            id: "popular",
            content: {
                featured: [
                    "Smartphones",
                    "Top Brands",
                    "Shimla Apples"
                ],
                allPopular: [
                    "Jewellery",
                    "Men Fashion",
                    "Kids",
                    "Footwear",
                    "Beauty & Personal Care",
                    "Grocery",
                    "Electronics",
                    "Innerwear & Nightwear",
                    "Kitchen & Appliances",
                    "Bags & Luggage"
                ]
            }
        },
        { name: "Kurti, Saree & Lehenga", id: "ethnic", content: null },
        { name: "Women Western", id: "western", content: null },
        { name: "Lingerie", id: "lingerie", content: null },
        { name: "Men", id: "men", content: null },
        { name: "Kids & Toys", id: "kids", content: null },
        { name: "Home & Kitchen", id: "home", content: null },
        { name: "Beauty & Health", id: "beauty", content: null },
        { name: "Home & Kitchen", id: "home", content: null },
        { name: "Beauty & Health", id: "beauty", content: null },
    ];

    return (
        <div className="subheader-container">
            <ul className="subheader-list">
                {categories.map((category) => (
                    <li
                        key={category.id}
                        className={`subheader-item ${hoveredCategory === category.id ? 'active' : ''}`}
                        onMouseEnter={() => setHoveredCategory(category.id)}
                        onMouseLeave={() => setHoveredCategory(null)}
                    >
                        <span className="category-name">{category.name}</span>

                        {/* Show dropdown only if it has content (specifically "Popular" for now as per request) */}
                        {category.content && hoveredCategory === category.id && (
                            <div className="subheader-dropdown">
                                <div className="dropdown-column">
                                    <h4 className="dropdown-heading featured">Featured On Meesho</h4>
                                    <ul className="dropdown-list">
                                        {category.content.featured.map((item, index) => (
                                            <li key={index} className="dropdown-item">{item}</li>
                                        ))}
                                    </ul>
                                </div>
                                <div className="dropdown-column">
                                    <h4 className="dropdown-heading">All Popular</h4>
                                    <ul className="dropdown-list">
                                        {category.content.allPopular.map((item, index) => (
                                            <li key={index} className="dropdown-item">{item}</li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        )}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default SubHeader;
