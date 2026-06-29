import { useState, useEffect } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";


import AdminTopbar from "./Admintopbar";
import AdminFooter from "./Adminfooter";
import AdminSidebar from "./Adminsidebar";

import "./Adminlayout.css";

export default function AdminLayout() {
  const [isOpen, setIsOpen] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();
  const user = useSelector((state) => state.auth.user);

  useEffect(() => {
    // If not logged in, redirect to login page
    if (!user) {
      navigate("/login");
      return;
    }

    const path = location.pathname.toLowerCase();
    const role = user.role;

    if (role === "ADMIN" || role === "STAFF") {
      // Admins and Staff shouldn't land on seller dashboard; redirect to Admin (Users) list
      if (path === "/dashboard") {
        navigate("/Users");
      }
    } else if (role === "SELLER") {
      // Sellers shouldn't access admin-only pages
      const adminOnlyPaths = ["/users", "/approvals", "/adduser", "/category", "/subcategory", "/addcategory", "/addsubcategory", "/brands", "/addbrand", "/customers"];
      if (adminOnlyPaths.includes(path)) {
        navigate("/Dashboard");
      }
    } else {
      // Regular customers/users have no access to the Admin panel layout
      navigate("/");
    }
  }, [user, location.pathname, navigate]);

  if (!user) {
    return null;
  }

  // Prevent flash of unauthorized content before redirect
  const path = location.pathname.toLowerCase();
  const role = user.role;
  if (role === "ADMIN" || role === "STAFF") {
    if (path === "/dashboard") return null;
  } else if (role === "SELLER") {
    const adminOnlyPaths = ["/users", "/approvals", "/adduser", "/category", "/subcategory", "/addcategory", "/addsubcategory", "/brands", "/addbrand", "/customers"];
    if (adminOnlyPaths.includes(path)) return null;
  } else {
    return null;
  }

  return (
    <div className="admin-container">
      <AdminSidebar isOpen={isOpen} />
      <div className="main-area">
        <AdminTopbar toggleSidebar={() => setIsOpen(!isOpen)} />
        <main className="content">
          <Outlet />
        </main>
        <AdminFooter />
      </div>
    </div>
  );
}
