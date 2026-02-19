import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import "../AdminForm.css"; // Import the common CSS

const AddCategory = ({ isOpen, onClose, onSave }) => {
    const [formData, setFormData] = useState({
        name: "",
        slug: "",
        image: "",
        description: "",
        is_active: true,
        display_order: 0,
    });

    // Reset form when opened fresh
    useEffect(() => {
        if (isOpen) {
            setFormData({
                name: "",
                slug: "",
                image: "",
                description: "",
                is_active: true,
                display_order: 0,
            });
        }
    }, [isOpen]);

    const handleChange = (e) => {
        const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
        setFormData({
            ...formData,
            [e.target.name]: value,
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("Category submitted:", formData);
        alert("Category created successfully!");

        if (onSave) onSave(formData);
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
                    <h2 className="sidebar-title">New Category</h2>
                    <button className="close-btn" onClick={onClose}>
                        <X size={20} />
                    </button>
                </div>

                {/* Content */}
                <div className="sidebar-content">
                    <form id="add-category-form" onSubmit={handleSubmit} className="admin-form">

                        {/* Name */}
                        <div className="form-group">
                            <label className="form-label">Name *</label>
                            <input
                                type="text"
                                name="name"
                                placeholder="Category Name"
                                value={formData.name}
                                onChange={handleChange}
                                required
                                className="form-input"
                            />
                        </div>

                        {/* Slug */}
                        <div className="form-group">
                            <label className="form-label">Slug *</label>
                            <input
                                type="text"
                                name="slug"
                                placeholder="category-slug"
                                value={formData.slug}
                                onChange={handleChange}
                                required
                                className="form-input"
                            />
                        </div>

                        {/* Image URL */}
                        <div className="form-group">
                            <label className="form-label">Image URL</label>
                            <input
                                type="text"
                                name="image"
                                placeholder="http://example.com/image.png"
                                value={formData.image}
                                onChange={handleChange}
                                className="form-input"
                            />
                        </div>

                        {/* Description */}
                        <div className="form-group">
                            <label className="form-label">Description</label>
                            <textarea
                                name="description"
                                rows="3"
                                placeholder="Category Description"
                                value={formData.description}
                                onChange={handleChange}
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

                        {/* Is Active */}
                        <div className="form-group checkbox-group">
                            <label className="form-label" style={{ marginBottom: 0 }}>Is Active</label>
                            <input
                                type="checkbox"
                                name="is_active"
                                checked={formData.is_active}
                                onChange={handleChange}
                                className="form-checkbox"
                            />
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
                    <button type="submit" form="add-category-form" className="btn-submit">
                        Save
                    </button>
                </div>
            </div>
        </>
    );
};

export default AddCategory;
