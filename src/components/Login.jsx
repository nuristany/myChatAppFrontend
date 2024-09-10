import React, { useState} from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";


const Login = ({ onLogin }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "https://web-production-1cf3.up.railway.app/auth/jwt/create",
        // "http://127.0.0.1:8000/auth/jwt/create",
        {
          email,
          password,
        }
      );

      // Save token and inform parent component
      const { access } = response.data;
      onLogin(access);

      setError("");
    } catch (err) {
      console.error("Login error:", err);
      setError("Failed to login. Please check your credentials.");
    }
    navigate("/chat")
  };

  return (
    <div className="login-container">
      <div className="login-content">
        <form onSubmit={handleLogin}>
          <h2>Login</h2>
          <div>
            
            <input
              type="email"
              value={email}
              placeholder="email"
              onChange={(e) => setEmail(e.target.value)}
              required
              />
          </div>
          <div>
           
            <input
              type="password"
              value={password}
              placeholder="password"
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit">Login</button>
          {error && <p style={{ color: "red" }}>{error}</p>}
        </form>
      </div>
    </div>
  );
};

export default Login;
