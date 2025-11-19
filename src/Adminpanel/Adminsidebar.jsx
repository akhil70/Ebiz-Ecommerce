import { Link } from "react-router-dom";
import { LayoutDashboard } from "lucide-react";

export default function AdminSidebar({ isOpen }) {
  return (
    <aside className={`sidebar ${isOpen ? "open" : "closed"}`}>
      <div className="sidebar-title">FAMMS</div>

      <ul className="menu-list">
        <li>
          <Link to="/admin" className="menu-item">
            <LayoutDashboard size={18} /> Dashboard
          </Link>
        </li>
      </ul>
    </aside>
  );
}
