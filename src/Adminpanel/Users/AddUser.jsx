import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import "../AdminForm.css"; // Import the common CSS

const AddUser = ({ isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    role: "",
    status: "Active",
  });

  // Reset form when opened fresh
  useEffect(() => {
    if (isOpen) {
      setFormData({
        name: "",
        email: "",
        phone: "",
        role: "",
        status: "Active",
      });
    }
  }, [isOpen]);

  const roles = ["Admin", "Editor", "Viewer"];
  const statuses = ["Active", "Pending", "Blocked"];

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("User submitted:", formData);

    // Simulate API call success
    alert("User details submitted successfully!");

    if (onSave) onSave(formData);
    onClose(); // Close the sidebar
  };

  if (!isOpen) return null; // Don't render if closed

  return (
    <>
      {/* Overlay */}
      <div className="sidebar-overlay" onClick={onClose}></div>

      {/* Sidebar Container */}
      <div className="sidebar-container">
        {/* Header */}
        <div className="sidebar-header">
          <h2 className="sidebar-title">User Management</h2>
          <button className="close-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        {/* Content with Scroll */}
        <div className="sidebar-content">
          <form id="add-user-form" onSubmit={handleSubmit} className="admin-form">

            {/* Name */}
            <div className="form-group">
              <label className="form-label">Full Name *</label>
              <input
                type="text"
                name="name"
                placeholder="Enter full name"
                value={formData.name}
                onChange={handleChange}
                required
                className="form-input"
              />
            </div>

            {/* Email */}
            <div className="form-group">
              <label className="form-label">Email Address *</label>
              <input
                type="email"
                name="email"
                placeholder="Enter email"
                value={formData.email}
                onChange={handleChange}
                required
                className="form-input"
              />
            </div>

            {/* Phone */}
            <div className="form-group">
              <label className="form-label">Phone Number</label>
              <input
                type="text"
                name="phone"
                placeholder="Enter phone number"
                value={formData.phone}
                onChange={handleChange}
                className="form-input"
              />
            </div>

            {/* Role */}
            <div className="form-group">
              <label className="form-label">Role *</label>
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                required
                className="form-select"
              >
                <option value="">Select Role</option>
                {roles.map((role, i) => (
                  <option key={i} value={role}>
                    {role}
                  </option>
                ))}
              </select>
            </div>

            {/* Status */}
            <div className="form-group">
              <label className="form-label">Status</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="form-select"
              >
                {statuses.map((sts, i) => (
                  <option key={i} value={sts}>
                    {sts}
                  </option>
                ))}
              </select>
            </div>

          </form>
        </div>

        {/* Footer */}
        <div className="sidebar-footer">
          <button
            type="button"
            className="btn-cancel"
            onClick={onClose}
          >
            Cancel
          </button>
          <button type="submit" form="add-user-form" className="btn-submit">
            Save
          </button>
        </div>
      </div>
    </>
  );
};

export default AddUser;
