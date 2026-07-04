import React, { useState, useEffect } from 'react';
import { UserCheck, Users, ShieldAlert, Check } from "lucide-react";
import '../Users/Users.css'; // Reusing Users CSS for consistency
import API from "../../Utils/AxiosConfig";
import toast from 'react-hot-toast';
import NoData from '../Components/NoData';
import { showStatusConfirmation } from '../../Utils/confirmActions';

const Sellers = () => {
    const [pendingSellers, setPendingSellers] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchPendingSellers = async () => {
        try {
            setLoading(true);
            const response = await API.get('/sellers/pending');
            // Backend returns list of pending sellers
            setPendingSellers(response.data || []);
        } catch (error) {
            console.error("Error fetching pending sellers:", error);
            toast.error(error.response?.data?.message || 'Failed to fetch pending sellers');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPendingSellers();
    }, []);

    const handleApproveClick = (id, name) => {
        showStatusConfirmation(
            `Are you sure you want to approve seller "${name}"? They will be granted active Keycloak credentials and local database access.`,
            () => executeApproval(id)
        );
    };

    const executeApproval = async (id) => {
        const loadingToast = toast.loading('Enabling seller credentials and approving account...');
        try {
            const response = await API.put(`/sellers/${id}/approve`);
            toast.success(response.data?.message || 'Seller approved successfully!', { id: loadingToast });
            // Remove approved seller from local listing
            setPendingSellers(prev => prev.filter(seller => seller.id !== id));
        } catch (error) {
            console.error("Seller approval error:", error);
            toast.error(error.response?.data?.message || 'Failed to approve seller', { id: loadingToast });
        }
    };

    return (
        <div className="recent-purchases-card">
            {/* Header Section */}
            <div className="card-header">
                <h2>
                    <Users size={20} style={{ marginRight: '10px', verticalAlign: 'middle' }} />
                    Seller Registration Approvals
                </h2>
                <div className="header-actions">
                    <button 
                        className="action-button new-button" 
                        onClick={fetchPendingSellers}
                        style={{ background: '#4f46e5' }}
                    >
                        Refresh List
                    </button>
                </div>
            </div>

            {/* Sub-Header context info */}
            <div style={{ padding: '10px 24px', backgroundColor: '#f9fafb', borderBottom: '1px solid #f3f4f6', display: 'flex', gap: '8px', alignItems: 'center' }}>
                <ShieldAlert size={16} color="#eab308" />
                <span style={{ fontSize: '13px', color: '#4b5563' }}>
                    Sellers listed below have signed up but require identity verification. Approving them activates their Keycloak account.
                </span>
            </div>

            {/* Table Section */}
            <div className="table-container">
                <table>
                    <thead>
                        <tr>
                            <th className="checkbox-col"><input type="checkbox" readOnly /></th>
                            <th>Seller Name ↓</th>
                            <th>Email ↓</th>
                            <th>Status ↓</th>
                            <th className="dots-col" style={{ textAlign: 'center' }}>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr>
                                <td colSpan="5" style={{ textAlign: "center", padding: "40px", color: '#6b7280' }}>
                                    <div className="loading-spinner" style={{ marginBottom: '10px' }}></div>
                                    Loading pending registrations...
                                </td>
                            </tr>
                        ) : pendingSellers.length === 0 ? (
                            <tr>
                                <td colSpan="5" style={{ padding: "0" }}>
                                    <NoData message="No pending seller registrations found. All active applications have been reviewed." />
                                </td>
                            </tr>
                        ) : (
                            pendingSellers.map(seller => (
                                <tr key={seller.id}>
                                    <td className="checkbox-col"><input type="checkbox" readOnly /></td>
                                    <td className="customer-name">{seller.name || 'Unnamed Seller'}</td>
                                    <td className="email-address">{seller.email}</td>
                                    <td>
                                        <span className="payment-pill pending">Pending Verification</span>
                                    </td>
                                    <td className="dots-col" style={{ textAlign: 'center' }}>
                                        <button
                                            onClick={() => handleApproveClick(seller.id, seller.name || seller.email)}
                                            style={{
                                                background: '#10b981',
                                                color: 'white',
                                                border: 'none',
                                                borderRadius: '6px',
                                                padding: '6px 12px',
                                                fontSize: '13px',
                                                fontWeight: '600',
                                                cursor: 'pointer',
                                                display: 'inline-flex',
                                                alignItems: 'center',
                                                gap: '6px',
                                                boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
                                            }}
                                        >
                                            <UserCheck size={14} />
                                            Approve
                                        </button>
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
                    Showing 1 to {pendingSellers.length} of {pendingSellers.length} pending requests
                </div>
            </div>
        </div>
    );
};

export default Sellers;
