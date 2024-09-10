import React, { useEffect } from 'react';


function Logout({onLogout}) {
  


  useEffect(() => {
    // Clear the token or any authentication data from storage
    localStorage.removeItem("token"); // If the token is stored in localStorage
    // sessionStorage.removeItem("token"); // If using sessionStorage

    // Redirect to login page after logout
    window.location.href = "/login"

    // navigate("/login")
  }, [onLogout]);

  return (
    <div>
      Logging out...
    </div>
  );
}

export default Logout;
