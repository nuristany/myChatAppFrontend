import React, { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import "./mobile.css";
import ChatRoom from "./components/ChatRoom";
import Login from "./components/Login";
import Layout from "./components/Layout";
import Register from "./components/Register";
import Home from "./components/Home";
import Logout from "./components/Logout"; // Assuming you create a Logout component

function App() {
  const [token, setToken] = useState(localStorage.getItem("token") || null);

  const handleLogin = (newToken) => {
    setToken(newToken);
    localStorage.setItem("token", newToken); // Save token to localStorage
  };

  const handleLogout = () => {
    setToken(null);
    localStorage.removeItem("token"); // Remove token from localStorage
  };

  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route
            path="/"
            element={<Layout token={token} />}
          >
            <Route index element={<Home />} />

            {/* Public routes */}
            <Route path="/register" element={<Register />} />
            {!token ? (
              <Route path="/login" element={<Login onLogin={handleLogin} />} />
            ) : (
              <>
                {/* Protected routes */}
                <Route path="/chat" element={<ChatRoom token={token} />} />
              </>
            )}
          </Route>

          {/* Move the logout route outside of Layout */}
          <Route
            path="/logout"
            element={<Logout onLogout={handleLogout} />}
          />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
