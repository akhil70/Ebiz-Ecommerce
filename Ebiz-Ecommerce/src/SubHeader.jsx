import React, { useState, useEffect } from 'react';
import './SubHeader.css';
import API from './Utils/AxiosConfig';

const SubHeader = () => {
    const [hoveredCategory, setHoveredCategory] = useState(null);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [categories, setCategories] = useState([]);

    useEffect(() => {
        const fetchCategoriesWithSub = async () => {
            try {
                const response = await API.get('/categories/with-subcategories');
                console.log("Categories with Subcategories:", response.data);
                setCategories(response.data);
            } catch (error) {
                console.error("Error fetching categories with subcategories:", error);
            }
        };
        fetchCategoriesWithSub();
    }, []);

    return (
        <div className="subheader-container">
            <div className="subheader-mobile-bar">
                <span className="subheader-title">Categories</span>
                <button
                    className="subheader-toggle"
                    type="button"
                    aria-expanded={isMobileMenuOpen}
                    aria-label="Toggle categories"
                    onClick={() => setIsMobileMenuOpen((open) => !open)}
                >
                    <span className={`subheader-toggle-icon ${isMobileMenuOpen ? 'open' : ''}`} />
                </button>
            </div>

            <ul className={`subheader-list ${isMobileMenuOpen ? 'open' : ''}`}>
                {categories.map((category) => (
                    <li
                        key={category.id}
                        className={`subheader-item ${hoveredCategory === category.id ? 'active' : ''}`}
                        onMouseEnter={() => setHoveredCategory(category.id)}
                        onMouseLeave={() => setHoveredCategory(null)}
                        onClick={() => {
                            if (!category.subcategory || category.subcategory.length === 0) return;
                            setHoveredCategory((current) =>
                                current === category.id ? null : category.id
                            );
                        }}
                    >
                        <span className="category-name">{category.name}</span>

                        {/* Show dropdown if it has subcategories */}
                        {category.subcategory && category.subcategory.length > 0 && hoveredCategory === category.id && (
                            <div className="subheader-dropdown">
                                <div className="dropdown-column">
                                    <h4 className="dropdown-heading">{category.name}</h4>
                                    <ul className="dropdown-list">
                                        {category.subcategory.map((sub) => (
                                            <li key={sub.id} className="dropdown-item">
                                                {sub.name}
                                            </li>
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
