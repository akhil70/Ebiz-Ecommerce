import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';
import "./style.css";
// import { Header } from "./Header";
import HomePage from "./Homepage";
import LoginForm from './LoginAcess/LoginForm';
import ProductDetail from './Components/ProductDetail';
import ShoppingCart from './Components/ShoppingCart';

import AdminLayout from "./Adminpanel/Adminlayout";
import Dashboard from "./Adminpanel/dashboard";
import Users from './Adminpanel/Users/Users';
import AddUser from './Adminpanel/Users/AddUser';
import Category from './Adminpanel/Category/Category';
import AddCategory from './Adminpanel/Category/AddCategory';

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-white">
        {/* <Header /> */}
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginForm />} />
          <Route path="/product" element={<ProductDetail />} />
          <Route path="/cart" element={<ShoppingCart />} />

          {/* ============= ADMIN PANEL ================ */}
          <Route path="/Dashboard" element={<AdminLayout />}>
            <Route index element={<Dashboard />} />
          </Route>
          <Route path="/Users" element={<AdminLayout />}>
            <Route index element={<Users />} />
          </Route>

          <Route path="/AddUser" element={<AdminLayout />}>
            <Route index element={<AddUser />} />
          </Route>
          <Route path="/Category" element={<AdminLayout />}>
            <Route index element={<Category />} />
          </Route>
          <Route path="/AddCategory" element={<AdminLayout />}>
            <Route index element={<AddCategory />} />
          </Route>

        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;