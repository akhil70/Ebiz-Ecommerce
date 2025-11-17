import { useState } from "react";
import { Outlet, Link } from "react-router-dom";
import "./Adminlayout.css";
import {
  LayoutDashboard, Menu
} from "lucide-react";

export default function AdminLayout() {

  const [isOpen, setIsOpen] = useState(true);  // Sidebar toggle

  return (
    <div className="admin-container">

      {/* Sidebar */}
      <aside className={`sidebar ${isOpen ? "open" : "closed"}`}>
        <div className="sidebar-title">FAMMS</div>

        <ul className="menu-list">
          <li><Link to="/admin" className="menu-item"><LayoutDashboard size={18}/> Dashboard</Link></li>
         
        </ul>
      </aside>

      {/* Main Area */}
      <div className="main-area">

        {/* Top Navbar */}
        <header className="topbar">

          {/* Sidebar Toggle Button */}
          <button
            className="toggle-btn"
            onClick={() => setIsOpen(!isOpen)}
          >
            <Menu size={24} />
          </button>

          <div className="top-right">
            <img
              className="avatar"
              src="https://i.pravatar.cc/40"
              alt="avatar"
            />
          </div>
        </header>

        {/* Page Content */}
        <main className="content">
          <Outlet />
        </main>

        {/* Footer */}
        <footer className="footer">
          Copyright © FAMMS 2025. All rights reserved.
        </footer>

      </div>
    </div>
  );
}
