import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import { Edit2, Trash2 } from "lucide-react";
import '../Users/Users.css'; // Reusing Users CSS for consistency
import AddCategory from './AddCategory';
import API from "../../Utils/AxiosConfig";
import toast from 'react-hot-toast';
import { showDeleteConfirmation, showStatusConfirmation } from '../../Utils/confirmActions';
import NoData from '../Components/NoData';

const StatusPill = ({ status }) => {
    // Handling 1 as Active, 0 as Inactive (or any non-1 as Inactive)
    const isActive = status === 1;
    const className = isActive ? 'payment-pill success' : 'payment-pill blocked';
    const text = isActive ? 'Active' : 'Inactive';
    return <span className={className}>{text}</span>;
};

const Category = () => {
    const navigate = useNavigate();
    const [isAddCategoryOpen, setIsAddCategoryOpen] = useState(false);
    const [categoryList, setCategoryList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editingCategoryId, setEditingCategoryId] = useState(null);

    const fetchCategories = async () => {
        try {
            setLoading(true);
            const response = await API.get('/categories');
            setCategoryList(response.data);
        } catch (error) {
            console.error("Error fetching categories:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    const handleSave = () => {
        fetchCategories();
        setEditingCategoryId(null);
    };

    const handleEditClick = (id) => {
        setEditingCategoryId(id);
        setIsAddCategoryOpen(true);
    };

    const handleCloseModal = () => {
        setIsAddCategoryOpen(false);
        setEditingCategoryId(null);
    };

    const confirmDelete = (id) => {
        showDeleteConfirmation(
            'Are you sure you want to hard delete this category?',
            () => executeDelete(id)
        );
    };

    const executeDelete = async (id) => {
        const loadingToast = toast.loading('Deleting category...');
        try {
            await API.delete(`/categories/${id}/hard`);
            toast.success('Category permanently deleted.', { id: loadingToast });
            setCategoryList(prev => prev.filter(cat => cat.id !== id));
        } catch (error) {
            console.error("Delete Error:", error);
            toast.error(error.response?.data?.message || 'Failed to delete category.', { id: loadingToast });
        }
    };

    const handleStatusToggle = (id, currentStatus) => {
        showStatusConfirmation(
            "Are you sure you want to change the status?",
            () => executeStatusToggle(id)
        );
    };

    const executeStatusToggle = async (id) => {
        const loadingToast = toast.loading('Updating status...');
        try {
            await API.delete(`/categories/${id}/soft`);
            toast.success('Status updated successfully.', { id: loadingToast });
            setCategoryList(prev => prev.map(cat =>
                cat.id === id ? { ...cat, status: cat.status === 1 ? 0 : 1 } : cat
            ));
        } catch (error) {
            console.error("Status Toggle Error:", error);
            toast.error(error.response?.data?.message || 'Failed to update status.', { id: loadingToast });
        }
    };

    return (
        <div className="recent-purchases-card">
            <AddCategory
                isOpen={isAddCategoryOpen}
                onClose={handleCloseModal}
                onSave={handleSave}
                categoryId={editingCategoryId}
            />

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
                            <th style={{ width: '80px' }}>Image</th>
                            <th>Name</th>
                            <th>Slug</th>
                            <th>Description</th>
                            <th>Status</th>
                            <th className="dots-col">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr><td colSpan="6" style={{ textAlign: "center", padding: "20px" }}>Loading categories...</td></tr>
                        ) : categoryList.length === 0 ? (
                            <tr>
                                <td colSpan="6" style={{ padding: "0" }}>
                                    <NoData message="No categories found. Start by adding a new one!" />
                                </td>
                            </tr>
                        ) : (
                            categoryList.map(cat => (
                                <tr key={cat.id}>
                                    <td>
                                        {cat.image ? (
                                            <img
                                                src={cat.image}
                                                alt={cat.name}
                                                style={{ width: '40px', height: '40px', objectFit: 'contain', borderRadius: '4px' }}
                                            />
                                        ) : (
                                            <div style={{ width: '40px', height: '40px', background: '#f3f4f6', borderRadius: '4px' }}></div>
                                        )}
                                    </td>
                                    <td className="customer-name">{cat.name}</td>
                                    <td>{cat.slug}</td>
                                    <td>{cat.description}</td>
                                    <td><StatusPill status={cat.status} /></td>
                                    <td className="dots-col">
                                        <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
                                            <label className="switch">
                                                <input
                                                    type="checkbox"
                                                    checked={cat.status === 1}
                                                    onChange={() => handleStatusToggle(cat.id, cat.status)}
                                                />
                                                <span className="slider round"></span>
                                            </label>
                                            <Edit2
                                                size={16}
                                                style={{ cursor: 'pointer', color: '#4f46e5' }}
                                                onClick={() => handleEditClick(cat.id)}
                                            />
                                            <Trash2
                                                size={16}
                                                style={{ cursor: 'pointer', color: '#ef4444' }}
                                                onClick={() => confirmDelete(cat.id)}
                                            />
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
                    1 to {categoryList.length} of {categoryList.length}
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
