import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import '../Users/Users.css'; // Reusing Users CSS for consistency
import AddCategory from './AddCategory';

const categories = [
    { id: 1, name: 'Electronics', slug: 'electronics', is_active: true, display_order: 1 },
    { id: 2, name: 'Fashion', slug: 'fashion', is_active: true, display_order: 2 },
    { id: 3, name: 'Home & Kitchen', slug: 'home-kitchen', is_active: false, display_order: 3 },
    { id: 4, name: 'Books', slug: 'books', is_active: true, display_order: 4 },
];

const StatusPill = ({ status }) => {
    const className = status ? 'payment-pill success' : 'payment-pill blocked';
    const text = status ? 'Active' : 'Inactive';
    return <span className={className}>{text}</span>;
};

const Category = () => {
    const navigate = useNavigate();
    const [isAddCategoryOpen, setIsAddCategoryOpen] = useState(false);

    return (
        <div className="recent-purchases-card">
            <AddCategory isOpen={isAddCategoryOpen} onClose={() => setIsAddCategoryOpen(false)} />

            {/* Header Section */}
            <div className="card-header">
                <h2>Category List</h2>
                <div className="header-actions">
                    <button className="action-button new-button" onClick={() => setIsAddCategoryOpen(true)}>+ New Category</button>
                </div>
            </div>

            {/* Table Section */}
            <div className="table-container">
                <table>
                    <thead>
                        <tr>
                            <th className="checkbox-col"><input type="checkbox" /></th>
                            <th>Name ↓</th>
                            <th>Slug ↓</th>
                            <th>Display Order ↓</th>
                            <th>Status ↓</th>
                            <th className="dots-col"></th>
                        </tr>
                    </thead>
                    <tbody>
                        {categories.map(cat => (
                            <tr key={cat.id}>
                                <td className="checkbox-col"><input type="checkbox" /></td>
                                <td className="customer-name">{cat.name}</td>
                                <td>{cat.slug}</td>
                                <td>{cat.display_order}</td>
                                <td><StatusPill status={cat.is_active} /></td>
                                <td className="dots-col">...</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Footer Section (Static for now) */}
            <div className="card-footer">
                <div className="pagination-info">
                    1 to {categories.length} of {categories.length}
                </div>
                <div className="pagination-buttons">
                    <button className="pagination-button prev-button">Previous</button>
                    <button className="pagination-button next-button">Next</button>
                </div>
            </div>
        </div>
    );
};

export default Category;
