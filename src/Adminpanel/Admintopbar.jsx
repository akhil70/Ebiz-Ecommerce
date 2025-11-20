import { useState } from "react";
import { Menu, User, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function AdminTopbar({ toggleSidebar }) {
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const goToProfile = () => navigate("/profile");
  const logoutUser = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <header className="topbar">
      {/* Sidebar Toggle */}
      <button className="toggle-btn" onClick={toggleSidebar}>
        <Menu size={24} />
      </button>

      {/* Avatar */}
      <div className="top-right" style={{ position: "relative" }}>
        <img
          className="avatar"
          src="https://i.pravatar.cc/40"
          alt="avatar"
          onClick={() => setDropdownOpen(!dropdownOpen)}
          style={{ cursor: "pointer" }} 
        />

        {/* Dropdown */}
        {dropdownOpen && (
          <div className="profile-dropdown">
            <button className="drop-item" onClick={goToProfile}>
              <User size={16} className="drop-icon" />
              Profile
            </button>

            <div className="drop-divider"></div>

            <button className="drop-item" onClick={logoutUser}>
              <LogOut size={16} className="drop-icon" />
              Logout
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
