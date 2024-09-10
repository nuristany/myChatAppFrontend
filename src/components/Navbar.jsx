import React, { useState } from "react";
import { NavLink } from "react-router-dom";


const Navbar = ({token}) => {
  const [isOpen, setIsOpen] = useState(false);

  // Function to toggle the menu state
  const handleMenuToggle = () => {
    setIsOpen((prev) => !prev);

  };



  return (
    <div>
      <nav className="navbar-desktop">
        <div className="nav-title-container">
          <h3 className="nav-title">MY CHAT APP</h3>
        </div>

        <div
          className={`menue ${isOpen ? "open" : ""}`}
          onClick={handleMenuToggle}
          aria-label="Toggle menu"
          role="button"
          tabIndex="0"
        >
          <span></span>
          <span></span>
          <span></span>
        </div>

        <div>
          {/* Conditional class name based on isOpen state */}

          <ul className={`nav-links ${isOpen ? "open" : ""}`}>
          {token ? (
            <>
            <NavLink to="/logout" onClick={handleMenuToggle}>
              <li>Logout</li>
            </NavLink>

            </>
          ) : (
            <>

            <NavLink to="/" onClick={handleMenuToggle}>
              <li>Home</li>
            </NavLink>
            <NavLink to="/register" onClick={handleMenuToggle}>
              <li>Sign Up</li>
            </NavLink>
            <NavLink to="/login" onClick={handleMenuToggle}>
              <li>Login</li>
            </NavLink>
            </>
            )}
          </ul>
        </div>
      </nav>
    </div>
  );
};

export default Navbar;



