import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import "../AdminForm.css"; // Import the common CSS
import API from "../../Utils/AxiosConfig";
import toast from 'react-hot-toast';

const AddCategory = ({ isOpen, onClose, onSave, categoryId }) => {
    const [formData, setFormData] = useState({
        name: "",
        slug: "",
        parentId: "",
        image: null,
        description: "",
        status: 1,
    });
    const [brands, setBrands] = useState([]);

    // Fetch brands for the parentId dropdown
    useEffect(() => {
        const fetchBrands = async () => {
            try {
                const response = await API.get('/brands');
                setBrands(response.data);
            } catch (error) {
                console.error("Error fetching brands for category dropdown:", error);
            }
        };
        if (isOpen) {
            fetchBrands();
        }
    }, [isOpen]);

    // Reset form or fetch details when opened
    useEffect(() => {
        if (isOpen && categoryId) {
            const fetchCategoryDetails = async () => {
                const loadingToast = toast.loading('Fetching category details...');
                try {
                    const response = await API.get(`/categories/${categoryId}`);
                    const data = response.data;
                    setFormData({
                        name: data.name || "",
                        slug: data.slug || "",
                        parentId: data.parentId || "",
                        image: data.image || null,
                        description: data.description || "",
                        status: data.status ?? 1,
                    });
                    toast.dismiss(loadingToast);
                } catch (error) {
                    console.error("Error fetching category details:", error);
                    toast.error("Failed to load category details", { id: loadingToast });
                }
            };
            fetchCategoryDetails();
        } else if (isOpen) {
            setFormData({
                name: "",
                slug: "",
                parentId: "",
                image: null,
                description: "",
                status: 1,
            });
        }
    }, [isOpen, categoryId]);

    const handleChange = (e) => {
        const { name, type, checked, value, files } = e.target;
        setFormData({
            ...formData,
            [name]: type === 'checkbox' ? checked : type === 'file' ? files[0] : value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const actionText = categoryId ? 'Updating' : 'Creating';
        const loadingToast = toast.loading(`${actionText} category...`);

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
                parentId: formData.parentId,
                description: formData.description,
                image: imageBase64,
                status: Number(formData.status)
            };

            console.log(`Submitting Category (${categoryId ? 'PUT' : 'POST'}):`, payload);

            let response;
            if (categoryId) {
                response = await API.put(`/categories/${categoryId}`, payload);
            } else {
                response = await API.post('/categories', payload);
            }

            toast.success(`Category ${categoryId ? 'updated' : 'created'} successfully!`, { id: loadingToast });
            if (onSave) onSave(response.data);
            onClose();
        } catch (error) {
            console.error(`Error ${categoryId ? 'updating' : 'creating'} category:`, error);
            toast.error(error.response?.data?.message || `Failed to ${categoryId ? 'update' : 'create'} category`, { id: loadingToast });
        }
    };

    if (!isOpen) return null;

    return (
        <>
            <div className="sidebar-overlay" onClick={onClose}></div>
            <div className="sidebar-container">
                <div className="sidebar-header">
                    <h2 className="sidebar-title">{categoryId ? 'Update Category' : 'New Category'}</h2>
                    <button className="close-btn" onClick={onClose}>
                        <X size={20} />
                    </button>
                </div>

                <div className="sidebar-content">
                    <form id="add-category-form" onSubmit={handleSubmit} className="admin-form">

                        {/* Parent Brand Dropdown */}
                        {/* <div className="form-group">
                            <label className="form-label">Parent Brand *</label>
                            <select
                                name="parentId"
                                value={formData.parentId}
                                onChange={handleChange}
                                required
                                className="form-input"
                            >
                                <option value="">Select Brand</option>
                                {brands.map(brand => (
                                    <option key={brand.id} value={brand.id}>{brand.name}</option>
                                ))}
                            </select>
                        </div> */}

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

                        {/* Image */}
                        <div className="form-group">
                            <label className="form-label">Category Image</label>
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
                    <button type="submit" form="add-category-form" className="btn-submit">
                        {categoryId ? 'Update' : 'Save'}
                    </button>
                </div>
            </div>
        </>
    );
};

export default AddCategory;
