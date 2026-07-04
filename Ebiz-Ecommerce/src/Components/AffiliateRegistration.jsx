import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, ShieldCheck, Banknote, Percent, BarChart3, HelpCircle, ArrowLeft, User, CheckCircle, Share2 } from 'lucide-react';
import { Header } from '../Header';
import Footer from './Footer';
import LastFooter from './LastFooter';
import './SupplierRegistration.css'; // Reusing layout styles for visual consistency
import { PublicAPI } from '../Utils/AxiosConfig';
import toast from 'react-hot-toast';

const AffiliateRegistration = () => {
    const [email, setEmail] = useState('');
    const [name, setName] = useState('');
    const [socialLink, setSocialLink] = useState('');
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
        const loadToast = toast.loading('Submitting affiliate request...');
        try {
            await PublicAPI.post('/auth/signup/verify-otp-temporary', {
                email: email.trim(),
                otp: otp.trim(),
                name: name.trim(),
                role: 'AFFILIATE'
            });
            setSuccess(true);
            toast.success('Affiliate request submitted!', { id: loadToast });
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
                    <p>Already a partner?</p>
                    <button className="login-nav-btn" onClick={() => navigate('/login')}>Login</button>
                </div>
                <div className="reg-container">
                    {/* Left Section: Form */}
                    <div className="form-section">
                        <button className="back-btn" onClick={() => navigate('/')}>
                            <ArrowLeft size={18} />
                            <span>Home</span>
                        </button>
                        
                        {success ? (
                            <div className="success-reg-message" style={{ textAlign: 'center', padding: '40px 20px' }}>
                                <CheckCircle size={64} color="#10b981" style={{ margin: '0 auto 20px auto' }} />
                                <h2 style={{ fontSize: '24px', fontWeight: '700', color: '#111827', marginBottom: '12px' }}>Application Submitted!</h2>
                                <p style={{ color: '#4b5563', fontSize: '15px', lineHeight: '1.6', marginBottom: '24px' }}>
                                    Thank you, <strong>{name}</strong>. Your email <strong>{email}</strong> has been successfully verified.<br />
                                    Your application to join the Ebizz Affiliate Network is now pending administrative approval.<br />
                                    Once approved, we will email your temporary login credentials to you.
                                </p>
                                <button className="create-account-btn" onClick={() => navigate('/')} style={{ maxWidth: '200px', margin: '0 auto' }}>
                                    Go to Homepage
                                </button>
                            </div>
                        ) : (
                            <>
                                <div className="form-header">
                                    <h2>Join Ebizz Affiliate Network</h2>
                                    <p>Partner with us, share links to products, and earn competitive commissions.</p>
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

                                    <div className="input-group" style={{ marginBottom: '20px' }}>
                                        <label htmlFor="social">Website or Social Media Link</label>
                                        <div className="input-wrapper">
                                            <Share2 className="input-icon" size={18} />
                                            <input 
                                                type="text" 
                                                id="social" 
                                                placeholder="https://youtube.com/channel or website" 
                                                value={socialLink}
                                                onChange={(e) => setSocialLink(e.target.value)}
                                            />
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
                                        {verifying ? 'Submitting...' : 'Apply as Affiliate'}
                                    </button>
                                    
                                    <p className="privacy-text" style={{ marginTop: '20px' }}>
                                        By applying, you agree to our <span>Affiliate Agreement</span> and <span>Privacy Policy</span>
                                    </p>
                                </div>
                            </>
                        )}
                    </div>

                    {/* Right Section: Perks */}
                    <div className="perks-section">
                        <h3>Monetize your traffic and audience with Ebizz</h3>
                        
                        <div className="perks-grid">
                            <div className="perk-item">
                                <div className="perk-icon-bg">
                                    <Percent size={24} />
                                </div>
                                <div className="perk-info">
                                    <h4>Up to 15% Comm.</h4>
                                    <p>Earn industry-leading commissions on every referral</p>
                                </div>
                            </div>

                            <div className="perk-item">
                                <div className="perk-icon-bg">
                                    <ShieldCheck size={24} />
                                </div>
                                <div className="perk-info">
                                    <h4>30-Day Cookie</h4>
                                    <p>Credit for sales up to 30 days after the initial click</p>
                                </div>
                            </div>

                            <div className="perk-item">
                                <div className="perk-icon-bg">
                                    <Banknote size={24} />
                                </div>
                                <div className="perk-info">
                                    <h4>Monthly Payouts</h4>
                                    <p>Reliable monthly disbursements with low thresholds</p>
                                </div>
                            </div>

                            <div className="perk-item">
                                <div className="perk-icon-bg">
                                    <BarChart3 size={24} />
                                </div>
                                <div className="perk-info">
                                    <h4>Real-time Tracking</h4>
                                    <p>Dedicated affiliate portal with click and sales tracking</p>
                                </div>
                            </div>
                        </div>

                        <div className="requirements-box">
                            <h4>All you need to partner with Ebizz is:</h4>
                            <ul>
                                <li>
                                    <div className="req-dot"></div>
                                    <span>Active Website, Blog, or Social Media following</span>
                                </li>
                                <li>
                                    <div className="req-dot"></div>
                                    <span>Verified Email Address & Bank Account</span>
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

export default AffiliateRegistration;
