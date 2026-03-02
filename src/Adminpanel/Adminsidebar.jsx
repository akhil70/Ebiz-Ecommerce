import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  Tag,
  Layers,
  Box,
  ShoppingBag,
  MessageSquare,
  ChevronRight
} from "lucide-react";

export default function AdminSidebar({ isOpen }) {
  return (
    <aside className={`sidebar ${isOpen ? "open" : "closed"}`}>
      <div className="sidebar-title">FAMMS</div>

      <ul className="menu-list">
        <li>
          <NavLink to="/Dashboard" className={({ isActive }) => `menu-item ${isActive ? 'active' : ''}`}>
            <LayoutDashboard size={18} /> <span>Dashboard</span>
          </NavLink>
        </li>
        <li>
          <NavLink to="/Users" className={({ isActive }) => `menu-item ${isActive ? 'active' : ''}`}>
            <Users size={18} /> <span>Users</span>
          </NavLink>
        </li>
        <li>
          <NavLink to="/Brands" className={({ isActive }) => `menu-item ${isActive ? 'active' : ''}`}>
            <Tag size={18} /> <span>Brands</span>
          </NavLink>
        </li>
        <li>
          <NavLink to="/Category" className={({ isActive }) => `menu-item ${isActive ? 'active' : ''}`}>
            <Layers size={18} /> <span>Category</span>
          </NavLink>
        </li>
        <li>
          <NavLink to="/Subcategory" className={({ isActive }) => `menu-item ${isActive ? 'active' : ''}`}>
            <Box size={18} /> <span>Subcategory</span>
          </NavLink>
        </li>
        <li>
          <NavLink to="/Products" className={({ isActive }) => `menu-item ${isActive ? 'active' : ''}`}>
            <ShoppingBag size={18} /> <span>Product</span>
          </NavLink>
        </li>
        <li>
          <NavLink to="/Testimonials" className={({ isActive }) => `menu-item ${isActive ? 'active' : ''}`}>
            <MessageSquare size={18} /> <span>Testimonial</span>
          </NavLink>
        </li>
      </ul>
    </aside>
  );
}
