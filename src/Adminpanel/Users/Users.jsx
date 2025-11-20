import React from 'react';
import './Users.css';
import { useNavigate } from "react-router-dom";


const users = [
  { id: 1, name: 'John Doe', email: 'john@gmail.com', role: 'Admin', status: 'Active' },
  { id: 2, name: 'Sylvia Plath', email: 'sylvia@mail.ru', role: 'Editor', status: 'Active' },
  { id: 3, name: 'Edgar Allan Poe', email: 'edgar@yahoo.com', role: 'Viewer', status: 'Blocked' },
  { id: 4, name: 'William Yeats', email: 'william@gmail.com', role: 'Editor', status: 'Active' },
  { id: 5, name: 'Rabindranath Tagore', email: 'tagore@twitter.com', role: 'Viewer', status: 'Blocked' },
  { id: 6, name: 'Emily Dickinson', email: 'emily@gmail.com', role: 'Admin', status: 'Pending' },
  { id: 7, name: 'Giovanni Boccaccio', email: 'giovanni@outlook.com', role: 'Viewer', status: 'Active' },
];

// Status pill component
const StatusPill = ({ status }) => {
  let className = 'payment-pill ';
  if (status === 'Active') className += 'success';
  else if (status === 'Blocked') className += 'blocked';
  else if (status === 'Pending') className += 'pending';

  return <span className={className}>{status}</span>;
};

const Users = () => {
  const navigate = useNavigate();
  return (
    <div className="recent-purchases-card">

      {/* Header Section */}
      <div className="card-header">
        <h2>User List</h2>
        <div className="header-actions">
          <button className="action-button new-button" onClick={() => navigate("/AddUser")}>+ New User</button>
        </div>
      </div>

      {/* Table Section */}
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th className="checkbox-col"><input type="checkbox" /></th>
              <th>User ↓</th>
              <th>Email ↓</th>
              <th>Role ↓</th>
              <th>Status ↓</th>
              <th className="dots-col"></th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user.id}>
                <td className="checkbox-col"><input type="checkbox" /></td>
                <td className="customer-name">{user.name}</td>
                <td className="email-address">{user.email}</td>
                <td>{user.role}</td>
                <td><StatusPill status={user.status} /></td>
                <td className="dots-col">...</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Footer Section */}
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
