import React from 'react';
import './MyOrders.css';
import { ClipboardList, Package, Truck, Clock, XCircle, MapPin } from 'lucide-react';
import { Header } from '../Header';
import SubHeader from '../SubHeader';
import Footer from './Footer';
import LastFooter from './LastFooter';

const MyOrders = () => {
    const orders = [
        {
            orderId: "#R0374915036",
            orderDate: "Thu, 17th Nov'16",
            items: [
                {
                    id: 1,
                    name: "Netting Mykonos Tunic Dress",
                    brand: "Milly Thomas",
                    size: "S",
                    qty: 1,
                    price: 1250,
                    status: "In - Transit",
                    expectedDelivery: "24 December 2016",
                    image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=1000&auto=format&fit=crop"
                },
                {
                    id: 2,
                    name: "Embroidered Sequin Mini Dress",
                    brand: "Sonia Agrawal",
                    size: "S",
                    qty: 1,
                    price: 1760,
                    status: "In - Transit",
                    expectedDelivery: "24 December 2016",
                    image: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?q=80&w=1000&auto=format&fit=crop"
                }
            ],
            total: 3010,
            paymentInfo: "Paid using credit card ending with 7343"
        }
    ];

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
                    {orders.map((order, index) => (
                        <div key={index} className="order-card">
                            <div className="order-card-header">
                                <div className="order-id-section">
                                    <span className="order-label">Order</span>
                                    <span className="order-number">{order.orderId}</span>
                                    <span className="order-date-label">Order Placed: {order.orderDate}</span>
                                </div>
                                <button className="track-order-btn">
                                    <MapPin size={16} />
                                    TRACK ORDER
                                </button>
                            </div>

                            <div className="order-items">
                                {order.items.map((item) => (
                                    <div key={item.id} className="order-item">
                                        <div className="item-image-container">
                                            <img src={item.image} alt={item.name} />
                                        </div>
                                        <div className="item-details">
                                            <div className="item-main-info">
                                                <h3>{item.name}</h3>
                                                <p className="item-brand">By: {item.brand}</p>
                                                <div className="item-params">
                                                    <span>Size: {item.size}</span>
                                                    <span>Qty: {item.qty}</span>
                                                    <span className="item-price">Rs. {item.price}</span>
                                                </div>
                                            </div>
                                            <div className="item-status-section">
                                                <div className="status-badge">
                                                    <span className="status-label">Status</span>
                                                    <span className="status-value">{item.status}</span>
                                                </div>
                                                <div className="delivery-info">
                                                    <span className="delivery-label">Delivery Expected by:</span>
                                                    <span className="delivery-date">{item.expectedDelivery}</span>
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
                                    <p>{order.paymentInfo}</p>
                                </div>
                                <div className="total-section">
                                    <span className="total-label">Rs. {order.total.toLocaleString()}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            <Footer />
            <LastFooter />
        </div>
    );
};

export default MyOrders;
