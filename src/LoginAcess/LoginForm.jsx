import { useState } from 'react';
import './LoginForm.css';
import { User, Lock, Mountain } from 'lucide-react';

export default function LoginForm() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);

  const handleSubmit = () => {
    console.log('Login submitted:', { username, password, rememberMe });
    // Add your login logic here
  };

  return (
    <div className="login-container">
      <div className="login-card">
        {/* Logo */}
        <div className="logo-circle">
          <Mountain size={48} className="logo-icon" />
        </div>

        {/* Title */}
        <h1 className="login-title">LOG IN</h1>

        {/* Form Fields */}
        <div className="login-form">
          {/* Username Field */}
          <div className="input-group">
            <User className="input-icon" size={20} />
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="input-field"
            />
          </div>

          {/* Password Field */}
          <div className="input-group">
            <Lock className="input-icon" size={20} />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input-field"
            />
          </div>

          {/* Remember Me Checkbox */}
          <div className="checkbox-group">
            <input
              type="checkbox"
              id="remember"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="checkbox-input"
            />
            <label htmlFor="remember" className="checkbox-label">
              Remember me
            </label>
          </div>

          {/* Login Button */}
          <button onClick={handleSubmit} className="login-button">
            Login
          </button>
        </div>

        {/* Forgot Password Link */}
        <a href="#" className="forgot-password">
          Forgot Password?
        </a>
      </div>
    </div>
  );
}