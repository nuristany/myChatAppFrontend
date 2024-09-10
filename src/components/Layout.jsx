import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';

const Layout = ({ token }) => {
  return (
    <div>
      <Navbar token={token} />
      <main>
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
