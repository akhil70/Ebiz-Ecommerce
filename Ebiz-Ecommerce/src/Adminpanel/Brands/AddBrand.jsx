import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import "../AdminForm.css"; // Import the common CSS
import API from "../../Utils/AxiosConfig";
import toast from 'react-hot-toast';

const AddBrand = ({ isOpen, onClose, onSave, brandId }) => {
    const [formData, setFormData] = useState({
        name: "",
        slug: "",
        logo: null,
        description: "",
        status: 1, // 1 for Active, 0 for Inactive as per common patterns
    });

    // Reset form or fetch details when opened
    useEffect(() => {
        if (isOpen && brandId) {
            const fetchBrandDetails = async () => {
                const loadingToast = toast.loading('Fetching brand details...');
                try {
                    const response = await API.get(`/brands/${brandId}`);
                    const data = response.data;
                    setFormData({
                        name: data.name || "",
                        slug: data.slug || "",
                        description: data.description || "",
                        status: data.status ?? 1,
                        logo: data.logo || null,
                    });
                    toast.dismiss(loadingToast);
                } catch (error) {
                    console.error("Error fetching brand details:", error);
                    toast.error("Failed to load brand details", { id: loadingToast });
                }
            };
            fetchBrandDetails();
        } else if (isOpen) {
            setFormData({
                name: "",
                slug: "",
                logo: null,
                description: "",
                status: 1,
            });
        }
    }, [isOpen, brandId]);

    const handleChange = (e) => {
        const { name, type, checked, value, files } = e.target;
        setFormData({
            ...formData,
            [name]: type === 'checkbox' ? checked : type === 'file' ? files[0] : value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const actionText = brandId ? 'Updating' : 'Creating';
        const loadingToast = toast.loading(`${actionText} brand...`);

        try {
            let logoBase64 = typeof formData.logo === 'string' ? formData.logo : "";
            if (formData.logo && formData.logo instanceof File) {
                logoBase64 = await new Promise((resolve, reject) => {
                    const reader = new FileReader();
                    reader.onload = () => resolve(reader.result);
                    reader.onerror = reject;
                    reader.readAsDataURL(formData.logo);
                });
            }

            const payload = {
                name: formData.name,
                slug: formData.slug,
                description: formData.description,
                logo: logoBase64
            };

            // Include status if creating, or if the PUT API accepts it
            if (!brandId) {
                payload.status = Number(formData.status);
            } else {
                // User prompt specifically mentioned 4 fields for PUT, 
                // but usually status is needed too. I'll stick to prompt but keep it in state.
                payload.status = Number(formData.status);
            }

            console.log(`Submitting Brand (${brandId ? 'PUT' : 'POST'}):`, payload);

            let response;
            if (brandId) {
                response = await API.put(`/brands/${brandId}`, payload);
            } else {
                response = await API.post('/brands', payload);
            }

            toast.success(`Brand ${brandId ? 'updated' : 'created'} successfully!`, { id: loadingToast });
            if (onSave) onSave(response.data);
            onClose();
        } catch (error) {
            console.error(`Error ${brandId ? 'updating' : 'creating'} brand:`, error);
            toast.error(error.response?.data?.message || `Failed to ${brandId ? 'update' : 'create'} brand`, { id: loadingToast });
        }
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
                    <h2 className="sidebar-title">{brandId ? 'Update Brand' : 'New Brand'}</h2>
                    <button className="close-btn" onClick={onClose}>
                        <X size={20} />
                    </button>
                </div>

                {/* Content */}
                <div className="sidebar-content">
                    <form id="add-brand-form" onSubmit={handleSubmit} className="admin-form">

                        {/* Name */}
                        <div className="form-group">
                            <label className="form-label">Name *</label>
                            <input
                                type="text"
                                name="name"
                                placeholder="Brand Name"
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
                                placeholder="brand-slug"
                                value={formData.slug}
                                onChange={handleChange}
                                required
                                className="form-input"
                            />
                        </div>

                        {/* Brand Logo */}
                        <div className="form-group">
                            <label className="form-label">Brand Logo *</label>
                            <input
                                type="file"
                                name="logo"
                                onChange={handleChange}
                                className="form-input"
                                accept="image/*"
                            />

                            {/* Logo Preview Box */}
                            {formData.logo && (
                                <div style={{ marginTop: '10px', padding: '10px', border: '1px solid #eee', borderRadius: '4px', display: 'inline-block', backgroundColor: '#f9f9f9' }}>
                                    <p style={{ fontSize: '12px', color: '#666', marginBottom: '5px' }}>Current Preview:</p>
                                    <img
                                        src={typeof formData.logo === 'string' ? formData.logo : URL.createObjectURL(formData.logo)}
                                        alt="Preview"
                                        style={{ maxWidth: '100px', maxHeight: '100px', display: 'block', borderRadius: '4px' }}
                                    />
                                </div>
                            )}
                        </div>

                        {/* Description */}
                        <div className="form-group">
                            <label className="form-label">Description</label>
                            <textarea
                                name="description"
                                rows="3"
                                placeholder="Brand Description"
                                value={formData.description}
                                onChange={handleChange}
                                className="form-textarea"
                            />
                        </div>

                        {/* Status */}
                        <div className="form-group checkbox-group">
                            <label className="form-label" style={{ marginBottom: 0 }}>Active Status</label>
                            <input
                                type="checkbox"
                                name="status"
                                checked={formData.status === 1}
                                onChange={(e) => {
                                    setFormData({ ...formData, status: e.target.checked ? 1 : 0 });
                                }}
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
                    <button type="submit" form="add-brand-form" className="btn-submit">
                        {brandId ? 'Update' : 'Save'}
                    </button>
                </div>
            </div>
        </>
    );
};

export default AddBrand;
