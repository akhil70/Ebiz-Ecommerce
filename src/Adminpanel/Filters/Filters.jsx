import React, { useState } from 'react';
import { Edit2, Trash2, Filter as FilterIcon } from "lucide-react";
import '../Users/Users.css'; // Reusing Users CSS for consistency
import AddFilter from './AddFilter';
import toast from 'react-hot-toast';
import { showDeleteConfirmation } from '../../Utils/confirmActions';
import NoData from '../Components/NoData';

const StatusPill = ({ status }) => {
    const isActive = status === 1;
    const className = isActive ? 'payment-pill success' : 'payment-pill blocked';
    const text = isActive ? 'Active' : 'Inactive';
    return <span className={className}>{text}</span>;
};

const Filters = () => {
    const [isAddFilterOpen, setIsAddFilterOpen] = useState(false);
    const [editingFilterId, setEditingFilterId] = useState(null);

    // Static data as requested
    const [filterList, setFilterList] = useState([
        { id: 1, name: "Color", options: ["Red", "Blue", "White"], status: 1 },
        { id: 2, name: "Size", options: ["S", "M", "L", "XL"], status: 1 },
        { id: 3, name: "Material", options: ["Cotton", "Polyester", "Wool"], status: 1 }
    ]);

    const handleSave = (newData) => {
        if (editingFilterId) {
            setFilterList(prev => prev.map(f => f.id === editingFilterId ? { ...newData, id: editingFilterId } : f));
        } else {
            const newFilter = { ...newData, id: filterList.length + 1 };
            setFilterList(prev => [...prev, newFilter]);
        }
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
            'Are you sure you want to delete this filter?',
            () => {
                setFilterList(prev => prev.filter(f => f.id !== id));
                toast.success('Filter deleted (Static Mode)');
            }
        );
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
                            <th style={{ width: '80px' }}>ID</th>
                            <th>Filter Name</th>
                            <th>Options</th>
                            <th>Status</th>
                            <th className="dots-col">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filterList.length === 0 ? (
                            <tr>
                                <td colSpan="5" style={{ padding: "0" }}>
                                    <NoData message="No filters found. Start by adding a new one!" />
                                </td>
                            </tr>
                        ) : (
                            filterList.map(item => (
                                <tr key={item.id}>
                                    <td>#{item.id}</td>
                                    <td className="customer-name">{item.name}</td>
                                    <td>
                                        <div style={{ display: 'flex', gap: '5px', flexWrap: 'wrap' }}>
                                            {item.options.map((opt, i) => (
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
