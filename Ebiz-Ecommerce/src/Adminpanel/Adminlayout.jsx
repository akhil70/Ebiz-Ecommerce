import { useState } from "react";
import { Outlet } from "react-router-dom";


import AdminTopbar from "./Admintopbar";
import AdminFooter from "./Adminfooter";
import AdminSidebar from "./Adminsidebar";

import "./Adminlayout.css";

export default function AdminLayout() {
  const [isOpen, setIsOpen] = useState(true);

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
