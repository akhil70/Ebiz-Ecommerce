import { Link } from "react-router-dom";
import { LayoutDashboard,SquareUser } from "lucide-react";

export default function AdminSidebar({ isOpen }) {
  return (
    <aside className={`sidebar ${isOpen ? "open" : "closed"}`}>
      <div className="sidebar-title">FAMMS</div>

      <ul className="menu-list">
        <li>
          <Link to="/Dashboard" className="menu-item">
            <LayoutDashboard size={18} /> Dashboard
          </Link> 
           <Link to="/Users" className="menu-item">
            <LayoutDashboard size={18} /> Users
          </Link>
        </li>
        
      </ul>
    </aside>
  );
}
