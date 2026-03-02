import React, { useState } from 'react';
import './Users.css';
import { useNavigate } from "react-router-dom";
import AddUser from './AddUser'; // Import the form component
import API from "../../Utils/AxiosConfig";
import { useEffect } from "react";
import NoData from '../Components/NoData';


/* Initial placeholder users removed - now fetching from API */

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
  const [isAddUserOpen, setIsAddUserOpen] = useState(false); // State for modal
  const [userList, setUserList] = useState([]); // State for fetched users
  const [loading, setLoading] = useState(true);

  // Fetch users from API
  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await API.get('/users');
      setUserList(response.data);
    } catch (error) {
      console.error("Error fetching users:", error);
      // Fallback to empty list or keep previous
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div className="recent-purchases-card">
      {/* Add User Sidebar Modal */}
      <AddUser isOpen={isAddUserOpen} onClose={() => setIsAddUserOpen(false)} />

      {/* Header Section */}
      <div className="card-header">
        <h2>User List</h2>
        <div className="header-actions">
          <button className="action-button new-button" onClick={() => setIsAddUserOpen(true)}>+ New User</button>
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
            {loading ? (
              <tr><td colSpan="6" style={{ textAlign: "center", padding: "20px" }}>Loading users...</td></tr>
            ) : userList.length === 0 ? (
              <tr>
                <td colSpan="6" style={{ padding: "0" }}>
                  <NoData message="No users found." />
                </td>
              </tr>
            ) : (
              userList.map(user => (
                <tr key={user.id}>
                  <td className="checkbox-col"><input type="checkbox" /></td>
                  <td className="customer-name">{user.name}</td>
                  <td className="email-address">{user.email}</td>
                  <td>{user.role}</td>
                  <td><StatusPill status={user.status} /></td>
                  <td className="dots-col">...</td>
                </tr>
              ))
            )}
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
