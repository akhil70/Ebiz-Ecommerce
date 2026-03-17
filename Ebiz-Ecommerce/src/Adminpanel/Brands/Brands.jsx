import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import { Edit2, Trash2 } from "lucide-react";
import '../Users/Users.css'; // Reusing Users CSS for consistency
import AddBrand from './AddBrand';
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

const Brands = () => {
    const navigate = useNavigate();
    const [isAddBrandOpen, setIsAddBrandOpen] = useState(false);
    const [brandList, setBrandList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editingBrandId, setEditingBrandId] = useState(null);

    const fetchBrands = async () => {
        try {
            setLoading(true);
            const response = await API.get('/brands');
            setBrandList(response.data);
        } catch (error) {
            console.error("Error fetching brands:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBrands();
    }, []);

    const handleSave = () => {
        fetchBrands(); // Refresh the list from the server
        setEditingBrandId(null);
    };

    const handleEditClick = (brandId) => {
        setEditingBrandId(brandId);
        setIsAddBrandOpen(true);
    };

    const handleCloseModal = () => {
        setIsAddBrandOpen(false);
        setEditingBrandId(null);
    };

    const confirmDelete = (brandId) => {
        showDeleteConfirmation(
            'Are you sure you want to hard delete this brand?',
            () => executeDelete(brandId)
        );
    };

    const executeDelete = async (brandId) => {
        const loadingToast = toast.loading('Deleting brand...');
        try {
            await API.delete(`/brands/${brandId}/hard`);
            toast.success('Brand permanently deleted.', { id: loadingToast });
            setBrandList(prev => prev.filter(brand => brand.id !== brandId));
        } catch (error) {
            console.error("Delete Error:", error);
            toast.error(error.response?.data?.message || 'Failed to delete brand.', { id: loadingToast });
        }
    };

    const handleSoftDelete = (brandId, currentStatus) => {
        showStatusConfirmation(
            "Are you sure you want to change the status?",
            () => executeSoftDelete(brandId, currentStatus)
        );
    };

    const executeSoftDelete = async (brandId, currentStatus) => {
        const loadingToast = toast.loading('Updating status...');
        try {
            // API call as requested: DELETE /api/admin/brands/{id}/soft
            await API.delete(`/brands/${brandId}/soft`);

            toast.success('Status updated successfully.', { id: loadingToast });

            // Update local state - toggle status (1 -> 0 or 0 -> 1)
            setBrandList(prev => prev.map(brand =>
                brand.id === brandId ? { ...brand, status: brand.status === 1 ? 0 : 1 } : brand
            ));
        } catch (error) {
            console.error("Soft Delete Error:", error);
            toast.error(error.response?.data?.message || 'Failed to update status.', { id: loadingToast });
        }
    };

    return (
        <div className="recent-purchases-card">
            <AddBrand
                isOpen={isAddBrandOpen}
                onClose={handleCloseModal}
                onSave={handleSave}
                brandId={editingBrandId}
            />

            {/* Header Section */}
            <div className="card-header">
                <h2>Brand List</h2>
                <div className="header-actions">
                    <button className="action-button new-button" onClick={() => setIsAddBrandOpen(true)}>+ New Brand</button>
                </div>
            </div>

            {/* Table Section */}
            <div className="table-container">
                <table>
                    <thead>
                        <tr>
                            <th style={{ width: '80px' }}>Logo</th>
                            <th>Name</th>
                            <th>Slug </th>
                            <th>Description</th>
                            <th>Status</th>
                            <th className="dots-col"></th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr><td colSpan="6" style={{ textAlign: "center", padding: "20px" }}>Loading brands...</td></tr>
                        ) : brandList.length === 0 ? (
                            <tr>
                                <td colSpan="6" style={{ padding: "0" }}>
                                    <NoData message="No brands found." />
                                </td>
                            </tr>
                        ) : (
                            brandList.map(brand => (
                                <tr key={brand.id}>
                                    <td>
                                        {brand.logo ? (
                                            <img
                                                src={brand.logo}
                                                alt={brand.name}
                                                style={{
                                                    width: '40px',
                                                    height: '40px',
                                                    objectFit: 'contain',
                                                    borderRadius: '4px',
                                                    backgroundColor: '#f9f9f9',
                                                    border: '1px solid #eee'
                                                }}
                                                onError={(e) => {
                                                    e.target.onerror = null;
                                                    e.target.src = "https://via.placeholder.com/40?text=Error";
                                                }}
                                            />
                                        ) : (
                                            <div style={{
                                                width: '40px',
                                                height: '40px',
                                                background: '#f3f4f6',
                                                borderRadius: '4px',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                fontSize: '10px',
                                                color: '#6b7280'
                                            }}>No Logo</div>
                                        )}
                                    </td>
                                    <td className="customer-name">{brand.name}</td>
                                    <td>{brand.slug}</td>
                                    <td>{brand.description}</td>
                                    <td><StatusPill status={brand.status} /></td>
                                    <td className="dots-col">
                                        <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
                                            <label className="switch">
                                                <input
                                                    type="checkbox"
                                                    checked={brand.status === 1}
                                                    onChange={() => handleSoftDelete(brand.id, brand.status)}
                                                />
                                                <span className="slider round"></span>
                                            </label>
                                            <Edit2
                                                size={16}
                                                style={{ cursor: 'pointer', color: '#4f46e5' }}
                                                onClick={() => handleEditClick(brand.id)}
                                            />
                                            <Trash2
                                                size={16}
                                                style={{ cursor: 'pointer', color: '#ef4444' }}
                                                onClick={() => confirmDelete(brand.id)}
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
                    1 to {brandList.length} of {brandList.length}
                </div>
                <div className="pagination-buttons">
                    <button className="pagination-button prev-button">Previous</button>
                    <button className="pagination-button next-button">Next</button>
                </div>
            </div>
        </div>
    );
};

export default Brands;
