import { useState } from 'react';
import './ProductDetail.css';
import { Search, ChevronLeft, ChevronRight, Check } from 'lucide-react';
import { Header } from '../Header';
import Footer from './Footer';
import LastFooter from './LastFooter';
import { useNavigate } from "react-router-dom";

export default function ProductDetail() {
    const [mainImage, setMainImage] = useState('/polo-tshirt-green.jpg');
    const [selectedSize, setSelectedSize] = useState('M');
    const [selectedColor, setSelectedColor] = useState('purple');
    const [quantity, setQuantity] = useState(2);
    const navigate = useNavigate();

    const thumbnails = [
        '/polo-tshirt-green.jpg',
        '/polo-tshirt-green.jpg',
        '/polo-tshirt-green.jpg',
        '/polo-tshirt-green.jpg'
    ];

    const sizes = ['M', 'L', 'XL'];

    const colors = [
        { name: 'purple', code: '#7c7eb8' },
        { name: 'dark', code: '#4a5568' },
        { name: 'green', code: '#7c9473' }
    ];

    const handleQuantityChange = (type) => {
        if (type === 'increment') {
            setQuantity(quantity + 1);
        } else if (type === 'decrement' && quantity > 1) {
            setQuantity(quantity - 1);
        }
    };

    const handleAddToCart = () => {
        console.log('Added to cart:', { selectedSize, selectedColor, quantity });
        navigate("/cart");
        // Add your cart logic here
    };

    return (
        <>
            <Header />
            <div className="product-detail-container">
                <div className="product-detail-wrapper">
                    {/* Left Side - Image Gallery */}
                    <div className="image-gallery">
                        <div className="main-image-wrapper">
                            <button className="zoom-button">
                                <Search size={20} />
                            </button>
                            <img src={mainImage} alt="Product" className="main-image" />
                        </div>

                        <div className="thumbnails">
                            {thumbnails.map((thumb, index) => (
                                <img
                                    key={index}
                                    src={thumb}
                                    alt={`Thumbnail ${index + 1}`}
                                    className={`thumbnail ${mainImage === thumb ? 'active' : ''}`}
                                    onClick={() => setMainImage(thumb)}
                                />
                            ))}
                        </div>
                    </div>

                    {/* Right Side - Product Info */}
                    <div className="product-info">
                        {/* Breadcrumb */}
                        <div className="breadcrumb">
                            <span>Home</span>
                            <span className="separator">/</span>
                            <span>Men</span>
                            <span className="separator">/</span>
                            <span className="current">Essential Polos</span>
                        </div>

                        {/* Navigation Arrows */}
                        <div className="navigation-arrows">
                            <button className="nav-arrow">
                                <ChevronLeft size={20} />
                            </button>
                            <button className="nav-arrow">
                                <ChevronRight size={20} />
                            </button>
                        </div>

                        <p className="category">Men</p>
                        <h1 className="product-title">Essential Polos</h1>

                        <div className="price-section">
                            <span className="price-range">₹80.00 – ₹90.00</span>
                            <span className="free-shipping">& Free Shipping</span>
                        </div>

                        <p className="product-description">
                            Elevate your everyday style with our Essential Polos, the perfect blend of
                            comfort and sophistication. Crafted from premium, breathable fabric, these
                            polos offer a tailored fit that's ideal for both casual outings and smart-casual
                            settings. Designed with classic collars and subtle detailing, they bring timeless
                            appeal to your wardrobe. Available in a range of versatile colors, they pair
                            effortlessly with jeans, chinos, or shorts. Whether you're heading to the office
                            or a weekend brunch, Essential Polos keep you looking sharp and feeling
                            comfortable all day long.
                        </p>

                        {/* Size Selection */}
                        <div className="size-selection">
                            {sizes.map((size) => (
                                <button
                                    key={size}
                                    className={`size-button ${selectedSize === size ? 'active' : ''}`}
                                    onClick={() => setSelectedSize(size)}
                                >
                                    {size}
                                </button>
                            ))}
                        </div>

                        {/* Color Selection */}
                        <div className="color-selection">
                            {colors.map((color) => (
                                <button
                                    key={color.name}
                                    className={`color-button ${selectedColor === color.name ? 'active' : ''}`}
                                    style={{ backgroundColor: color.code }}
                                    onClick={() => setSelectedColor(color.name)}
                                />
                            ))}
                            <button className="clear-button">CLEAR</button>
                        </div>

                        {/* Price and Quantity */}
                        <div className="purchase-section">
                            <p className="current-price">₹80.00</p>

                            <div className="quantity-cart">
                                <div className="quantity-selector">
                                    <button onClick={() => handleQuantityChange('decrement')}>-</button>
                                    <input type="number" value={quantity} readOnly />
                                    <button onClick={() => handleQuantityChange('increment')}>+</button>
                                </div>

                                <button className="add-to-cart-button" onClick={handleAddToCart}>
                                    ADD TO CART
                                </button>
                            </div>
                        </div>

                        {/* Product Meta */}
                        <div className="product-meta">
                            <p><strong>SKU:</strong> N/A</p>
                            <p><strong>Category:</strong> Men</p>
                        </div>

                        {/* Guarantees */}
                        <div className="guarantees">
                            <p className="free-shipping-text">Free shipping on orders over $50!</p>
                            <div className="guarantee-item">
                                <Check size={16} />
                                <span>No-Risk Money Back Guarantee!</span>
                            </div>
                            <div className="guarantee-item">
                                <Check size={16} />
                                <span>No Hassle Refunds</span>
                            </div>
                            <div className="guarantee-item">
                                <Check size={16} />
                                <span>Secure Payments</span>
                            </div>
                        </div>

                        {/* Payment Methods */}
                        <div className="payment-section">
                            <p className="payment-title">Guaranteed Safe Checkout</p>
                            <div className="payment-icons">
                                <img src="/visaimg.png" alt="Visa" />
                                <img src="/mastercard.png" alt="Mastercard" />
                                <img src="/amex.png" alt="American Express" />
                                <img src="/discover.jpg" alt="Discover" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
            <LastFooter />
        </>

    );
}