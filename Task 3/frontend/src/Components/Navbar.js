import React from 'react';
import { Link } from 'react-router-dom'; 
import './Navbar.css';

const Navbar = () => {
  return (
    <nav className="navbar">
        <ul>
        <li className="nav-item">
          <Link to="/" className="nav-link">PunchInOut</Link>
        </li>
        </ul>
        <ul className="navbar-nav">
        <li className="nav-item">
          <Link to="/login" className="nav-link">Login</Link>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
