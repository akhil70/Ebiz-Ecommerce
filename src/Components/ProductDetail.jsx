import { useState, useEffect } from 'react';
import './ProductDetail.css';
import { Search, Check } from 'lucide-react';
import { Header } from '../Header';
import Footer from './Footer';
import LastFooter from './LastFooter';
import { useNavigate, useSearchParams } from "react-router-dom";
import API, { PublicAPI } from '../Utils/AxiosConfig';

const COLOR_CODES = {
    purple: '#7c7eb8', dark: '#4a5568', green: '#7c9473', blue: '#4a90d9',
    red: '#e53e3e', white: '#f7fafc', black: '#2d3748', grey: '#718096', gray: '#718096'
};

export default function ProductDetail() {
    const [searchParams] = useSearchParams();
    const productId = searchParams.get('id');
    const navigate = useNavigate();

    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [mainImage, setMainImage] = useState('');
    const [selectedSize, setSelectedSize] = useState('');
    const [selectedColor, setSelectedColor] = useState('');
    const [quantity, setQuantity] = useState(1);

    useEffect(() => {
        if (!productId) {
            setLoading(false);
            return;
        }
        const fetchProduct = async () => {
            try {
                setLoading(true);
                const response = await API.get(`/products/${productId}`);
                const data = response.data;
                setProduct(data);
                const images = [data.thumbnail, ...(data.images || [])].filter(Boolean);
                setMainImage(images[0] || '');
                const sizeStocks = data.sizeStocks || [];
                if (sizeStocks.length > 0) setSelectedSize(sizeStocks[0].size || '');
                const attrs = data.attributes || {};
                const colorKeys = Object.keys(attrs).filter(k => /color/i.test(k));
                if (colorKeys.length > 0) setSelectedColor(attrs[colorKeys[0]] || '');
            } catch (error) {
                console.error("Error fetching product:", error);
                setProduct(null);
            } finally {
                setLoading(false);
            }
        };
        fetchProduct();
    }, [productId]);

    const thumbnails = product
        ? [product.thumbnail, ...(product.images || [])].filter(Boolean)
        : [];

    const sizes = (product?.sizeStocks || []).map(s => s.size).filter(Boolean);

    const colors = product?.attributes
        ? Object.entries(product.attributes)
            .filter(([k]) => /color/i.test(k))
            .map(([_, v]) => ({ name: String(v), code: COLOR_CODES[String(v).toLowerCase()] || '#718096' }))
        : [];

    const handleQuantityChange = (type) => {
        if (type === 'increment') setQuantity(q => q + 1);
        else if (type === 'decrement' && quantity > 1) setQuantity(q => q - 1);
    };

    const handleAddToCart = async () => {
        if (!productId) return;
        try {
            const payload = {
                productId: String(productId),
                quantity,
                selectedSize,
                selectedColor
            };
            await PublicAPI.post('/cart/add', payload);
            navigate("/cart");
        } catch (error) {
            console.error('Error adding to cart:', error);
        }
    };

    if (loading) {
        return (
            <>
                <Header />
                <div className="product-detail-container">
                    <div className="loading-state">
                        <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>⋯</div>
                        <p>Loading product...</p>
                    </div>
                </div>
                <Footer />
                <LastFooter />
            </>
        );
    }

    if (!productId || !product) {
        return (
            <>
                <Header />
                <div className="product-detail-container">
                    <div className="error-state">
                        <p>Product not found.</p>
                        <button onClick={() => navigate('/shop')}>Back to Shop</button>
                    </div>
                </div>
                <Footer />
                <LastFooter />
            </>
        );
    }

    const displayPrice = product.discountPrice > 0 ? product.discountPrice : product.price;
    const hasDiscount = product.discountPrice > 0 && product.discountPrice < product.price;

    return (
        <>
            <Header />
            <div className="product-detail-container">
                <div className="product-detail-wrapper">
                    {/* Left Side - Image Gallery */}
                    <div className="image-gallery">
                        <div className="main-image-wrapper">
                            {hasDiscount && <div className="badge">Sale</div>}
                            <button className="zoom-button">
                                <Search size={20} />
                            </button>
                            <img
                                src={mainImage || 'https://via.placeholder.com/400?text=Product'}
                                alt={product.name}
                                className="main-image"
                                onError={(e) => { e.target.src = 'https://via.placeholder.com/400?text=Product'; }}
                            />
                        </div>

                        {thumbnails.length > 1 && (
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
                        )}
                    </div>

                    {/* Right Side - Product Info */}
                    <div className="product-info">
                        {/* Breadcrumb */}
                        <div className="breadcrumb">
                            <span onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>Home</span>
                            <span className="separator">/</span>
                            <span onClick={() => navigate('/shop')} style={{ cursor: 'pointer' }}>Shop</span>
                            <span className="separator">/</span>
                            <span className="current">{product.name}</span>
                        </div>

                        <p className="category">Product</p>
                        <h1 className="product-title">{product.name}</h1>

                        <div className="price-section">
                            <span className="price-range">
                                ₹{Number(displayPrice).toFixed(2)}
                                {hasDiscount && (
                                    <span className="price-original">₹{Number(product.price).toFixed(2)}</span>
                                )}
                            </span>
                            <span className="free-shipping">& Free Shipping</span>
                        </div>

                        {product.description && (
                            <p className="product-description">{product.description}</p>
                        )}

                        {/* Size Selection */}
                        {sizes.length > 0 && (
                            <div className="size-selection">
                                <span className="section-label">Size</span>
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
                        )}

                        {/* Color Selection */}
                        {colors.length > 0 && (
                            <div className="color-selection">
                                <span className="section-label">Color</span>
                                {colors.map((color) => (
                                    <button
                                        key={color.name}
                                        className={`color-button ${selectedColor === color.name ? 'active' : ''}`}
                                        style={{ backgroundColor: color.code }}
                                        onClick={() => setSelectedColor(color.name)}
                                        title={color.name}
                                    />
                                ))}
                                <button className="clear-button" onClick={() => setSelectedColor('')}>CLEAR</button>
                            </div>
                        )}

                        {/* Price and Quantity */}
                        <div className="purchase-section">
                            <p className="current-price">₹{Number(displayPrice).toFixed(2)}</p>

                            <div className="quantity-cart">
                                <div className="quantity-selector">
                                    <button onClick={() => handleQuantityChange('decrement')}>-</button>
                                    <input type="number" value={quantity} readOnly min="1" />
                                    <button onClick={() => handleQuantityChange('increment')}>+</button>
                                </div>

                                <button className="add-to-cart-button" onClick={handleAddToCart}>
                                    ADD TO CART
                                </button>
                            </div>
                        </div>

                        {/* Product Meta */}
                        <div className="product-meta">
                            {product.sku && <p><strong>SKU:</strong> {product.sku}</p>}
                            {product.stock !== undefined && <p><strong>Stock:</strong> {product.stock}</p>}
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
