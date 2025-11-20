import React from 'react';
import './Dashboard.css';

const Dashboard = () => {
  return (
    <div className="dashboard-container">
      {/* Header Section */}
      <div className="dashboard-header">
        <div className="header-content">
          <h1 className="greeting">Good Afternoon, Jonathan!</h1>
          <p className="subtitle">Here's what happening with your store today</p>
          
          <div className="stats-row">
            <div className="stat-item">
              <p className="stat-label">Today's visit</p>
              <h2 className="stat-value">14,209</h2>
            </div>
            <div className="stat-item">
              <p className="stat-label">Today's total sales</p>
              <h2 className="stat-value">$21,349.29</h2>
            </div>
          </div>
        </div>
        <div className="header-illustration">
          <svg viewBox="0 0 200 200" className="store-illustration">
            <ellipse cx="100" cy="180" rx="80" ry="15" fill="#4CAF50" opacity="0.3"/>
            <rect x="60" y="80" width="80" height="100" fill="#5B9FED" rx="5"/>
            <rect x="70" y="100" width="30" height="40" fill="#E3F2FD" rx="2"/>
            <rect x="110" y="100" width="30" height="40" fill="#E3F2FD" rx="2"/>
            <rect x="90" y="150" width="20" height="30" fill="#90CAF9"/>
            <path d="M 50 80 Q 100 50 150 80" fill="#5B9FED"/>
            <circle cx="30" cy="60" r="4" fill="#FFB3BA"/>
            <circle cx="170" cy="100" r="3" fill="#90CAF9"/>
            <circle cx="20" cy="120" r="3" fill="#A5D6A7"/>
            <circle cx="180" cy="70" r="4" fill="#E3F2FD"/>
            <rect x="40" y="170" width="20" height="10" fill="#4CAF50" rx="5"/>
            <rect x="140" y="175" width="25" height="5" fill="#66BB6A" rx="2"/>
          </svg>
        </div>
      </div>

      {/* Alert Sections */}
      <div className="alert-section alert-warning">
        <div className="alert-content">
          <span className="alert-dot orange"></span>
          <span className="alert-text">
            <strong>5 products</strong> didn't publish to your Facebook page
          </span>
        </div>
        <a href="#" className="alert-link">View products &gt;</a>
      </div>

      <div className="alert-section alert-info">
        <div className="alert-content">
          <span className="alert-dot blue"></span>
          <span className="alert-text">
            <strong>7 orders</strong> have payments that need to be captured
          </span>
        </div>
        <a href="#" className="alert-link">View payments &gt;</a>
      </div>

      <div className="alert-section alert-info">
        <div className="alert-content">
          <span className="alert-dot blue"></span>
          <span className="alert-text">
            <strong>50+ orders</strong> need to be fulfilled
          </span>
        </div>
        <a href="#" className="alert-link">View orders &gt;</a>
      </div>

      {/* Charts Row */}
      <div className="charts-row">
        <div className="card">
          <div className="card-header">
            <h3>Weekly Sales</h3>
            <span className="info-icon">?</span>
          </div>
          <div className="card-body">
            <div className="metric-value">$47K</div>
            <span className="metric-change positive">+3.5%</span>
            <div className="bar-chart">
              <div className="bar" style={{height: '60%'}}></div>
              <div className="bar" style={{height: '80%'}}></div>
              <div className="bar" style={{height: '100%'}}></div>
              <div className="bar" style={{height: '85%'}}></div>
              <div className="bar" style={{height: '70%'}}></div>
              <div className="bar" style={{height: '90%'}}></div>
              <div className="bar" style={{height: '95%'}}></div>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <h3>Product Share</h3>
          </div>
          <div className="card-body">
            <div className="metric-value">34.6%</div>
            <span className="metric-change positive">+3.5%</span>
            <div className="circular-progress">
              <svg viewBox="0 0 120 120" className="progress-ring">
                <circle cx="60" cy="60" r="50" fill="none" stroke="#E0E0E0" strokeWidth="12"/>
                <circle cx="60" cy="60" r="50" fill="none" stroke="#5B9FED" strokeWidth="12" 
                  strokeDasharray="314" strokeDashoffset="97" transform="rotate(-90 60 60)"/>
                <circle cx="60" cy="60" r="50" fill="none" stroke="#4DD4AC" strokeWidth="12" 
                  strokeDasharray="314" strokeDashoffset="220" transform="rotate(-90 60 60)"/>
                <circle cx="60" cy="60" r="50" fill="none" stroke="#FF9F43" strokeWidth="12" 
                  strokeDasharray="314" strokeDashoffset="283" transform="rotate(-90 60 60)"/>
              </svg>
              <div className="progress-label">Target: 55%</div>
            </div>
          </div>
        </div>
      </div>

      {/* Market Share and Total Order Row */}
      <div className="charts-row">
        <div className="card">
          <div className="card-header">
            <h3>Market Share</h3>
          </div>
          <div className="card-body market-share">
            <div className="market-list">
              <div className="market-item">
                <span className="marker blue"></span>
                <span className="market-name">Falcon</span>
                <span className="market-value">57%</span>
              </div>
              <div className="market-item">
                <span className="marker cyan"></span>
                <span className="market-name">Sparrow</span>
                <span className="market-value">20%</span>
              </div>
              <div className="market-item">
                <span className="marker orange"></span>
                <span className="market-name">Phoenix</span>
                <span className="market-value">22%</span>
              </div>
            </div>
            <div className="donut-chart">
              <svg viewBox="0 0 120 120" className="donut-ring">
                <circle cx="60" cy="60" r="50" fill="none" stroke="#5B9FED" strokeWidth="20" 
                  strokeDasharray="314" strokeDashoffset="0" transform="rotate(-90 60 60)"/>
                <circle cx="60" cy="60" r="50" fill="none" stroke="#4DD4AC" strokeWidth="20" 
                  strokeDasharray="314" strokeDashoffset="179" transform="rotate(-90 60 60)"/>
                <circle cx="60" cy="60" r="50" fill="none" stroke="#FF9F43" strokeWidth="20" 
                  strokeDasharray="314" strokeDashoffset="242" transform="rotate(-90 60 60)"/>
                <text x="60" y="65" textAnchor="middle" className="donut-text">26M</text>
              </svg>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <h3>Total Order</h3>
          </div>
          <div className="card-body">
            <div className="metric-value">58.4K</div>
            <span className="metric-change positive">+13.6%</span>
            <div className="line-chart">
              <svg viewBox="0 0 300 80" className="line-graph">
                <polyline
                  points="0,60 40,55 80,50 120,45 160,35 200,30 240,45 280,40"
                  fill="none"
                  stroke="#5B9FED"
                  strokeWidth="3"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Stats Grid */}
      <div className="stats-grid">
        <div className="stat-card">
          <h4 className="stat-title">Orders</h4>
          <div className="stat-number">15,450</div>
          <div className="stat-footer">
            <span className="previous-value">13,675</span>
            <span className="change-badge positive">+21.8%</span>
          </div>
        </div>

        <div className="stat-card">
          <h4 className="stat-title">Items sold</h4>
          <div className="stat-number">1,054</div>
          <div className="stat-footer">
            <span className="previous-value">13,675</span>
            <span className="change-badge negative">-21.8%</span>
          </div>
        </div>

        <div className="stat-card">
          <h4 className="stat-title">Refunds</h4>
          <div className="stat-number">$145.65</div>
          <div className="stat-footer">
            <span className="previous-value">13,675</span>
            <span className="change-badge positive">+21.8%</span>
          </div>
        </div>

        <div className="stat-card">
          <h4 className="stat-title">Gross sale</h4>
          <div className="stat-number">$100.26</div>
          <div className="stat-footer">
            <span className="previous-value">$109.65</span>
            <span className="change-badge negative">-21.8%</span>
          </div>
        </div>

        <div className="stat-card">
          <h4 className="stat-title">Shipping</h4>
          <div className="stat-number">$365.53</div>
          <div className="stat-footer">
            <span className="previous-value">13,675</span>
            <span className="change-badge positive">+21.8%</span>
          </div>
        </div>

        <div className="stat-card">
          <h4 className="stat-title">Processing</h4>
          <div className="stat-number">861</div>
          <div className="stat-footer">
            <span className="previous-value">13,675</span>
            <span className="change-badge positive">+21.8%</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;