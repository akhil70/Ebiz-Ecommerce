import {
  LayoutDashboard,
  Users,
  User,
  ClipboardList,
  Tag,
  Layers,
  Box,
  ShoppingBag,
  MessageSquare,
  ChevronRight,
  Filter,
  UserCheck
} from "lucide-react";
import { NavLink } from "react-router-dom";
import { useSelector } from "react-redux";

export default function AdminSidebar({ isOpen }) {
  const user = useSelector((state) => state.auth.user);
  const role = user?.role;
  const isAdminOrStaff = role === "ADMIN" || role === "STAFF";
  const isSeller = role === "SELLER";
  const isAffiliate = role === "AFFILIATE";

  return (
    <aside className={`sidebar ${isOpen ? "open" : "closed"}`}>
      <div className="sidebar-title">
        <img src="/Logo.png" alt="TOTAL EBIZ LLC" className="sidebar-brand-logo" />
      </div>

      <ul className="menu-list">
        {isSeller && (
          <li>
            <NavLink to="/Dashboard" className={({ isActive }) => `menu-item ${isActive ? 'active' : ''}`}>
              <LayoutDashboard size={18} /> <span>Dashboard</span>
            </NavLink>
          </li>
        )}
        {isAffiliate && (
          <li>
            <NavLink to="/AffiliateDashboard" className={({ isActive }) => `menu-item ${isActive ? 'active' : ''}`}>
              <LayoutDashboard size={18} /> <span>Affiliate Portal</span>
            </NavLink>
          </li>
        )}

        {isAdminOrStaff && (
          <li>
            <NavLink to="/Customers" className={({ isActive }) => `menu-item ${isActive ? 'active' : ''}`}>
              <User size={18} /> <span>Customers</span>
            </NavLink>
          </li>
        )}
        {(isAdminOrStaff || isSeller) && (
          <li>
            <NavLink to="/Orders" className={({ isActive }) => `menu-item ${isActive ? 'active' : ''}`}>
              <ClipboardList size={18} /> <span>Orders</span>
            </NavLink>
          </li>
        )}
        {isAdminOrStaff && (
          <li>
            <NavLink to="/Users" className={({ isActive }) => `menu-item ${isActive ? 'active' : ''}`}>
              <Users size={18} /> <span>Admins</span>
            </NavLink>
          </li>
        )}
        {isAdminOrStaff && (
          <li>
            <NavLink to="/Approvals" className={({ isActive }) => `menu-item ${isActive ? 'active' : ''}`}>
              <UserCheck size={18} /> <span>Approvals</span>
            </NavLink>
          </li>
        )}
        {isAdminOrStaff && (
          <li>
            <NavLink to="/Brands" className={({ isActive }) => `menu-item ${isActive ? 'active' : ''}`}>
              <Tag size={18} /> <span>Brands</span>
            </NavLink>
          </li>
        )}
        {isAdminOrStaff && (
          <li>
            <NavLink to="/Category" className={({ isActive }) => `menu-item ${isActive ? 'active' : ''}`}>
              <Layers size={18} /> <span>Category</span>
            </NavLink>
          </li>
        )}
        {isAdminOrStaff && (
          <li>
            <NavLink to="/Subcategory" className={({ isActive }) => `menu-item ${isActive ? 'active' : ''}`}>
              <Box size={18} /> <span>Subcategory</span>
            </NavLink>
          </li>
        )}
        {(isAdminOrStaff || isSeller || isAffiliate) && (
          <li>
            <NavLink to="/Products" className={({ isActive }) => `menu-item ${isActive ? 'active' : ''}`}>
              <ShoppingBag size={18} /> <span>Product</span>
            </NavLink>
          </li>
        )}
        {isAdminOrStaff && (
          <li>
            <NavLink to="/Filters" className={({ isActive }) => `menu-item ${isActive ? 'active' : ''}`}>
              <Filter size={18} /> <span>Filters</span>
            </NavLink>
          </li>
        )}
        {isAdminOrStaff && (
          <li>
            <NavLink to="/Testimonials" className={({ isActive }) => `menu-item ${isActive ? 'active' : ''}`}>
              <MessageSquare size={18} /> <span>Testimonial</span>
            </NavLink>
          </li>
        )}
      </ul>
    </aside>
  );
}
