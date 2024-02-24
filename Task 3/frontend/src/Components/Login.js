import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Login.css'; // Importing CSS file for styling

export const Login = () => {
  // State variables to store input values
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  // Function to handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you can add logic to handle form submission, such as sending data to a server for authentication
    console.log("Submitted");
  };

  return (
    <div className="login-container">
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="username">Username:</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit">Login</button>
      </form>
      <div
              className="loginTextCenter"
              style={{ textAlign: "center", marginBottom: "20px" }}
            >
              Don't have any account ? <Link to="/signup">sign up</Link>
            </div>
    </div>
  );
};
