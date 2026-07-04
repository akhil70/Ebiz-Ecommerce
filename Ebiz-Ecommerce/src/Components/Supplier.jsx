import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Supplier.css';
import { Header } from '../Header';
import Footer from './Footer';
import LastFooter from './LastFooter';
import supplierHero from '../images/supplier-hero.png';
import { Mail } from 'lucide-react';

const Supplier = () => {
  const navigate = useNavigate();
  return (
    <div className="supplier-container">
      <Header />
      
      {/* Hero Section */}
      <section className="supplier-hero">
        <div className="hero-content">
          <h1>Sell online to Crores of Customers at <span>0% Commission</span></h1>
          <p className="hero-subtext">Become a supplier and grow your business across the globe with Ebizz.</p>
          
          <div className="new-badge-container">
            <span className="badge-new">NEW</span>
            <p className="badge-text">Don't have a GSTIN? You can still sell on Ebizz. <span>Know more</span></p>
          </div>
          
          <button className="start-selling-btn" onClick={() => navigate('/supplier/register')}>Start Selling</button>
        </div>
        
        <div className="hero-image">
          <img src={supplierHero} alt="Supplier Growth" />
        </div>
      </section>

      {/* How It Works Section */}
      <section className="how-it-works">
        <h2>How it works</h2>
        <div className="steps-container">
          <div className="step-card">
            <div className="step-number">1</div>
            <h3>Create Account</h3>
            <p>All you need is:</p>
            <ul>
              <li>GSTIN (for GST sellers) or Enrolment ID / UIN (for non-GST sellers)</li>
              <li>Bank Account</li>
            </ul>
          </div>
          
          <div className="step-card">
            <div className="step-number">2</div>
            <h3>List Products</h3>
            <p>List the products you want to sell in your supplier panel.</p>
          </div>
          
          <div className="step-card">
            <div className="step-number">3</div>
            <h3>Get Orders</h3>
            <p>Start getting orders from millions of customers actively shopping on our platform.</p>
          </div>
          
          <div className="step-card">
            <div className="step-number">4</div>
            <h3>Affordable Shipping</h3>
            <p>Enjoy affordable shipping to customers across India and globally.</p>
          </div>
          
          <div className="step-card">
            <div className="step-number">5</div>
            <h3>Receive Payments</h3>
            <p>Payments are deposited directly to your bank account following a secure payment cycle.</p>
          </div>
        </div>
      </section>

      {/* Support Section */}
      <section className="supplier-support">
        <div className="support-left">
          <h2>Ebizz Supplier Support Available 24/7</h2>
        </div>
        <div className="support-right">
          <p className="support-text">
            Ebizz supplier support is available to solve all your doubts and issues before and after you start your online selling business.
          </p>
          <div className="contact-card">
            <div className="mail-icon">
              <Mail size={24} />
            </div>
            <div className="mail-info">
              <p>You can reach out to</p>
              <a href="mailto:sell@ebizz.com">sell@ebizz.com</a>
            </div>
          </div>
        </div>
      </section>

      <Footer />
      <LastFooter />
    </div>
  );
};

export default Supplier;
