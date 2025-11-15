import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';
import "./style.css";
// import { Header } from "./Header";
import HomePage from "./Homepage";
import LoginForm from './LoginAcess/LoginForm';

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-white">
        {/* <Header /> */}
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginForm />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;