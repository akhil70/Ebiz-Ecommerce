import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import { Edit2, Trash2 } from "lucide-react";
import '../Users/Users.css'; // Reusing Users CSS for consistency
import AddProduct from './AddProduct';
import API from "../../Utils/AxiosConfig";
import toast from 'react-hot-toast';
import { showDeleteConfirmation, showStatusConfirmation } from '../../Utils/confirmActions';
import NoData from '../Components/NoData';

const StatusPill = ({ status }) => {
    const isActive = status === 1;
    const className = isActive ? 'payment-pill success' : 'payment-pill blocked';
    const text = isActive ? 'Active' : 'Inactive';
    return <span className={className}>{text}</span>;
};

const Products = () => {
    const navigate = useNavigate();
    const [isAddOpen, setIsAddOpen] = useState(false);
    const [productList, setProductList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editingId, setEditingId] = useState(null);

    const fetchProducts = async () => {
        try {
            setLoading(true);
            const response = await API.get('/products');
            setProductList(response.data);
        } catch (error) {
            console.error("Error fetching products:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    const handleSave = () => {
        fetchProducts();
        setEditingId(null);
    };

    const handleEditClick = (id) => {
        setEditingId(id);
        setIsAddOpen(true);
    };

    const handleCloseModal = () => {
        setIsAddOpen(false);
        setEditingId(null);
    };

    const confirmDelete = (id) => {
        showDeleteConfirmation(
            'Are you sure you want to permanently delete this product?',
            () => executeDelete(id)
        );
    };

    const executeDelete = async (id) => {
        const loadingToast = toast.loading('Deleting product...');
        try {
            await API.delete(`/products/${id}/hard`);
            toast.success('Product permanently deleted.', { id: loadingToast });
            setProductList(prev => prev.filter(item => item.id !== id));
        } catch (error) {
            console.error("Delete Error:", error);
            toast.error(error.response?.data?.message || 'Failed to delete product', { id: loadingToast });
        }
    };

    const handleStatusToggle = (id) => {
        showStatusConfirmation(
            "Change product status?",
            () => executeStatusToggle(id)
        );
    };

    const executeStatusToggle = async (id) => {
        const loadingToast = toast.loading('Updating status...');
        try {
            await API.delete(`/products/${id}/soft`);
            toast.success('Status updated successfully.', { id: loadingToast });
            setProductList(prev => prev.map(item =>
                item.id === id ? { ...item, status: item.status === 1 ? 0 : 1 } : item
            ));
        } catch (error) {
            console.error("Status Toggle Error:", error);
            toast.error(error.response?.data?.message || 'Failed to update status', { id: loadingToast });
        }
    };

    return (
        <div className="recent-purchases-card">
            <AddProduct
                isOpen={isAddOpen}
                onClose={handleCloseModal}
                onSave={handleSave}
                productId={editingId}
            />

            <div className="card-header">
                <h2>Product List</h2>
                <div className="header-actions">
                    <button className="action-button new-button" onClick={() => setIsAddOpen(true)}>+ New Product</button>
                </div>
            </div>

            <div className="table-container">
                <table>
                    <thead>
                        <tr>
                            <th style={{ width: '80px' }}>Image</th>
                            <th>Name</th>
                            <th>Sku</th>
                            <th>Price</th>
                            <th>Stock</th>
                            <th>Status</th>
                            <th className="dots-col">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr><td colSpan="7" style={{ textAlign: "center", padding: "20px" }}>Loading products...</td></tr>
                        ) : productList.length === 0 ? (
                            <tr>
                                <td colSpan="7" style={{ padding: "0" }}>
                                    <NoData message="No products found." />
                                </td>
                            </tr>
                        ) : (
                            productList.map(item => (
                                <tr key={item.id}>
                                    <td>
                                        {item.thumbnail ? (
                                            <img
                                                src={item.thumbnail}
                                                alt={item.name}
                                                style={{ width: '40px', height: '40px', objectFit: 'contain', borderRadius: '4px' }}
                                            />
                                        ) : (
                                            <div style={{ width: '40px', height: '40px', background: '#f3f4f6', borderRadius: '4px' }}></div>
                                        )}
                                    </td>
                                    <td className="customer-name">{item.name}</td>
                                    <td>{item.sku || 'N/A'}</td>
                                    <td>{item.price}</td>
                                    <td>{item.stock}</td>
                                    <td><StatusPill status={item.status} /></td>
                                    <td className="dots-col">
                                        <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
                                            <label className="switch">
                                                <input
                                                    type="checkbox"
                                                    checked={item.status === 1}
                                                    onChange={() => handleStatusToggle(item.id)}
                                                />
                                                <span className="slider round"></span>
                                            </label>
                                            <Edit2
                                                size={16}
                                                style={{ cursor: 'pointer', color: '#4f46e5' }}
                                                onClick={() => handleEditClick(item.id)}
                                            />
                                            <Trash2
                                                size={16}
                                                style={{ cursor: 'pointer', color: '#ef4444' }}
                                                onClick={() => confirmDelete(item.id)}
                                            />
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            <div className="card-footer">
                <div className="pagination-info">
                    1 to {productList.length} of {productList.length}
                </div>
                <div className="pagination-buttons">
                    <button className="pagination-button prev-button">Previous</button>
                    <button className="pagination-button next-button">Next</button>
                </div>
            </div>
        </div>
    );
};

export default Products;
