import React, { useState, useEffect } from 'react';
import './MyOrders.css';
import { ClipboardList, Package, Truck, Clock, XCircle, MapPin } from 'lucide-react';
import { Header } from '../Header';
import SubHeader from '../SubHeader';
import Footer from './Footer';
import LastFooter from './LastFooter';

import { PublicAPI } from '../Utils/AxiosConfig';
import toast from 'react-hot-toast';

const MyOrders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                setLoading(true);
                const response = await PublicAPI.get('/orders');
                setOrders(response.data);
                setError(null);
            } catch (err) {
                console.error('Error fetching orders:', err);
                setError(err.response?.data?.message || err.response?.data?.error || 'Failed to fetch orders');
                toast.error('Failed to load your orders.');
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, []);

    // Format date string
    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        const d = new Date(dateString);
        return d.toLocaleDateString('en-US', {
            weekday: 'short',
            day: 'numeric',
            month: 'short',
            year: 'numeric'
        });
    };

    return (
        <div className="my-orders-page">
            <Header />
            <SubHeader />
            <div className="my-orders-container">
                <div className="orders-header">
                    <h1><ClipboardList size={24} /> My Orders</h1>
                    <p>Track, manage and download invoices for your orders</p>
                </div>

                <div className="orders-list">
                    {loading ? (
                        <div style={{ textAlign: 'center', padding: '40px' }}>Loading your orders...</div>
                    ) : error ? (
                        <div style={{ textAlign: 'center', padding: '40px', color: 'red' }}>{error}</div>
                    ) : orders.length === 0 ? (
                        <div style={{ textAlign: 'center', padding: '40px' }}>You haven't placed any orders yet.</div>
                    ) : (
                        orders.map((order, index) => (
                            <div key={order.id || index} className="order-card">
                                <div className="order-card-header">
                                    <div className="order-id-section">
                                        <span className="order-label">Order</span>
                                        <span className="order-number">#{order.id?.substring(order.id.length - 8).toUpperCase() || order.id}</span>
                                        <span className="order-date-label">Order Placed: {formatDate(order.createdAt)}</span>
                                    </div>
                                    <button className="track-order-btn">
                                        <MapPin size={16} />
                                        TRACK ORDER
                                    </button>
                                </div>

                                <div className="order-items">
                                    {order.items?.map((item, itemIdx) => (
                                        <div key={itemIdx} className="order-item">
                                            <div className="item-image-container">
                                                <img src={item.image || '/polo-tshirt-green.jpg'} alt={item.productName} />
                                            </div>
                                            <div className="item-details">
                                                <div className="item-main-info">
                                                    <h3>{item.productName}</h3>
                                                    <p className="item-brand">Seller ID: {item.sellerId || 'N/A'}</p>
                                                    <div className="item-params">
                                                        <span>Qty: {item.quantity}</span>
                                                        <span className="item-price">Rs. {item.price}</span>
                                                    </div>
                                                </div>
                                                <div className="item-status-section">
                                                    <div className="status-badge">
                                                        <span className="status-label">Status</span>
                                                        <span className="status-value">{order.status}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <div className="order-card-footer">
                                    <button className="cancel-order-btn">
                                        <XCircle size={16} />
                                        CANCEL ORDER
                                    </button>
                                    <div className="footer-middle">
                                        <p>Payment upon delivery / standard terms</p>
                                    </div>
                                    <div className="total-section">
                                        <span className="total-label">Rs. {order.totalAmount ? order.totalAmount.toLocaleString() : '0'}</span>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
            <Footer />
            <LastFooter />
        </div>
    );
};

export default MyOrders;
