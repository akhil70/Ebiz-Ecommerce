import React, { useState, useEffect } from 'react';
import { UserCheck, Users, ShieldAlert, Check } from "lucide-react";
import './Users.css'; // Reusing Users CSS for visual coherence

import API from "../../Utils/AxiosConfig";
import toast from 'react-hot-toast';
import NoData from '../Components/NoData';
import { showStatusConfirmation } from '../../Utils/confirmActions';

const Approvals = () => {
    const [pendingUsers, setPendingUsers] = useState([]);
    const [approvedSellers, setApprovedSellers] = useState([]);
    const [approvedAffiliates, setApprovedAffiliates] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('PENDING_SELLER'); // 'PENDING_SELLER', 'APPROVED_SELLER', 'PENDING_AFFILIATE', 'APPROVED_AFFILIATE'

    const fetchApprovalsData = async () => {
        try {
            setLoading(true);
            const pendingResponse = await API.get('/approvals/pending');
            setPendingUsers(pendingResponse.data || []);

            const approvedResponse = await API.get('/approvals/approved/sellers');
            setApprovedSellers(approvedResponse.data || []);

            const approvedAffResponse = await API.get('/approvals/approved/affiliates');
            setApprovedAffiliates(approvedAffResponse.data || []);
        } catch (error) {
            console.error("Error fetching approvals:", error);
            toast.error(error.response?.data?.message || 'Failed to fetch approvals');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchApprovalsData();
    }, []);

    const handleApproveClick = (id, name, role) => {
        const roleLabel = role.toLowerCase();
        showStatusConfirmation(
            `Are you sure you want to approve ${roleLabel} "${name}"? A temporary login password will be automatically generated and sent to their email.`,
            () => executeApproval(id)
        );
    };

    const executeApproval = async (id) => {
        const loadingToast = toast.loading('Generating credentials and sending approval email...');
        try {
            const response = await API.put(`/approvals/${id}/approve`);
            toast.success(response.data?.message || 'User approved successfully!', { id: loadingToast });
            
            // Find approved user and move them from pending to approved
            const approvedUser = pendingUsers.find(user => user.id === id);
            setPendingUsers(prev => prev.filter(user => user.id !== id));
            if (approvedUser) {
                if (approvedUser.role === 'SELLER') {
                    setApprovedSellers(prev => [...prev, { ...approvedUser, isActive: true }]);
                } else if (approvedUser.role === 'AFFILIATE') {
                    setApprovedAffiliates(prev => [...prev, { ...approvedUser, isActive: true }]);
                }
            }
        } catch (error) {
            console.error("User approval error:", error);
            toast.error(error.response?.data?.message || 'Failed to approve user', { id: loadingToast });
        }
    };


    const filteredUsers = 
        activeTab === 'PENDING_SELLER' ? pendingUsers.filter(user => user.role === 'SELLER') :
        activeTab === 'PENDING_AFFILIATE' ? pendingUsers.filter(user => user.role === 'AFFILIATE') :
        activeTab === 'APPROVED_SELLER' ? approvedSellers :
        approvedAffiliates; // APPROVED_AFFILIATE

    const pendingSellersCount = pendingUsers.filter(user => user.role === 'SELLER').length;
    const approvedSellersCount = approvedSellers.length;
    const pendingAffiliatesCount = pendingUsers.filter(user => user.role === 'AFFILIATE').length;
    const approvedAffiliatesCount = approvedAffiliates.length;

    const isPendingTab = activeTab.startsWith('PENDING');

    return (
        <div className="recent-purchases-card">
            {/* Header Section */}
            <div className="card-header" style={{ borderBottom: 'none', paddingBottom: '0' }}>
                <h2>
                    <Users size={20} style={{ marginRight: '10px', verticalAlign: 'middle' }} />
                    Partnership Approvals
                </h2>
                <div className="header-actions">
                    <button
                        className="action-button new-button"
                        onClick={fetchApprovalsData}
                        style={{ background: '#4f46e5' }}
                    >
                        Refresh List
                    </button>
                </div>
            </div>

            {/* Premium Tabbed Navigation */}
            <div style={{ display: 'flex', borderBottom: '1px solid #e5e7eb', padding: '0 24px', backgroundColor: '#fff', gap: '20px', flexWrap: 'wrap' }}>
                <button
                    onClick={() => setActiveTab('PENDING_SELLER')}
                    style={{
                        padding: '12px 6px',
                        fontSize: '14px',
                        fontWeight: '600',
                        color: activeTab === 'PENDING_SELLER' ? '#4f46e5' : '#6b7280',
                        border: 'none',
                        borderBottom: activeTab === 'PENDING_SELLER' ? '2px solid #4f46e5' : '2px solid transparent',
                        background: 'none',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px'
                    }}
                >
                    Pending Sellers
                    <span style={{
                        backgroundColor: activeTab === 'PENDING_SELLER' ? '#e0e7ff' : '#f3f4f6',
                        color: activeTab === 'PENDING_SELLER' ? '#4f46e5' : '#4b5563',
                        padding: '2px 8px',
                        borderRadius: '12px',
                        fontSize: '11px'
                    }}>{pendingSellersCount}</span>
                </button>

                <button
                    onClick={() => setActiveTab('APPROVED_SELLER')}
                    style={{
                        padding: '12px 6px',
                        fontSize: '14px',
                        fontWeight: '600',
                        color: activeTab === 'APPROVED_SELLER' ? '#4f46e5' : '#6b7280',
                        border: 'none',
                        borderBottom: activeTab === 'APPROVED_SELLER' ? '2px solid #4f46e5' : '2px solid transparent',
                        background: 'none',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px'
                    }}
                >
                    Approved Sellers
                    <span style={{
                        backgroundColor: activeTab === 'APPROVED_SELLER' ? '#e0e7ff' : '#f3f4f6',
                        color: activeTab === 'APPROVED_SELLER' ? '#4f46e5' : '#4b5563',
                        padding: '2px 8px',
                        borderRadius: '12px',
                        fontSize: '11px'
                    }}>{approvedSellersCount}</span>
                </button>

                <button
                    onClick={() => setActiveTab('PENDING_AFFILIATE')}
                    style={{
                        padding: '12px 6px',
                        fontSize: '14px',
                        fontWeight: '600',
                        color: activeTab === 'PENDING_AFFILIATE' ? '#4f46e5' : '#6b7280',
                        border: 'none',
                        borderBottom: activeTab === 'PENDING_AFFILIATE' ? '2px solid #4f46e5' : '2px solid transparent',
                        background: 'none',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px'
                    }}
                >
                    Pending Affiliates
                    <span style={{
                        backgroundColor: activeTab === 'PENDING_AFFILIATE' ? '#e0e7ff' : '#f3f4f6',
                        color: activeTab === 'PENDING_AFFILIATE' ? '#4f46e5' : '#4b5563',
                        padding: '2px 8px',
                        borderRadius: '12px',
                        fontSize: '11px'
                    }}>{pendingAffiliatesCount}</span>
                </button>

                <button
                    onClick={() => setActiveTab('APPROVED_AFFILIATE')}
                    style={{
                        padding: '12px 6px',
                        fontSize: '14px',
                        fontWeight: '600',
                        color: activeTab === 'APPROVED_AFFILIATE' ? '#4f46e5' : '#6b7280',
                        border: 'none',
                        borderBottom: activeTab === 'APPROVED_AFFILIATE' ? '2px solid #4f46e5' : '2px solid transparent',
                        background: 'none',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px'
                    }}
                >
                    Approved Affiliates
                    <span style={{
                        backgroundColor: activeTab === 'APPROVED_AFFILIATE' ? '#e0e7ff' : '#f3f4f6',
                        color: activeTab === 'APPROVED_AFFILIATE' ? '#4f46e5' : '#4b5563',
                        padding: '2px 8px',
                        borderRadius: '12px',
                        fontSize: '11px'
                    }}>{approvedAffiliatesCount}</span>
                </button>
            </div>

            {/* Sub-Header Context Message */}
            <div style={{ padding: '12px 24px', backgroundColor: '#f9fafb', borderBottom: '1px solid #f3f4f6', display: 'flex', gap: '8px', alignItems: 'center' }}>
                <ShieldAlert size={16} color="#eab308" />
                <span style={{ fontSize: '13px', color: '#4b5563' }}>
                    {activeTab === 'PENDING_SELLER' && 'Sellers who have verified their email and are awaiting approval.'}
                    {activeTab === 'APPROVED_SELLER' && 'Active approved sellers who can create and manage their store products.'}
                    {activeTab === 'PENDING_AFFILIATE' && 'Affiliates who have verified their email and are awaiting approval.'}
                    {activeTab === 'APPROVED_AFFILIATE' && 'Active approved affiliates who can create product links and track referrals.'}
                </span>
            </div>

            {/* Table Section */}
            <div className="table-container">
                <table>
                    <thead>
                        <tr>
                            <th className="checkbox-col"><input type="checkbox" readOnly /></th>
                            <th>{isPendingTab ? 'Applicant Name' : 'Partner Name'}</th>
                            <th>Email Address</th>
                            <th>Role Category</th>
                            <th className="dots-col" style={{ textAlign: 'center' }}>
                                {isPendingTab ? 'Action' : 'Status'}
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr>
                                <td colSpan="5" style={{ textAlign: "center", padding: "40px", color: '#6b7280' }}>
                                    <div className="loading-spinner" style={{ marginBottom: '10px' }}></div>
                                    Loading approvals list...
                                </td>
                            </tr>
                        ) : filteredUsers.length === 0 ? (
                            <tr>
                                <td colSpan="5" style={{ padding: "0" }}>
                                    <NoData message={`No records found in this category.`} />
                                </td>
                            </tr>
                        ) : (
                            filteredUsers.map(user => (
                                <tr key={user.id}>
                                    <td className="checkbox-col"><input type="checkbox" readOnly /></td>
                                    <td className="customer-name">{user.name || 'Unnamed Partner'}</td>
                                    <td className="email-address">{user.email}</td>
                                    <td>
                                        <span className="payment-pill active" style={{ textTransform: 'capitalize' }}>
                                            {user.role.toLowerCase()}
                                        </span>
                                    </td>
                                    <td className="dots-col" style={{ textAlign: 'center' }}>
                                        {isPendingTab ? (
                                            <button
                                                onClick={() => handleApproveClick(user.id, user.name || user.email, user.role)}
                                                style={{
                                                    background: '#10b981',
                                                    color: 'white',
                                                    border: 'none',
                                                    borderRadius: '6px',
                                                    padding: '6px 14px',
                                                    fontSize: '13px',
                                                    fontWeight: '600',
                                                    cursor: 'pointer',
                                                    display: 'inline-flex',
                                                    alignItems: 'center',
                                                    gap: '6px',
                                                    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                                                    transition: 'all 0.2s'
                                                }}
                                                onMouseOver={(e) => e.currentTarget.style.filter = 'brightness(1.05)'}
                                                onMouseOut={(e) => e.currentTarget.style.filter = 'none'}
                                            >
                                                <UserCheck size={14} />
                                                Approve User
                                            </button>
                                        ) : (
                                            <span className="payment-pill success" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                                                <Check size={12} /> Active
                                            </span>
                                        )}
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
                    Showing 1 to {filteredUsers.length} of {filteredUsers.length} request(s)
                </div>
            </div>
        </div>
    );
};

export default Approvals;


