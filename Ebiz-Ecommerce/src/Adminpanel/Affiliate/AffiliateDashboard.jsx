import React, { useState, useEffect } from 'react';
import { ShoppingBag, DollarSign, Award, Link, Copy, Check, BarChart3, RefreshCw } from 'lucide-react';
import API, { PublicAPI } from '../../Utils/AxiosConfig';
import toast from 'react-hot-toast';
import NoData from '../Components/NoData';
import './AffiliateDashboard.css';

const AffiliateDashboard = () => {
    const [stats, setStats] = useState({ totalItemsSold: 0, totalRevenue: 0, salesHistory: [] });
    const [products, setProducts] = useState([]);
    const [selectedProductId, setSelectedProductId] = useState('');
    const [generatedLink, setGeneratedLink] = useState('');
    const [loading, setLoading] = useState(true);
    const [copied, setCopied] = useState(false);

    const fetchDashboardData = async () => {
        try {
            setLoading(true);
            // Fetch stats for affiliate
            const statsResponse = await PublicAPI.get('/v1/affiliate/stats');
            setStats(statsResponse.data || { totalItemsSold: 0, totalRevenue: 0, salesHistory: [] });

            // Fetch public products for link generator
            const productsResponse = await PublicAPI.get('/products');
            // Assuming response matches products schema
            const prods = productsResponse.data?.content || productsResponse.data || [];
            setProducts(prods);
            if (prods.length > 0) {
                setSelectedProductId(prods[0].id);
            }
        } catch (error) {
            console.error("Error loading affiliate dashboard:", error);
            toast.error("Failed to load dashboard statistics.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDashboardData();
    }, []);

    useEffect(() => {
        if (selectedProductId && stats.affiliateId) {
            const link = `${window.location.origin}/product?id=${selectedProductId}&affiliateId=${stats.affiliateId}`;
            setGeneratedLink(link);
        } else {
            setGeneratedLink('');
        }
    }, [selectedProductId, stats.affiliateId]);

    const handleCopyLink = () => {
        if (!generatedLink) return;
        navigator.clipboard.writeText(generatedLink);
        setCopied(true);
        toast.success("Affiliate link copied to clipboard!");
        setTimeout(() => setCopied(false), 2000);
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <div className="affiliate-dashboard">
            {/* Header */}
            <div className="dashboard-header-container">
                <div>
                    <h1 className="dashboard-title">Affiliate Portal</h1>
                    <p className="dashboard-subtitle">Monitor referrals, generate links, and track your commissions.</p>
                </div>
                <button className="refresh-btn" onClick={fetchDashboardData} disabled={loading}>
                    <RefreshCw size={16} className={loading ? 'spin' : ''} />
                    <span>Refresh Statistics</span>
                </button>
            </div>

            {loading ? (
                <div className="dashboard-loading">
                    <div className="loading-spinner"></div>
                    <p>Loading your portal stats...</p>
                </div>
            ) : (
                <>
                    {/* Stats Grid */}
                    <div className="stats-grid">
                        <div className="stat-card revenue">
                            <div className="card-top-row">
                                <span className="card-label">Referral Revenue</span>
                                <div className="icon-badge">
                                    <DollarSign size={22} />
                                </div>
                            </div>
                            <h2 className="card-value">${(stats.totalRevenue || 0).toFixed(2)}</h2>
                            <p className="card-helper">Total retail sales generated</p>
                        </div>

                        <div className="stat-card commission">
                            <div className="card-top-row">
                                <span className="card-label">Est. Commission (10%)</span>
                                <div className="icon-badge">
                                    <Award size={22} />
                                </div>
                            </div>
                            <h2 className="card-value">${((stats.totalRevenue || 0) * 0.1).toFixed(2)}</h2>
                            <p className="card-helper">Your total earned payouts</p>
                        </div>

                        <div className="stat-card items">
                            <div className="card-top-row">
                                <span className="card-label">Referred Items Sold</span>
                                <div className="icon-badge">
                                    <ShoppingBag size={22} />
                                </div>
                            </div>
                            <h2 className="card-value">{stats.totalItemsSold || 0}</h2>
                            <p className="card-helper">Successful product deliveries</p>
                        </div>
                    </div>

                    {/* Quick Link Generator */}
                    <div className="link-generator-card">
                        <div className="generator-header">
                            <Link size={20} className="header-icon" />
                            <h3>Create Affiliate Tracking Link</h3>
                        </div>
                        <p className="generator-description">
                            Select any product from the catalog below. Share this link on your social channels, blog or website to earn commission on every checkout.
                        </p>
                        
                        <div className="generator-controls">
                            <div className="select-wrapper">
                                <label htmlFor="product-select">Choose Product</label>
                                <select 
                                    id="product-select" 
                                    value={selectedProductId} 
                                    onChange={(e) => setSelectedProductId(e.target.value)}
                                >
                                    {products.length === 0 ? (
                                        <option value="">No products available</option>
                                    ) : (
                                        products.map(prod => (
                                            <option key={prod.id} value={prod.id}>
                                                {prod.name} - ${Number(prod.price || 0).toFixed(2)}
                                            </option>
                                        ))
                                    )}
                                </select>
                            </div>

                            <div className="link-display-group">
                                <label htmlFor="generated-link">Your Referral Link</label>
                                <div className="link-copy-container">
                                    <input 
                                        type="text" 
                                        id="generated-link" 
                                        value={generatedLink} 
                                        readOnly 
                                        placeholder="Generating link..."
                                    />
                                    <button 
                                        onClick={handleCopyLink}
                                        disabled={!generatedLink}
                                        className={`copy-btn ${copied ? 'copied' : ''}`}
                                    >
                                        {copied ? <Check size={18} /> : <Copy size={18} />}
                                        <span>{copied ? 'Copied' : 'Copy'}</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Sales Log */}
                    <div className="sales-history-card">
                        <div className="card-header">
                            <BarChart3 size={20} className="header-icon" />
                            <h3>Referral Sales & Activity Log</h3>
                        </div>

                        <div className="table-container">
                            <table>
                                <thead>
                                    <tr>
                                        <th>Product Details</th>
                                        <th>Order ID</th>
                                        <th>Referral Date</th>
                                        <th>Sales Value</th>
                                        <th>Commission (10%)</th>
                                        <th>Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {stats.salesHistory?.length === 0 ? (
                                        <tr>
                                            <td colSpan="6" style={{ padding: "0" }}>
                                                <NoData message="No referral sales tracked yet. Share your links to get started!" />
                                            </td>
                                        </tr>
                                    ) : (
                                        stats.salesHistory.map((sale, idx) => (
                                            <tr key={sale.orderId + '-' + idx}>
                                                <td className="product-name-cell">{sale.productName || 'Product'}</td>
                                                <td className="order-id-cell"><code>{sale.orderId?.substring(0, 12)}...</code></td>
                                                <td>{formatDate(sale.createdAt)}</td>
                                                <td className="sales-value-cell">${Number(sale.revenue || 0).toFixed(2)}</td>
                                                <td className="commission-value-cell">${Number(sale.revenue * 0.1 || 0).toFixed(2)}</td>
                                                <td>
                                                    <span className={`status-pill ${String(sale.status || 'PENDING').toLowerCase()}`}>
                                                        {sale.status || 'PENDING'}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default AffiliateDashboard;
