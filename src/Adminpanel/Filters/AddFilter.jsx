import React, { useState, useEffect } from "react";
import { X, Plus, Trash2 } from "lucide-react";
import "../AdminForm.css";
import toast from 'react-hot-toast';

const AddFilter = ({ isOpen, onClose, onSave, filterId }) => {
    const [formData, setFormData] = useState({
        name: "",
        options: [""], // Initial single input for filter options
        status: 1,
    });

    // Reset form when opened
    useEffect(() => {
        if (isOpen) {
            if (filterId) {
                // Static data for editing simulation
                const staticData = {
                    1: { name: "Color", options: ["Red", "Blue", "White"], status: 1 },
                    2: { name: "Size", options: ["S", "M", "L", "XL"], status: 1 }
                };
                const data = staticData[filterId] || { name: "", options: [""], status: 1 };
                setFormData(data);
            } else {
                setFormData({
                    name: "",
                    options: [""],
                    status: 1,
                });
            }
        }
    }, [isOpen, filterId]);

    const handleNameChange = (e) => {
        setFormData({ ...formData, name: e.target.value });
    };

    const handleOptionChange = (index, value) => {
        const newOptions = [...formData.options];
        newOptions[index] = value;
        setFormData({ ...formData, options: newOptions });
    };

    const addOptionField = () => {
        setFormData({ ...formData, options: [...formData.options, ""] });
    };

    const removeOptionField = (index) => {
        if (formData.options.length > 1) {
            const newOptions = formData.options.filter((_, i) => i !== index);
            setFormData({ ...formData, options: newOptions });
        } else {
            toast.error("At least one option is required");
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        // Basic validation
        if (!formData.name.trim()) {
            toast.error("Filter name is required");
            return;
        }
        if (formData.options.some(opt => !opt.trim())) {
            toast.error("All options must be filled");
            return;
        }

        const actionText = filterId ? 'Updating' : 'Creating';
        const loadingToast = toast.loading(`${actionText} filter...`);

        // Simulate API call
        setTimeout(() => {
            toast.success(`Filter ${filterId ? 'updated' : 'created'} successfully! (Static Mode)`, { id: loadingToast });
            if (onSave) onSave(formData);
            onClose();
        }, 800);
    };

    if (!isOpen) return null;

    return (
        <>
            <div className="sidebar-overlay" onClick={onClose}></div>
            <div className="sidebar-container">
                <div className="sidebar-header">
                    <h2 className="sidebar-title">{filterId ? 'Update Filter' : 'New Filter'}</h2>
                    <button className="close-btn" onClick={onClose}>
                        <X size={20} />
                    </button>
                </div>

                <div className="sidebar-content">
                    <form id="add-filter-form" onSubmit={handleSubmit} className="admin-form">

                        {/* Filter Name */}
                        <div className="form-group">
                            <label className="form-label">Filter Name *</label>
                            <input
                                type="text"
                                name="name"
                                placeholder="e.g. Color, Size, Material"
                                value={formData.name}
                                onChange={handleNameChange}
                                required
                                className="form-input"
                            />
                        </div>

                        {/* Filter Options */}
                        <div className="form-group">
                            <label className="form-label">Filter Options *</label>
                            {formData.options.map((option, index) => (
                                <div key={index} style={{ display: 'flex', gap: '8px', marginBottom: '10px', alignItems: 'center' }}>
                                    <input
                                        type="text"
                                        placeholder={`Option ${index + 1}`}
                                        value={option}
                                        onChange={(e) => handleOptionChange(index, e.target.value)}
                                        required
                                        className="form-input"
                                        style={{ marginBottom: 0 }}
                                    />
                                    {index === formData.options.length - 1 ? (
                                        <button
                                            type="button"
                                            onClick={addOptionField}
                                            style={{
                                                background: '#4f46e5',
                                                color: 'white',
                                                border: 'none',
                                                borderRadius: '4px',
                                                padding: '8px',
                                                cursor: 'pointer',
                                                display: 'flex',
                                                alignItems: 'center'
                                            }}
                                        >
                                            <Plus size={18} />
                                        </button>
                                    ) : (
                                        <button
                                            type="button"
                                            onClick={() => removeOptionField(index)}
                                            style={{
                                                background: '#ef4444',
                                                color: 'white',
                                                border: 'none',
                                                borderRadius: '4px',
                                                padding: '8px',
                                                cursor: 'pointer',
                                                display: 'flex',
                                                alignItems: 'center'
                                            }}
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    )}
                                </div>
                            ))}
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
                    <button type="submit" form="add-filter-form" className="btn-submit">
                        {filterId ? 'Update' : 'Save'}
                    </button>
                </div>
            </div>
        </>
    );
};

export default AddFilter;
