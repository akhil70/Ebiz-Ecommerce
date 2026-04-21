import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, ShieldCheck, Banknote, Globe, BarChart3, HelpCircle, ArrowLeft } from 'lucide-react';
import { Header } from '../Header';
import Footer from './Footer';
import LastFooter from './LastFooter';
import './SupplierRegistration.css';

const SupplierRegistration = () => {
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const navigate = useNavigate();

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
                        
                        <div className="form-header">
                            <h2>Welcome to Ebizz</h2>
                            <p>Create your account to start selling and reach millions of customers.</p>
                        </div>

                        <div className="form-body">
                            <div className="input-group">
                                <label htmlFor="email">Enter Email Address</label>
                                <div className="input-wrapper">
                                    <Mail className="input-icon" size={18} />
                                    <input 
                                        type="email" 
                                        id="email" 
                                        placeholder="example@email.com" 
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                    />
                                    <button className="send-otp-btn">Send OTP</button>
                                </div>
                            </div>

                            <div className="input-group">
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

                            <button className="create-account-btn">Create Account</button>
                            
                            <p className="privacy-text">
                                By clicking you agree to our <span>Terms & Conditions</span> and <span>Privacy Policy</span>
                            </p>
                        </div>
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
