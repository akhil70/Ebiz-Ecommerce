import { useState } from "react";
import "./LoginForm.css";

import login from "../images/loginimage.jpg";

import logo from "../images/test.jpg";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import toast from "react-hot-toast";
import { setAuth } from "../store/authSlice";
import { PublicAPI } from "../Utils/AxiosConfig";
import { decodeToken } from "../Utils/tokenDecoder";

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  // Password reset flow state variables
  const [showResetForm, setShowResetForm] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [tempToken, setTempToken] = useState('');
  const [tempUser, setTempUser] = useState(null);
  const [tempRefreshToken, setTempRefreshToken] = useState('');
  const [tempExpiresIn, setTempExpiresIn] = useState('');

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

      const decoded = decodeToken(token);
      const tokenRoles = decoded?.realm_access?.roles || [];
      let mappedRole = data.role || data.data?.role || "";

      if (tokenRoles.includes("admin")) {
        mappedRole = "ADMIN";
      } else if (tokenRoles.includes("seller")) {
        mappedRole = "SELLER";
      } else if (tokenRoles.includes("staff")) {
        mappedRole = "STAFF";
      }

      const user =
        data.user ||
        data.data?.user ||
        {
          username: decoded?.preferred_username || data.preferred_username || data.username || username.trim(),
          email: decoded?.email || data.email || "",
          name: decoded?.name || data.name || "",
          role: mappedRole || "",
        };

      // Check if user is forced to change their password
      if (data.mustChangePassword) {
        setTempToken(token);
        setTempUser(user);
        setTempRefreshToken(data.refresh_token || data.refreshToken || "");
        setTempExpiresIn(String(data.expires_in || data.expiresIn || ""));
        setShowResetForm(true);
        toast('First login: Please update your password.', {
          icon: '🔑',
          style: {
            border: '1px solid #f59e0b',
            padding: '16px',
            color: '#78350f',
            background: '#fef3c7'
          }
        });
        return;
      }

      // Normal flow: Keep all common keys for compatibility with existing token lookups.
      localStorage.setItem("token", token);
      localStorage.setItem("authToken", token);
      localStorage.setItem("accessToken", token);
      localStorage.setItem("refreshToken", data.refresh_token || data.refreshToken || "");
      localStorage.setItem("tokenType", data.token_type || data.tokenType || "Bearer");
      localStorage.setItem("expiresIn", String(data.expires_in || data.expiresIn || ""));
      localStorage.setItem("user", JSON.stringify(user));

      dispatch(setAuth({ user, token }));
      if (user.role === "ADMIN" || user.role === "STAFF") {
        navigate("/Users");
      } else if (user.role === "SELLER") {
        navigate("/Dashboard");
      } else {
        navigate("/");
      }
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

  const handleResetPassword = async (e) => {
    if (e?.preventDefault) e.preventDefault();
    if (!newPassword.trim()) {
      toast.error("Password cannot be blank");
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    setIsSubmitting(true);
    try {
      // Temporarily store token so AxiosConfig request interceptor adds the Bearer header
      localStorage.setItem("token", tempToken);
      localStorage.setItem("authToken", tempToken);
      localStorage.setItem("accessToken", tempToken);

      await PublicAPI.post("/auth/change-password", {
        newPassword: newPassword.trim()
      });

      // Complete storing details in localStorage after successful change
      localStorage.setItem("refreshToken", tempRefreshToken);
      localStorage.setItem("expiresIn", tempExpiresIn);
      localStorage.setItem("user", JSON.stringify(tempUser));

      dispatch(setAuth({ user: tempUser, token: tempToken }));
      toast.success("Password updated successfully!");
      if (tempUser?.role === "ADMIN" || tempUser?.role === "STAFF") {
        navigate("/Users");
      } else if (tempUser?.role === "SELLER") {
        navigate("/Dashboard");
      } else {
        navigate("/");
      }
    } catch (err) {
      // Clean up localStorage if update failed
      localStorage.removeItem("token");
      localStorage.removeItem("authToken");
      localStorage.removeItem("accessToken");
      const message = err?.response?.data?.message || "Failed to update password";
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  // 🔥 LOGIN / RESET WHEN PRESS ENTER
  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !isSubmitting) {
      if (showResetForm) {
        handleResetPassword();
      } else {
        handleSubmit();
      }
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
          {showResetForm ? (
            <>
              <h2 className="login-title">Reset Password</h2>
              <p style={{ color: '#4b5563', fontSize: '13px', margin: '-10px 0 20px 0', textAlign: 'center', lineHeight: '1.4' }}>
                Please set a secure new password for your account to replace your temporary credentials.
              </p>
              
              <form onSubmit={handleResetPassword}>
                <input
                  type="password"
                  placeholder="Enter New Password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="login-input"
                  onKeyDown={handleKeyPress}
                />

                <input
                  type="password"
                  placeholder="Confirm New Password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="login-input"
                  onKeyDown={handleKeyPress}
                />

                <button type="submit" className="login-btn" disabled={isSubmitting}>
                  {isSubmitting ? "Updating Password..." : "Update Password & Login"}
                </button>
              </form>
            </>
          ) : (
            <>
              <h2 className="login-title">Sign In With Your Account</h2>

              <img src={login} alt="login" className="login-image" />

              <form onSubmit={handleSubmit}>
                <input
                  type="text"
                  placeholder="Username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="login-input"
                  onKeyDown={handleKeyPress}
                />

                <input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="login-input"
                  onKeyDown={handleKeyPress}
                />

                <button type="submit" className="login-btn" disabled={isSubmitting}>
                  {isSubmitting ? "Logging in..." : "Login"}
                </button>
                {error && <p style={{ color: "#dc2626", marginTop: "10px", fontSize: "14px" }}>{error}</p>}

                <hr className="login-separator" />
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
