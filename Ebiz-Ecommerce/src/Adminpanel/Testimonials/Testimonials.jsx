import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import { Edit2, Trash2, Star, MessageSquare } from "lucide-react";
import '../Users/Users.css'; // Reusing Users CSS for consistency
import AddTestimonial from './AddTestimonial';
import NoData from '../Components/NoData';

const StatusPill = ({ active }) => {
    const className = active ? 'payment-pill success' : 'payment-pill blocked';
    const text = active ? 'Active' : 'Inactive';
    return <span className={className}>{text}</span>;
};

const FeaturedPill = ({ featured }) => {
    if (!featured) return null;
    return <span className="payment-pill success" style={{ background: '#fef3c7', color: '#92400e', border: 'none' }}>★ Featured</span>;
};

const Testimonials = () => {
    const navigate = useNavigate();
    const [isAddOpen, setIsAddOpen] = useState(false);
    const [testimonialList, setTestimonialList] = useState([
        { id: 1, customer_name: 'Sarah Connor', customer_role: 'Tech Lead', rating: 5, message: 'Absolutely stunning quality and service!', is_featured: true, is_active: true, display_order: 1 },
        { id: 2, customer_name: 'James Bond', customer_role: 'Special Agent', rating: 4, message: 'The gadgets are refined, but the delivery could be faster.', is_featured: false, is_active: true, display_order: 2 },
        { id: 3, customer_name: 'Ellen Ripley', customer_role: 'Officer', rating: 5, message: 'Game over, man! This is the best ecommerce site ever.', is_featured: true, is_active: false, display_order: 3 },
    ]);

    const handleSave = (newData) => {
        setTestimonialList(prev => [...prev, newData]);
    };

    return (
        <div className="recent-purchases-card">
            <AddTestimonial isOpen={isAddOpen} onClose={() => setIsAddOpen(false)} onSave={handleSave} />

            {/* Header Section */}
            <div className="card-header">
                <h2>Testimonial List</h2>
                <div className="header-actions">
                    <button className="action-button new-button" onClick={() => setIsAddOpen(true)}>+ New Testimonial</button>
                </div>
            </div>

            {/* Table Section */}
            <div className="table-container">
                <table>
                    <thead>
                        <tr>
                            <th>Customer ↓</th>
                            <th>Role ↓</th>
                            <th>Rating ↓</th>
                            <th>Message ↓</th>
                            <th>Status ↓</th>
                            <th className="dots-col">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {testimonialList.length === 0 ? (
                            <tr>
                                <td colSpan="6" style={{ padding: "0" }}>
                                    <NoData message="No testimonials yet. Share some customer love!" />
                                </td>
                            </tr>
                        ) : (
                            testimonialList.map(item => (
                                <tr key={item.id}>
                                    <td className="customer-name">
                                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                                            {item.customer_name}
                                            <FeaturedPill featured={item.is_featured} />
                                        </div>
                                    </td>
                                    <td>{item.customer_role}</td>
                                    <td>
                                        <div style={{ display: 'flex', color: '#fbbf24' }}>
                                            {[...Array(Number(item.rating))].map((_, i) => <Star key={i} size={14} fill="#fbbf24" />)}
                                        </div>
                                    </td>
                                    <td style={{ maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                        {item.message}
                                    </td>
                                    <td><StatusPill active={item.is_active} /></td>
                                    <td className="dots-col">
                                        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                                            <Edit2 size={16} style={{ cursor: 'pointer', color: '#4f46e5' }} />
                                            <Trash2 size={16} style={{ cursor: 'pointer', color: '#ef4444' }} />
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Footer Section */}
            <div className="card-footer">
                <div className="pagination-info">
                    1 to {testimonialList.length} of {testimonialList.length}
                </div>
                <div className="pagination-buttons">
                    <button className="pagination-button prev-button">Previous</button>
                    <button className="pagination-button next-button">Next</button>
                </div>
            </div>
        </div>
    );
};

export default Testimonials;
