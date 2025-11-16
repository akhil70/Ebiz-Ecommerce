import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';
import "./style.css";
// import { Header } from "./Header";
import HomePage from "./Homepage";
import LoginForm from './LoginAcess/LoginForm';
import ProductDetail from './Components/ProductDetail';
import ShoppingCart from './Components/ShoppingCart';

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
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;