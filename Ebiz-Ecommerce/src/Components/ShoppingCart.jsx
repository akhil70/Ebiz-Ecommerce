import { useState, useEffect, useCallback } from 'react';
import './ShoppingCart.css';
import { X } from 'lucide-react';
import { Header } from '../Header';
import Footer from './Footer';
import LastFooter from './LastFooter';
import { PublicAPI, getAuthToken } from '../Utils/AxiosConfig';
import toast from 'react-hot-toast';
import {
    readGuestCart,
    setGuestItemQuantity,
    removeGuestCartItem,
} from '../Utils/guestCart';

const emptyShipping = () => ({
    fullName: '',
    streetAddress: '',
    city: '',
    state: '',
    postalCode: '',
    country: '',
});

/** Resolve product id for order payload (number if numeric string, else string). */
const toApiProductId = (raw) => {
    if (raw == null || raw === '') return null;
    const s = String(raw).trim();
    if (/^\d+$/.test(s)) return parseInt(s, 10);
    return s;
};

const resolveLineProductId = (item) => {
    if (item.productId != null && item.productId !== '') return item.productId;
    if (typeof item.id === 'string' && item.id.includes('::')) {
        return item.id.split('::')[0] || null;
    }
    return null;
};

const mapCartItem = (item) => {
    const product = item.product || item.productDetails || {};
    const size = item.selectedSize ?? item.size ?? '';
    const color = item.selectedColor ?? item.color ?? '';
    const variantParts = [size, color].filter(Boolean);
    const productId =
        item.productId ?? product.id ?? product.productId ?? null;
    return {
        id: item.id || item.cartItemId || `${productId}::${size}::${color}`,
        productId,
        name: item.name || item.productName || product.name || 'Product',
        variant:
            item.variant ||
            (variantParts.length ? variantParts.join(' / ') : ''),
        price: Number(item.price ?? item.unitPrice ?? product.price ?? 0),
        quantity: Number(item.quantity ?? item.qty ?? 1),
        image:
            item.image ||
            item.imageUrl ||
            product.thumbnail ||
            (product.images && product.images[0]) ||
            '/polo-tshirt-green.jpg',
    };
};

const mapGuestRow = (g) => {
    const parts = [g.selectedSize, g.selectedColor].filter(Boolean);
    return {
        id: g.id,
        productId: g.productId ?? null,
        name: g.name || 'Product',
        variant: parts.length ? parts.join(' / ') : '',
        price: Number(g.price) || 0,
        quantity: Number(g.quantity) || 1,
        image: g.image || '/polo-tshirt-green.jpg',
    };
};

const SHIPPING_LABELS = {
    fullName: 'Full name',
    streetAddress: 'Street address',
    city: 'City',
    state: 'State / province',
    postalCode: 'Postal code',
    country: 'Country',
};

