import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import "../AdminForm.css"; // Import the common CSS

const AddTestimonial = ({ isOpen, onClose, onSave }) => {
    const [formData, setFormData] = useState({
        customer_name: "",
        customer_role: "",
        customer_image: null,
        rating: 5,
        message: "",
        is_featured: false,
        is_active: true,
        display_order: 0,
    });

    // Reset form when opened fresh
    useEffect(() => {
        if (isOpen) {
            setFormData({
                customer_name: "",
                customer_role: "",
                customer_image: null,
                rating: 5,
                message: "",
                is_featured: false,
                is_active: true,
                display_order: 0,
            });
        }
    }, [isOpen]);

    const handleChange = (e) => {
        const { name, type, checked, value, files } = e.target;
        setFormData({
            ...formData,
            [name]: type === 'checkbox' ? checked : type === 'file' ? files[0] : value,
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("Testimonial submitted (UI Only):", formData);

        // UI Only - simulate success
        alert("Testimonial saved successfully (Simulation)!");
        if (onSave) onSave({ ...formData, id: Date.now() });
        onClose();
    };

    if (!isOpen) return null;

    return (
        <>
            {/* Overlay */}
            <div className="sidebar-overlay" onClick={onClose}></div>

            {/* Sidebar Container */}
            <div className="sidebar-container">
                {/* Header */}
                <div className="sidebar-header">
                    <h2 className="sidebar-title">New Testimonial</h2>
                    <button className="close-btn" onClick={onClose}>
                        <X size={20} />
                    </button>
                </div>

                {/* Content */}
                <div className="sidebar-content">
                    <form id="add-testimonial-form" onSubmit={handleSubmit} className="admin-form">

                        {/* Customer Name */}
                        <div className="form-group">
                            <label className="form-label">Customer Name *</label>
                            <input
                                type="text"
                                name="customer_name"
                                placeholder="John Doe"
                                value={formData.customer_name}
                                onChange={handleChange}
                                required
                                className="form-input"
                            />
                        </div>

                        {/* Customer Role */}
                        <div className="form-group">
                            <label className="form-label">Customer Role</label>
                            <input
                                type="text"
                                name="customer_role"
                                placeholder="CEO, TechCorp"
                                value={formData.customer_role}
                                onChange={handleChange}
                                className="form-input"
                            />
                        </div>

                        {/* Customer Image */}
                        <div className="form-group">
                            <label className="form-label">Customer Image</label>
                            <input
                                type="file"
                                name="customer_image"
                                onChange={handleChange}
                                className="form-input"
                                accept="image/*"
                            />
                        </div>

                        {/* Rating */}
                        <div className="form-group">
                            <label className="form-label">Rating (1-5)</label>
                            <input
                                type="number"
                                name="rating"
                                min="1"
                                max="5"
                                value={formData.rating}
                                onChange={handleChange}
                                className="form-input"
                            />
                        </div>

                        {/* Message */}
                        <div className="form-group">
                            <label className="form-label">Message *</label>
                            <textarea
                                name="message"
                                rows="4"
                                placeholder="The service was excellent..."
                                value={formData.message}
                                onChange={handleChange}
                                required
                                className="form-textarea"
                            />
                        </div>

                        {/* Display Order */}
                        <div className="form-group">
                            <label className="form-label">Display Order</label>
                            <input
                                type="number"
                                name="display_order"
                                value={formData.display_order}
                                onChange={handleChange}
                                className="form-input"
                            />
                        </div>

                        {/* Features/Status toggles */}
                        <div style={{ display: 'flex', gap: '20px' }}>
                            <div className="form-group checkbox-group">
                                <label className="form-label" style={{ marginBottom: 0 }}>Featured</label>
                                <input
                                    type="checkbox"
                                    name="is_featured"
                                    checked={formData.is_featured}
                                    onChange={handleChange}
                                    className="form-checkbox"
                                />
                            </div>

                            <div className="form-group checkbox-group">
                                <label className="form-label" style={{ marginBottom: 0 }}>Active</label>
                                <input
                                    type="checkbox"
                                    name="is_active"
                                    checked={formData.is_active}
                                    onChange={handleChange}
                                    className="form-checkbox"
                                />
                            </div>
                        </div>

                    </form>
                </div>

                {/* Footer */}
                <div className="sidebar-footer">
                    <button
                        type="button"
                        className="btn-cancel"
                        onClick={onClose}
                    >
                        Cancel
                    </button>
                    <button type="submit" form="add-testimonial-form" className="btn-submit">
                        Save
                    </button>
                </div>
            </div>
        </>
    );
};

export default AddTestimonial;
