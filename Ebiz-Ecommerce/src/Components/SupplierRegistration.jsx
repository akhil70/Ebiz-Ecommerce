import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, ShieldCheck, Banknote, Globe, BarChart3, HelpCircle, ArrowLeft, User, CheckCircle } from 'lucide-react';
import { Header } from '../Header';
import Footer from './Footer';
import LastFooter from './LastFooter';
import './SupplierRegistration.css';
import { PublicAPI } from '../Utils/AxiosConfig';
import toast from 'react-hot-toast';

const SupplierRegistration = () => {
    const [email, setEmail] = useState('');
    const [name, setName] = useState('');
    const [otp, setOtp] = useState('');
    const [otpSent, setOtpSent] = useState(false);
    const [sendingOtp, setSendingOtp] = useState(false);
    const [verifying, setVerifying] = useState(false);
    const [success, setSuccess] = useState(false);
    const navigate = useNavigate();

    const handleSendOtp = async () => {
        if (!email.trim() || !email.includes('@')) {
            toast.error('Please enter a valid email address');
            return;
        }

        setSendingOtp(true);
        const loadToast = toast.loading('Sending verification OTP...');
        try {
            await PublicAPI.post('/auth/signup/send-otp', { email: email.trim() });
            setOtpSent(true);
            toast.success('Verification code sent to your email!', { id: loadToast });
        } catch (error) {
            console.error("Error sending OTP:", error);
            toast.error(error.response?.data?.message || 'Failed to send OTP. Please try again.', { id: loadToast });
        } finally {
            setSendingOtp(false);
        }
    };

    const handleCreateAccount = async () => {
        if (!name.trim()) {
            toast.error('Full Name is required');
            return;
        }
        if (!email.trim()) {
            toast.error('Email is required');
            return;
        }
        if (!otp.trim()) {
            toast.error('Verification OTP is required');
            return;
        }

        setVerifying(true);
        const loadToast = toast.loading('Submitting registration details...');
        try {
            await PublicAPI.post('/auth/signup/verify-otp-temporary', {
                email: email.trim(),
                otp: otp.trim(),
                name: name.trim(),
                role: 'SELLER'
            });
            setSuccess(true);
            toast.success('Registration request submitted!', { id: loadToast });
        } catch (error) {
            console.error("Error verifying registration:", error);
            toast.error(error.response?.data?.message || 'Failed to verify registration. Check OTP.', { id: loadToast });
        } finally {
            setVerifying(false);
        }
    };

    return (
        <div className="supplier-reg-page">
            <Header />
            <div className="reg-main-content">
                <div className="reg-top-bar">
                    <p>Already a user?</p>
                    <button className="login-nav-btn" onClick={() => navigate('/login')}>Login</button>
                </div>
                <div className="reg-container">
                    {/* Left Section: Form */}
                    <div className="form-section">
                        <button className="back-btn" onClick={() => navigate('/supplier')}>
                            <ArrowLeft size={18} />
                            <span>Back</span>
                        </button>
                        
                        {success ? (
                            <div className="success-reg-message" style={{ textAlign: 'center', padding: '40px 20px' }}>
                                <CheckCircle size={64} color="#10b981" style={{ margin: '0 auto 20px auto' }} />
                                <h2 style={{ fontSize: '24px', fontWeight: '700', color: '#111827', marginBottom: '12px' }}>Registration Submitted!</h2>
                                <p style={{ color: '#4b5563', fontSize: '15px', lineHeight: '1.6', marginBottom: '24px' }}>
                                    Thank you, <strong>{name}</strong>. Your email <strong>{email}</strong> has been successfully verified.<br />
                                    Your application is now pending administrative approval.<br />
                                    Once approved, a temporary login password will be emailed to you.
                                </p>
                                <button className="create-account-btn" onClick={() => navigate('/')} style={{ maxWidth: '200px', margin: '0 auto' }}>
                                    Go to Homepage
                                </button>
                            </div>
                        ) : (
                            <>
                                <div className="form-header">
                                    <h2>Welcome to Ebizz</h2>
                                    <p>Create your account to start selling and reach millions of customers.</p>
                                </div>

                                <div className="form-body">
                                    <div className="input-group" style={{ marginBottom: '20px' }}>
                                        <label htmlFor="name">Full Name</label>
                                        <div className="input-wrapper">
                                            <User className="input-icon" size={18} />
                                            <input 
                                                type="text" 
                                                id="name" 
                                                placeholder="Enter your full name" 
                                                value={name}
                                                onChange={(e) => setName(e.target.value)}
                                            />
                                        </div>
                                    </div>

                                    <div className="input-group" style={{ marginBottom: '20px' }}>
                                        <label htmlFor="email">Enter Email Address</label>
                                        <div className="input-wrapper">
                                            <Mail className="input-icon" size={18} />
                                            <input 
                                                type="email" 
                                                id="email" 
                                                placeholder="example@email.com" 
                                                value={email}
                                                disabled={otpSent}
                                                onChange={(e) => setEmail(e.target.value)}
                                            />
                                            <button 
                                                className="send-otp-btn" 
                                                onClick={handleSendOtp}
                                                disabled={sendingOtp || otpSent}
                                            >
                                                {sendingOtp ? 'Sending...' : otpSent ? 'Sent' : 'Send OTP'}
                                            </button>
                                        </div>
                                    </div>

                                    {otpSent && (
                                        <div className="input-group" style={{ marginBottom: '25px', animation: 'fadeIn 0.3s ease-in-out' }}>
                                            <label htmlFor="otp">Enter OTP</label>
                                            <div className="input-wrapper">
                                                <ShieldCheck className="input-icon" size={18} />
                                                <input 
                                                    type="text" 
                                                    id="otp" 
                                                    placeholder="Enter 6-digit OTP" 
                                                    value={otp}
                                                    onChange={(e) => setOtp(e.target.value)}
                                                />
                                            </div>
                                        </div>
                                    )}

                                    <button 
                                        className="create-account-btn" 
                                        onClick={handleCreateAccount}
                                        disabled={verifying || !otpSent}
                                        style={{ opacity: !otpSent ? 0.6 : 1, cursor: !otpSent ? 'not-allowed' : 'pointer' }}
                                    >
                                        {verifying ? 'Submitting...' : 'Register as Seller'}
                                    </button>
                                    
                                    <p className="privacy-text" style={{ marginTop: '20px' }}>
                                        By clicking you agree to our <span>Terms & Conditions</span> and <span>Privacy Policy</span>
                                    </p>
                                </div>
                            </>
                        )}
                    </div>

                    {/* Right Section: Perks */}
                    <div className="perks-section">
                        <h3>Grow your business faster by selling on Ebizz</h3>
                        
                        <div className="perks-grid">
                            <div className="perk-item">
                                <div className="perk-icon-bg">
                                    <BarChart3 size={24} />
                                </div>
                                <div className="perk-info">
                                    <h4>15 Lakh+</h4>
                                    <p>Suppliers are selling commission-free</p>
                                </div>
                            </div>

                            <div className="perk-item">
                                <div className="perk-icon-bg">
                                    <Globe size={24} />
                                </div>
                                <div className="perk-info">
                                    <h4>Global Reach</h4>
                                    <p>Ship your products across 190+ countries</p>
                                </div>
                            </div>

                            <div className="perk-item">
                                <div className="perk-icon-bg">
                                    <Banknote size={24} />
                                </div>
                                <div className="perk-info">
                                    <h4>0% Commission</h4>
                                    <p>Maximise your profits with zero platform fees</p>
                                </div>
                            </div>

                            <div className="perk-item">
                                <div className="perk-icon-bg">
                                    <HelpCircle size={24} />
                                </div>
                                <div className="perk-info">
                                    <h4>24/7 Support</h4>
                                    <p>Dedicated support for all your business needs</p>
                                </div>
                            </div>
                        </div>

                        <div className="requirements-box">
                            <h4>All you need to sell on Ebizz is:</h4>
                            <ul>
                                <li>
                                    <div className="req-dot"></div>
                                    <span>GSTIN / Business Registration Details</span>
                                </li>
                                <li>
                                    <div className="req-dot"></div>
                                    <span>Active Bank Account</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
            <LastFooter />
        </div>
    );
};

export default SupplierRegistration;
