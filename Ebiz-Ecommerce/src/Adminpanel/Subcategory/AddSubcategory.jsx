import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import "../AdminForm.css"; // Import the common CSS
import API from "../../Utils/AxiosConfig";
import toast from 'react-hot-toast';

const AddSubcategory = ({ isOpen, onClose, onSave, subcategoryId }) => {
    const [formData, setFormData] = useState({
        name: "",
        slug: "",
        categoryId: "",
        image: null,
        status: 1,
    });
    const [categories, setCategories] = useState([]);

    // Fetch categories for the categoryId dropdown
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await API.get('/categories');
                setCategories(response.data);
            } catch (error) {
                console.error("Error fetching categories for subcategory dropdown:", error);
            }
        };
        if (isOpen) {
            fetchCategories();
        }
    }, [isOpen]);

    // Reset form or fetch details when opened
    useEffect(() => {
        if (isOpen && subcategoryId) {
            const fetchDetails = async () => {
                const loadingToast = toast.loading('Fetching details...');
                try {
                    const response = await API.get(`/subcategories/${subcategoryId}`);
                    const data = response.data;
                    setFormData({
                        name: data.name || "",
                        slug: data.slug || "",
                        categoryId: data.categoryId || "",
                        image: data.image || null,
                        status: data.status ?? 1,
                    });
                    toast.dismiss(loadingToast);
                } catch (error) {
                    console.error("Error fetching subcategory details:", error);
                    toast.error("Failed to load details", { id: loadingToast });
                }
            };
            fetchDetails();
        } else if (isOpen) {
            setFormData({
                name: "",
                slug: "",
                categoryId: "",
                image: null,
                status: 1,
            });
        }
    }, [isOpen, subcategoryId]);

    const handleChange = (e) => {
        const { name, type, checked, value, files } = e.target;
        setFormData({
            ...formData,
            [name]: type === 'checkbox' ? checked : type === 'file' ? files[0] : value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const actionText = subcategoryId ? 'Updating' : 'Creating';
        const loadingToast = toast.loading(`${actionText} subcategory...`);

        try {
            let imageBase64 = typeof formData.image === 'string' ? formData.image : "";
            if (formData.image && formData.image instanceof File) {
                imageBase64 = await new Promise((resolve, reject) => {
                    const reader = new FileReader();
                    reader.onload = () => resolve(reader.result);
                    reader.onerror = reject;
                    reader.readAsDataURL(formData.image);
                });
            }

            const payload = {
                name: formData.name,
                slug: formData.slug,
                categoryId: formData.categoryId,
                image: imageBase64,
                status: Number(formData.status)
            };

            console.log(`Submitting Subcategory (${subcategoryId ? 'PUT' : 'POST'}):`, payload);

            let response;
            if (subcategoryId) {
                response = await API.put(`/subcategories/${subcategoryId}`, payload);
            } else {
                response = await API.post('/subcategories', payload);
            }

            toast.success(`Subcategory ${subcategoryId ? 'updated' : 'created'} successfully!`, { id: loadingToast });
            if (onSave) onSave(response.data);
            onClose();
        } catch (error) {
            console.error(`Error ${subcategoryId ? 'updating' : 'creating'} subcategory:`, error);
            toast.error(error.response?.data?.message || `Failed to ${subcategoryId ? 'update' : 'create'} subcategory`, { id: loadingToast });
        }
    };

    if (!isOpen) return null;

    return (
        <>
            <div className="sidebar-overlay" onClick={onClose}></div>
            <div className="sidebar-container">
                <div className="sidebar-header">
                    <h2 className="sidebar-title">{subcategoryId ? 'Update Subcategory' : 'New Subcategory'}</h2>
                    <button className="close-btn" onClick={onClose}>
                        <X size={20} />
                    </button>
                </div>

                <div className="sidebar-content">
                    <form id="add-subcategory-form" onSubmit={handleSubmit} className="admin-form">

                        {/* Parent Category Dropdown */}
                        <div className="form-group">
                            <label className="form-label">Parent Category *</label>
                            <select
                                name="categoryId"
                                value={formData.categoryId}
                                onChange={handleChange}
                                required
                                className="form-input"
                            >
                                <option value="">Select Category</option>
                                {categories.map(cat => (
                                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                                ))}
                            </select>
                        </div>

                        {/* Name */}
                        <div className="form-group">
                            <label className="form-label">Name *</label>
                            <input
                                type="text"
                                name="name"
                                placeholder="Subcategory Name"
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
                                placeholder="subcategory-slug"
                                value={formData.slug}
                                onChange={handleChange}
                                required
                                className="form-input"
                            />
                        </div>

                        {/* Image */}
                        <div className="form-group">
                            <label className="form-label">Subcategory Image</label>
                            <input
                                type="file"
                                name="image"
                                onChange={handleChange}
                                className="form-input"
                                accept="image/*"
                            />
                            {formData.image && (
                                <div style={{ marginTop: '10px', padding: '10px', border: '1px solid #eee', borderRadius: '4px', display: 'inline-block', backgroundColor: '#f9f9f9' }}>
                                    <p style={{ fontSize: '12px', color: '#666', marginBottom: '5px' }}>Current Preview:</p>
                                    <img
                                        src={typeof formData.image === 'string' ? formData.image : URL.createObjectURL(formData.image)}
                                        alt="Preview"
                                        style={{ maxWidth: '100px', maxHeight: '100px', display: 'block', borderRadius: '4px' }}
                                    />
                                </div>
                            )}
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

                <div className="sidebar-footer">
                    <button type="button" className="btn-cancel" onClick={onClose}>Cancel</button>
                    <button type="submit" form="add-subcategory-form" className="btn-submit">
                        {subcategoryId ? 'Update' : 'Save'}
                    </button>
                </div>
            </div>
        </>
    );
};

export default AddSubcategory;