export default function ShoppingCart() {
    const [cartItems, setCartItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [checkoutOpen, setCheckoutOpen] = useState(false);
    const [shipping, setShipping] = useState(emptyShipping);
    const [orderSubmitting, setOrderSubmitting] = useState(false);

    const loadGuestCart = useCallback(() => {
        setCartItems(readGuestCart().map(mapGuestRow));
        setError('');
    }, []);

    useEffect(() => {
        const fetchCart = async () => {
            const token = getAuthToken();
            if (!token) {
                setLoading(true);
                loadGuestCart();
                setLoading(false);
                return;
            }

            try {
                setLoading(true);
                setError('');
                const response = await PublicAPI.get('/cart');
                const data = Array.isArray(response.data)
                    ? response.data
                    : response.data?.data ?? response.data?.items ?? [];
                setCartItems(data.map(mapCartItem));
            } catch (err) {
                console.error('Error fetching cart:', err);
                setError(
                    err.response?.data?.message ||
                        err.response?.data?.error ||
                        'Failed to load cart items.'
                );
                setCartItems([]);
            } finally {
                setLoading(false);
            }
        };
        fetchCart();
    }, [loadGuestCart]);

    const refreshAuthenticatedCart = useCallback(async () => {
        if (!getAuthToken()) return;
        try {
            const response = await PublicAPI.get('/cart');
            const data = Array.isArray(response.data)
                ? response.data
                : response.data?.data ?? response.data?.items ?? [];
            setCartItems(data.map(mapCartItem));
        } catch (err) {
            console.error('Error refreshing cart:', err);
        }
    }, []);

    const openCheckoutModal = () => {
        let fullName = '';
        try {
            const raw = localStorage.getItem('user');
            if (raw) {
                const u = JSON.parse(raw);
                fullName =
                    u.name ||
                    u.username ||
                    u.preferred_username ||
                    '';
            }
        } catch {
            /* ignore */
        }
        setShipping({
            ...emptyShipping(),
            ...(fullName ? { fullName: String(fullName) } : {}),
        });
        setCheckoutOpen(true);
    };

    const closeCheckoutModal = () => {
        if (orderSubmitting) return;
        setCheckoutOpen(false);
    };

    const handleShippingChange = (field, value) => {
        setShipping((s) => ({ ...s, [field]: value }));
    };

    const handleConfirmOrder = async () => {
        const required = [
            'fullName',
            'streetAddress',
            'city',
            'state',
            'postalCode',
            'country',
        ];
        for (const key of required) {
            if (!String(shipping[key] ?? '').trim()) {
                toast.error(
                    `Please fill in ${SHIPPING_LABELS[key] || key}.`
                );
                return;
            }
        }

        const items = cartItems.map((item) => {
            const rawId = resolveLineProductId(item);
            return {
                productId: toApiProductId(rawId),
                quantity: item.quantity,
            };
        });

        if (items.some((i) => i.productId == null)) {
            toast.error('Some cart items are missing a product id. Refresh the cart or re-add items.');
            return;
        }

        const totalAmount = Number(
            cartItems
                .reduce((t, item) => t + item.price * item.quantity, 0)
                .toFixed(2)
        );
        const shippingAddress = {
            fullName: shipping.fullName.trim(),
            streetAddress: shipping.streetAddress.trim(),
            city: shipping.city.trim(),
            state: shipping.state.trim(),
            postalCode: shipping.postalCode.trim(),
            country: shipping.country.trim(),
        };

        const payload = { items, totalAmount, shippingAddress };

        try {
            setOrderSubmitting(true);
            await PublicAPI.post('/orders', payload);
            toast.success('Order placed successfully!');
            setCheckoutOpen(false);
            setShipping(emptyShipping());
            await refreshAuthenticatedCart();
        } catch (err) {
            console.error('Order failed:', err);
            toast.error(
                err.response?.data?.message ||
                    err.response?.data?.error ||
                    'Failed to place order.'
            );
        } finally {
            setOrderSubmitting(false);
        }
    };

    const updateQuantity = (id, type) => {
        setCartItems((prev) => {
            const item = prev.find((i) => i.id === id);
            if (!item) return prev;
            let newQty = item.quantity;
            if (type === 'increment') newQty += 1;
            else if (type === 'decrement' && item.quantity > 1) newQty -= 1;
            else return prev;
            if (!getAuthToken()) setGuestItemQuantity(id, newQty);
            return prev.map((i) =>
                i.id === id ? { ...i, quantity: newQty } : i
            );
        });
    };

    const removeItem = (id) => {
        setCartItems((prev) => prev.filter((item) => item.id !== id));
        if (!getAuthToken()) removeGuestCartItem(id);
    };

    const calculateSubtotal = (price, quantity) => {
        return (price * quantity).toFixed(2);
    };

    const calculateTotal = () => {
        return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0).toFixed(2);
    };

    const handleCheckout = () => {
        if (cartItems.length === 0) {
            toast.error('Your cart is empty.');
            return;
        }
        if (!getAuthToken()) {
            toast('Please sign up or log in to continue to checkout.', {
                duration: 4500,
            });
            window.setTimeout(() => {
                window.dispatchEvent(
                    new CustomEvent('ebiz:open-profile-popup')
                );
                document
                    .querySelector('.profile-nav-container')
                    ?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            }, 700);
            return;
        }
        openCheckoutModal();
    };

    return (
        <>
            <Header />
            {checkoutOpen && (
                <div
                    className="checkout-modal-overlay"
                    role="presentation"
                    onClick={closeCheckoutModal}
                >
                    <div
                        className="checkout-modal"
                        role="dialog"
                        aria-labelledby="checkout-modal-title"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="checkout-modal-header">
                            <h2 id="checkout-modal-title">Shipping address</h2>
                            <button
                                type="button"
                                className="checkout-modal-close"
                                onClick={closeCheckoutModal}
                                aria-label="Close"
                            >
                                <X size={20} />
                            </button>
                        </div>
                        <p className="checkout-modal-hint">
                            Enter your delivery details to complete your order.
                        </p>
                        <div className="checkout-form-grid">
                            <label className="checkout-field checkout-field-full">
                                <span>Full name</span>
                                <input
                                    type="text"
                                    value={shipping.fullName}
                                    onChange={(e) =>
                                        handleShippingChange('fullName', e.target.value)
                                    }
                                    placeholder="Full name"
                                    autoComplete="name"
                                />
                            </label>
                            <label className="checkout-field checkout-field-full">
                                <span>Street address</span>
                                <input
                                    type="text"
                                    value={shipping.streetAddress}
                                    onChange={(e) =>
                                        handleShippingChange(
                                            'streetAddress',
                                            e.target.value
                                        )
                                    }
                                    placeholder="Street address"
                                    autoComplete="street-address"
                                />
                            </label>
                            <label className="checkout-field">
                                <span>City</span>
                                <input
                                    type="text"
                                    value={shipping.city}
                                    onChange={(e) =>
                                        handleShippingChange('city', e.target.value)
                                    }
                                    placeholder="City"
                                    autoComplete="address-level2"
                                />
                            </label>
                            <label className="checkout-field">
                                <span>State</span>
                                <input
                                    type="text"
                                    value={shipping.state}
                                    onChange={(e) =>
                                        handleShippingChange('state', e.target.value)
                                    }
                                    placeholder="State / Province"
                                    autoComplete="address-level1"
                                />
                            </label>
                            <label className="checkout-field">
                                <span>Postal code</span>
                                <input
                                    type="text"
                                    value={shipping.postalCode}
                                    onChange={(e) =>
                                        handleShippingChange('postalCode', e.target.value)
                                    }
                                    placeholder="Postal code"
                                    autoComplete="postal-code"
                                />
                            </label>
                            <label className="checkout-field">
                                <span>Country</span>
                                <input
                                    type="text"
                                    value={shipping.country}
                                    onChange={(e) =>
                                        handleShippingChange('country', e.target.value)
                                    }
                                    placeholder="Country"
                                    autoComplete="country-name"
                                />
                            </label>
                        </div>
                        <div className="checkout-modal-footer">
                            <button
                                type="button"
                                className="checkout-confirm-btn"
                                onClick={handleConfirmOrder}
                                disabled={orderSubmitting}
                            >
                                {orderSubmitting ? 'Placing order…' : 'Confirm'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
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
                                {loading ? (
                                    <tr>
                                        <td colSpan={4} style={{ textAlign: 'center', padding: '24px', color: '#666' }}>
                                            Loading cart...
                                        </td>
                                    </tr>
                                ) : error ? (
                                    <tr>
                                        <td colSpan={4} style={{ textAlign: 'center', padding: '24px', color: '#b42318' }}>
                                            {error}
                                        </td>
                                    </tr>
                                ) : cartItems.length === 0 ? (
                                    <tr>
                                        <td colSpan={4} style={{ textAlign: 'center', padding: '24px', color: '#666' }}>
                                            Your cart is empty.
                                        </td>
                                    </tr>
                                ) : (
                                    cartItems.map((item) => (
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
                                                    {item.variant && <span className="product-variant"> - {item.variant}</span>}
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
                                    ))
                                )}
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
