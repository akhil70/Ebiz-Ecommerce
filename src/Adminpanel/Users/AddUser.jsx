import React, { useState } from "react";

const AddUser = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    role: "",
    status: "Active",
  });

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

    alert("User details submitted successfully!");

    // Reset
    setFormData({
      name: "",
      email: "",
      phone: "",
      role: "",
      status: "Active",
    });
  };

  return (
    <div className="add-user-container" style={styles.container}>
      <h2 style={styles.title}>Add User</h2>

      <form onSubmit={handleSubmit} style={styles.form}>
        
        {/* Name */}
        <label style={styles.label}>Full Name</label>
        <input
          type="text"
          name="name"
          placeholder="Enter full name"
          value={formData.name}
          onChange={handleChange}
          required
          style={styles.input}
        />

        {/* Email */}
        <label style={styles.label}>Email Address</label>
        <input
          type="email"
          name="email"
          placeholder="Enter email"
          value={formData.email}
          onChange={handleChange}
          required
          style={styles.input}
        />

        {/* Phone */}
        <label style={styles.label}>Phone Number</label>
        <input
          type="text"
          name="phone"
          placeholder="Enter phone number"
          value={formData.phone}
          onChange={handleChange}
          style={styles.input}
        />

        {/* Role */}
        <label style={styles.label}>Role</label>
        <select
          name="role"
          value={formData.role}
          onChange={handleChange}
          required
          style={styles.input}
        >
          <option value="">Select Role</option>
          {roles.map((role, i) => (
            <option key={i} value={role}>
              {role}
            </option>
          ))}
        </select>

        {/* Status */}
        <label style={styles.label}>Status</label>
        <select
          name="status"
          value={formData.status}
          onChange={handleChange}
          style={styles.input}
        >
          {statuses.map((sts, i) => (
            <option key={i} value={sts}>
              {sts}
            </option>
          ))}
        </select>

        {/* Buttons */}
        <div style={styles.buttonRow}>
          <button type="submit" style={styles.submitBtn}>
            Submit
          </button>
          <button
            type="button"
            style={styles.cancelBtn}
            onClick={() =>
              setFormData({ name: "", email: "", phone: "", role: "", status: "Active" })
            }
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

// Inline CSS styles
const styles = {
  container: {
    maxWidth: "480px",
    margin: "30px auto",
    padding: "20px",
    border: "1px solid #ddd",
    borderRadius: "10px",
    background: "#fff",
    fontFamily: "Arial, sans-serif",
  },
  title: {
    marginBottom: "20px",
    textAlign: "center",
    fontSize: "22px",
  },
  form: {
    display: "flex",
    flexDirection: "column",
  },
  label: {
    marginTop: "10px",
    marginBottom: "6px",
    fontWeight: "bold",
  },
  input: {
    padding: "10px",
    borderRadius: "6px",
    border: "1px solid #ccc",
  },
  buttonRow: {
    marginTop: "20px",
    display: "flex",
    gap: "10px",
  },
  submitBtn: {
    flex: 1,
    padding: "10px",
    background: "#007bff",
    color: "#fff",
    borderRadius: "6px",
    border: "none",
    cursor: "pointer",
  },
  cancelBtn: {
    flex: 1,
    padding: "10px",
    background: "#dc3545",
    color: "#fff",
    borderRadius: "6px",
    border: "none",
    cursor: "pointer",
  },
};

export default AddUser;
