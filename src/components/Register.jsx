import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

function Register() {
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); // Reset error before validation

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      const response = await fetch("https://web-production-1cf3.up.railway.app/auth/users/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: formData.username,
          email: formData.email,
          password: formData.password,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.detail || "Failed to register user");
      }

      // Show SweetAlert to prompt for OTP
      const { value: otpCode } = await Swal.fire({
        title: "Enter OTP",
        input: "text",
        inputLabel: "OTP Code",
        inputPlaceholder: "Enter the OTP sent to your email",
        showCancelButton: true,
      });

      if (otpCode) {
        await verifyOtp(otpCode, formData.email);
      } else {
        Swal.fire("Error", "OTP was not entered.", "error");
      }
    } catch (error) {
      console.error("Error registering user:", error.message);
      setError(`Registration error: ${error.message}`);
    }
  };

  const verifyOtp = async (otpCode, email) => {
    try {
      console.log("OTP Code:", otpCode); // Debugging OTP value
      console.log("Registered User Email:", email); // Debugging email value

      if (!email) {
        Swal.fire("Error", "Email not set. Please try again.", "error");
        return;
      }

      const response = await fetch("https://web-production-1cf3.up.railway.app/verify-otp/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          otp_code: otpCode,
          email: email, // Send the user's email with the OTP code
        }),
      });

      const data = await response.json();

      console.log("OTP Verification Response Data:", data); // Debugging API response

      if (response.ok) {
        Swal.fire("Success!", "Your account has been verified.", "success");
        navigate("/login");
      } else {
        Swal.fire("Error", data.detail || "OTP verification failed.", "error");
      }
    } catch (error) {
      console.error("Error during OTP verification:", error.message);
      Swal.fire("Error", `OTP verification error: ${error.message}`, "error");
    }
  };

  return (
    <div className="register-wrapper">
      <div className="register-container">
        <div className="register">
          <h2>Sign Up</h2>
          {error && <p className="error">{error}</p>}
          <form onSubmit={handleSubmit}>
            <div className="register-input">
              <input
                name="username"
                placeholder="Username"
                value={formData.username}
                onChange={handleChange}
              />
              <input
                name="email"
                placeholder="Email"
                type="email"
                value={formData.email}
                onChange={handleChange}
              />
            </div>
            <div className="register-input2">
              <input
                name="password"
                placeholder="Password"
                type="password"
                value={formData.password}
                onChange={handleChange}
              />
              <input
                name="confirmPassword"
                placeholder="Confirm Password"
                type="password"
                value={formData.confirmPassword}
                onChange={handleChange}
              />
            </div>
            <button type="submit">Register</button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Register;