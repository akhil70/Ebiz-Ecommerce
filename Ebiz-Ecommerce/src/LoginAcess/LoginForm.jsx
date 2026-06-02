import { useState } from "react";
import "./LoginForm.css";

import login from "../images/loginimage.jpg";

import logo from "../images/test.jpg";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import toast from "react-hot-toast";
import { setAuth } from "../store/authSlice";
import { PublicAPI } from "../Utils/AxiosConfig";

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [error, setError] = useState('');

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleSubmit = async (e) => {
    if (e?.preventDefault) e.preventDefault();

    if (!username.trim() || !password.trim()) {
      setError("Username and password are required");
      toast.error("Username and password are required");
      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      const response = await PublicAPI.post("/auth/login", {
        username: username.trim(),
        password,
      });

      const data = response?.data || {};
      const token =
        data.access_token ||
        data.token ||
        data.accessToken ||
        data.jwtToken ||
        data.jwt ||
        data.data?.access_token ||
        data.data?.token ||
        data.data?.accessToken;

      if (!token) {
        setError("Login succeeded but token was not returned");
        toast.error("Login succeeded but token was not returned");
        return;
      }

      const user =
        data.user ||
        data.data?.user ||
        {
          username: data.preferred_username || data.username || username.trim(),
          email: data.email || "",
          name: data.name || "",
          role: data.role || data.data?.role || "",
        };

      // Keep all common keys for compatibility with existing token lookups.
      localStorage.setItem("token", token);
      localStorage.setItem("authToken", token);
      localStorage.setItem("accessToken", token);
      localStorage.setItem("refreshToken", data.refresh_token || data.refreshToken || "");
      localStorage.setItem("tokenType", data.token_type || data.tokenType || "Bearer");
      localStorage.setItem("expiresIn", String(data.expires_in || data.expiresIn || ""));
      localStorage.setItem("user", JSON.stringify(user));

      dispatch(setAuth({ user, token }));
      navigate("/Dashboard");
    } catch (err) {
      const message =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        "Invalid username or password";
      setError(message);
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  // 🔥 LOGIN WHEN PRESS ENTER
  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !isSubmitting) {
      handleSubmit();
    }
  };

  return (
    <div
      className="login-page"
      style={{
        backgroundImage: `url(${logo})`,
        overflowX: "hidden"
      }}
    >
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

            <button type="submit" className="login-btn" disabled={isSubmitting}>
              {isSubmitting ? "Logging in..." : "Login"}
            </button>
            {error && <p style={{ color: "#dc2626", marginTop: "10px", fontSize: "14px" }}>{error}</p>}

            <hr className="login-separator" />
          </form>

        </div>
      </div>
    </div>
  );
}
