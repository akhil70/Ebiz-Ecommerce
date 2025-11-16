import { useState } from 'react';
import './ShoppingCart.css';
import { X } from 'lucide-react';
import { Header } from '../Header';
import Footer from './Footer';
import LastFooter from './LastFooter';

export default function ShoppingCart() {
    const [cartItems, setCartItems] = useState([
        {
            id: 1,
            name: 'Essential Polos',
            variant: 'Medium, Purple',
            price: 80.00,
            quantity: 4,
            image: '/polo-tshirt-green.jpg'
        },
        {
            id: 2,
            name: 'Cream T-Shirt',
            variant: 'Large, Blue',
            price: 60.00,
            quantity: 1,
            image: '/polo-tshirt-green.jpg'
        }
    ]);

    const updateQuantity = (id, type) => {
        setCartItems(cartItems.map(item => {
            if (item.id === id) {
                if (type === 'increment') {
                    return { ...item, quantity: item.quantity + 1 };
                } else if (type === 'decrement' && item.quantity > 1) {
                    return { ...item, quantity: item.quantity - 1 };
                }
            }
            return item;
        }));
    };

    const removeItem = (id) => {
        setCartItems(cartItems.filter(item => item.id !== id));
    };

    const calculateSubtotal = (price, quantity) => {
        return (price * quantity).toFixed(2);
    };

    const calculateTotal = () => {
        return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0).toFixed(2);
    };

    const handleCheckout = () => {
        console.log('Proceeding to checkout with items:', cartItems);
        // Add your checkout logic here
    };

    return (
        <>
            <Header />
            <div className="cart-container">
                <div className="cart-content">
                    {/* Cart Items Table */}
                    <div className="cart-table-wrapper">
                        <table className="cart-table">
                            <thead>
                                <tr>
                                    <th>Product</th>
                                    <th>Price</th>
                                    <th>Quantity</th>
                                    <th>Subtotal</th>
                                </tr>
                            </thead>
                            <tbody>
                                {cartItems.map((item) => (
                                    <tr key={item.id}>
                                        <td className="product-cell">
                                            <button
                                                className="remove-button"
                                                onClick={() => removeItem(item.id)}
                                            >
                                                <X size={16} />
                                            </button>
                                            <img src={item.image} alt={item.name} className="product-image" />
                                            <div className="product-info">
                                                <span className="product-name">{item.name}</span>
                                                <span className="product-variant"> - {item.variant}</span>
                                            </div>
                                        </td>
                                        <td className="price-cell">₹{item.price.toFixed(2)}</td>
                                        <td className="quantity-cell">
                                            <div className="quantity-controls">
                                                <button
                                                    onClick={() => updateQuantity(item.id, 'decrement')}
                                                    className="quantity-button"
                                                >
                                                    -
                                                </button>
                                                <input
                                                    type="number"
                                                    value={item.quantity}
                                                    readOnly
                                                    className="quantity-input"
                                                />
                                                <button
                                                    onClick={() => updateQuantity(item.id, 'increment')}
                                                    className="quantity-button"
                                                >
                                                    +
                                                </button>
                                            </div>
                                        </td>
                                        <td className="subtotal-cell">₹{calculateSubtotal(item.price, item.quantity)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Cart Totals */}
                    <div className="cart-totals">
                        <h2 className="totals-title">Cart totals</h2>

                        <div className="totals-row">
                            <span className="totals-label">Subtotal</span>
                            <span className="totals-value">₹{calculateTotal()}</span>
                        </div>

                        <div className="totals-row total-row">
                            <span className="totals-label">Total</span>
                            <span className="totals-value total-value">₹{calculateTotal()}</span>
                        </div>

                        <p className="coupon-text">Have a coupon?</p>

                        <button className="checkout-button" onClick={handleCheckout}>
                            PROCEED TO CHECKOUT
                        </button>
                    </div>
                </div>
            </div>
            <Footer />
            <LastFooter />
        </>
    );
}