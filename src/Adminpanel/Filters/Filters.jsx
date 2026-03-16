import React, { useState, useEffect } from 'react';
import { Edit2, Trash2, Filter as FilterIcon } from "lucide-react";
import '../Users/Users.css'; // Reusing Users CSS for consistency
import AddFilter from './AddFilter';
import API from '../../Utils/AxiosConfig';
import toast from 'react-hot-toast';
import { showDeleteConfirmation, showStatusConfirmation } from '../../Utils/confirmActions';
import NoData from '../Components/NoData';

const StatusPill = ({ status }) => {
    const isActive = status === 1;
    const className = isActive ? 'payment-pill success' : 'payment-pill blocked';
    const text = isActive ? 'Active' : 'Inactive';
    return <span className={className}>{text}</span>;
};

// Map API response to UI format (filterName -> name, filterOptions -> options)
const mapApiToUi = (item) => ({
    id: item.id,
    name: item.filterName ?? item.name,
    options: item.filterOptions ?? item.options ?? [],
    status: item.status ?? 1
});

const Filters = () => {
    const [isAddFilterOpen, setIsAddFilterOpen] = useState(false);
    const [editingFilterId, setEditingFilterId] = useState(null);
    const [filterList, setFilterList] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchFilters = async () => {
        try {
            setLoading(true);
            const response = await API.get('/filters');
            const data = Array.isArray(response.data) ? response.data : response.data?.data ?? [];
            setFilterList(data.map(mapApiToUi));
        } catch (error) {
            console.error("Error fetching filters:", error);
            toast.error(error.response?.data?.message || 'Failed to fetch filters');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchFilters();
    }, []);

    const handleSave = () => {
        fetchFilters();
        setEditingFilterId(null);
    };

    const handleEditClick = (id) => {
        setEditingFilterId(id);
        setIsAddFilterOpen(true);
    };

    const handleCloseModal = () => {
        setIsAddFilterOpen(false);
        setEditingFilterId(null);
    };

    const confirmDelete = (id) => {
        showDeleteConfirmation(
            'Are you sure you want to permanently delete this filter?',
            () => executeDelete(id)
        );
    };

    const executeDelete = async (id) => {
        const loadingToast = toast.loading('Deleting filter...');
        try {
            await API.delete(`/filters/${id}/hard`);
            toast.success('Filter permanently deleted.', { id: loadingToast });
            setFilterList(prev => prev.filter(f => f.id !== id));
        } catch (error) {
            console.error("Delete Error:", error);
            toast.error(error.response?.data?.message || 'Failed to delete filter', { id: loadingToast });
        }
    };

    const handleStatusToggle = (id) => {
        showStatusConfirmation(
            "Change filter status?",
            () => executeStatusToggle(id)
        );
    };

    const executeStatusToggle = async (id) => {
        const loadingToast = toast.loading('Updating status...');
        try {
            await API.delete(`/filters/${id}/soft`);
            toast.success('Status updated successfully.', { id: loadingToast });
            setFilterList(prev => prev.map(f =>
                f.id === id ? { ...f, status: f.status === 1 ? 0 : 1 } : f
            ));
        } catch (error) {
            console.error("Status Toggle Error:", error);
            toast.error(error.response?.data?.message || 'Failed to update status', { id: loadingToast });
        }
    };

    return (
        <div className="recent-purchases-card">
            <AddFilter
                isOpen={isAddFilterOpen}
                onClose={handleCloseModal}
                onSave={handleSave}
                filterId={editingFilterId}
            />

            {/* Header Section */}
            <div className="card-header">
                <h2><FilterIcon size={20} style={{ marginRight: '10px' }} />Product Filters</h2>
                <div className="header-actions">
                    <button className="action-button new-button" onClick={() => setIsAddFilterOpen(true)}>+ New Filter</button>
                </div>
            </div>

            {/* Table Section */}
            <div className="table-container">
                <table>
                    <thead>
                        <tr>
                           
                            <th>Filter Name</th>
                            <th>Options</th>
                            <th>Status</th>
                            <th className="dots-col">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr><td colSpan="5" style={{ textAlign: "center", padding: "20px" }}>Loading filters...</td></tr>
                        ) : filterList.length === 0 ? (
                            <tr>
                                <td colSpan="5" style={{ padding: "0" }}>
                                    <NoData message="No filters found. Start by adding a new one!" />
                                </td>
                            </tr>
                        ) : (
                            filterList.map(item => (
                                <tr key={item.id}>
                                  
                                    <td className="customer-name">{item.name}</td>
                                    <td>
                                        <div style={{ display: 'flex', gap: '5px', flexWrap: 'wrap' }}>
                                            {(item.options || []).map((opt, i) => (
                                                <span
                                                    key={i}
                                                    style={{
                                                        background: '#f3f4f6',
                                                        padding: '2px 8px',
                                                        borderRadius: '12px',
                                                        fontSize: '12px',
                                                        color: '#374151'
                                                    }}
                                                >
                                                    {opt}
                                                </span>
                                            ))}
                                        </div>
                                    </td>
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

            {/* Footer Section */}
            <div className="card-footer">
                <div className="pagination-info">
                    1 to {filterList.length} of {filterList.length}
                </div>
                <div className="pagination-buttons">
                    <button className="pagination-button prev-button">Previous</button>
                    <button className="pagination-button next-button">Next</button>
                </div>
            </div>
        </div>
    );
};

export default Filters;
