import React from 'react';
import './Users.css'; 

const purchases = [
  { id: 1, customer: 'Sylvia Plath', email: 'john@gmail.com', product: 'Slick - Drag & Drop Bootstrap Generator', payment: 'Success', amount: 99 },
  { id: 2, customer: 'Homer', email: 'sylvia@mail.ru', product: 'Bose SoundSport Wireless Headphones', payment: 'Success', amount: 634 },
  { id: 3, customer: 'Edgar Allan Poe', email: 'edgar@yahoo.com', product: 'All-New Fire HD 8 Kids Edition Tablet', payment: 'Blocked', amount: 199 },
  { id: 4, customer: 'William Butler Yeats', email: 'william@gmail.com', product: 'Apple iPhone XR (64GB)', payment: 'Success', amount: 798 },
  { id: 5, customer: 'Rabindranath Tagore', email: 'tagore@twitter.com', product: 'ASUS Chromebook C202SA-YSO2 11.6"', payment: 'Blocked', amount: 318 },
  { id: 6, customer: 'Emily Dickinson', email: 'emily@gmail.com', product: 'Mirari OK to Wake! Alarm Clock & Night-Light', payment: 'Pending', amount: 11 },
  { id: 7, customer: 'Giovanni Boccaccio', email: 'giovanni@outlook.com', product: 'Summer Infant Contoured Changing Pad', payment: 'Success', amount: 31 },
];

// Helper function to render the payment status pill
const PaymentPill = ({ status }) => {
  let className = 'payment-pill ';
  if (status === 'Success') {
    className += 'success';
  } else if (status === 'Blocked') {
    className += 'blocked';
  } else if (status === 'Pending') {
    className += 'pending';
  }

  return <span className={className}>{status}</span>;
};


const Users = () => {
  return (
    <div className="recent-purchases-card">
      
      {/* Header Section */}
      <div className="card-header">
        <h2>Recent Purchases</h2>
        <div className="header-actions">
          <button className="action-button new-button">+ New</button>
          <button className="action-button">▼ Filter</button>
          <button className="action-button">⤓ Export</button>
        </div>
      </div>

      {/* Table Section */}
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th className="checkbox-col"><input type="checkbox" /></th>
              <th>Customer ↓</th>
              <th>Email ↓</th>
              <th>Product ↓</th>
              <th>Payment ↓</th>
              <th>Amount ↓</th>
              <th className="dots-col"></th>
            </tr>
          </thead>
          <tbody>
            {purchases.map(purchase => (
              <tr key={purchase.id}>
                <td className="checkbox-col"><input type="checkbox" /></td>
                <td className="customer-name">{purchase.customer}</td>
                <td className="email-address">{purchase.email}</td>
                <td>{purchase.product}</td>
                <td><PaymentPill status={purchase.payment} /></td>
                <td className="amount-col">${purchase.amount}</td>
                <td className="dots-col">...</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Footer Section (Pagination) */}
      <div className="card-footer">
        <div className="pagination-info">
          1 to 7 of 14
        </div>
        <div className="pagination-buttons">
          <button className="pagination-button prev-button">Previous</button>
          <button className="pagination-button next-button">Next</button>
        </div>
      </div>

    </div>
  );
};

export default Users;