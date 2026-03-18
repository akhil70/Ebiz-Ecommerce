import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';
import "./style.css";
// import { Header } from "./Header";
import HomePage from "./Homepage";
import LoginForm from './LoginAcess/LoginForm';
import ProductDetail from './Components/ProductDetail';
import ShoppingCart from './Components/ShoppingCart';
import ProductListing from './Components/ProductListing';

import AdminLayout from "./Adminpanel/Adminlayout";
import Dashboard from "./Adminpanel/dashboard";
import Users from './Adminpanel/Users/Users';
import Customers from './Adminpanel/Customers/Customers';
import Orders from './Adminpanel/Orders/Orders';
import AddUser from './Adminpanel/Users/AddUser';
import Category from './Adminpanel/Category/Category';
import AddCategory from './Adminpanel/Category/AddCategory';
import Brands from './Adminpanel/Brands/Brands';
import AddBrand from './Adminpanel/Brands/AddBrand';
import Testimonials from './Adminpanel/Testimonials/Testimonials';
import AddTestimonial from './Adminpanel/Testimonials/AddTestimonial';
import Subcategory from './Adminpanel/Subcategory/Subcategory';
import AddSubcategory from './Adminpanel/Subcategory/AddSubcategory';
import Products from './Adminpanel/Products/Products';
import AddProduct from './Adminpanel/Products/AddProduct';
import Filters from './Adminpanel/Filters/Filters';

import { Toaster } from 'react-hot-toast';

function App() {
  return (
    <BrowserRouter>
      <Toaster position="top-right" reverseOrder={false} />
      <div className="min-h-screen bg-white">
        {/* <Header /> */}
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginForm />} />
          <Route path="/product" element={<ProductDetail />} />
          <Route path="/cart" element={<ShoppingCart />} />
          <Route path="/shop" element={<ProductListing />} />

          {/* ============= ADMIN PANEL ================ */}
          <Route path="/Dashboard" element={<AdminLayout />}>
            <Route index element={<Dashboard />} />
          </Route>
          <Route path="/Users" element={<AdminLayout />}>
            <Route index element={<Users />} />
          </Route>
          <Route path="/Customers" element={<AdminLayout />}>
            <Route index element={<Customers />} />
          </Route>
          <Route path="/Orders" element={<AdminLayout />}>
            <Route index element={<Orders />} />
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
          <Route path="/Brands" element={<AdminLayout />}>
            <Route index element={<Brands />} />
          </Route>
          <Route path="/AddBrand" element={<AdminLayout />}>
            <Route index element={<AddBrand />} />
          </Route>
          <Route path="/Testimonials" element={<AdminLayout />}>
            <Route index element={<Testimonials />} />
          </Route>
          <Route path="/AddTestimonial" element={<AdminLayout />}>
            <Route index element={<AddTestimonial />} />
          </Route>
          <Route path="/Subcategory" element={<AdminLayout />}>
            <Route index element={<Subcategory />} />
          </Route>
          <Route path="/Products" element={<AdminLayout />}>
            <Route index element={<Products />} />
          </Route>
          <Route path="/AddProduct" element={<AdminLayout />}>
            <Route index element={<AddProduct />} />
          </Route>
          <Route path="/Filters" element={<AdminLayout />}>
            <Route index element={<Filters />} />
          </Route>

        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;