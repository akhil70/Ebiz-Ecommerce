import { useState } from "react";
import "./LoginForm.css";

import login from "../images/loginimage.jpg";

import logo from "../images/test.jpg";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  
  const [error, setError] = useState('');

  const navigate = useNavigate();

  const handleSubmit = () => {
    const dummyUser = "admin";
    const dummyPass = "admin";

    if (username === dummyUser && password === dummyPass) {
      setError("");
      navigate("/admin");
    } else {
      setError("Invalid username or password");
    }
  };

  // 🔥 LOGIN WHEN PRESS ENTER
  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSubmit();
    }
  };

  return (
    <div style={{ "background": "url(" + logo + ") ", "backgroundSize": "cover", "overflowX": "hidden", height: "950px", overflowY: "hidden" }}>

      <div className="login-wrapper">

        <div className="login-card">

          <h2 className="login-title">Sign In With Your Account</h2>

          <img src={login} alt="login" className="login-image" />

          <form onSubmit={handleSubmit}>
          <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="login-input"
              onKeyDown={handleKeyPress}   // <-- Enter works here too
            />

             <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="login-input"
              onKeyDown={handleKeyPress}   // <-- Enter triggers login
            />

            <button type="submit" className="login-btn" onClick={handleSubmit}>
              Login
            </button>

            <hr className="login-separator" />
          </form>

        </div>
      </div>
    </div>
  );
}
