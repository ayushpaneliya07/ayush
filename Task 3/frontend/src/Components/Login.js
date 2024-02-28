import React, { useState } from 'react';
import { Link,  useNavigate } from 'react-router-dom';
import './Login.css'; // Importing CSS file for styling

export const Login = () => {
  // State variables to store input values and validation errors
  const navigate = useNavigate();
  
  const [formValue, setformValue] = useState({
    email: "",
    password: ""
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setformValue({
      ...formValue,
      [name]: value,
    });
  };

  const [errors, setErrors] = useState({});

  // Function to handle form submission
  const handleSubmit =async (e) => {
    e.preventDefault();

    // Perform validation
    const errors = {};
    if (!formValue.email) {
      errors.email = 'email is required';
    }
    if (!formValue.password) {
      errors.password = 'Password is required';
    }
 
    
    if (Object.keys(errors).length === 0) {
      try {
        const response = await fetch("http://localhost:3003/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json" 
          },
          body: JSON.stringify(formValue),
        });
        if (response.ok) {
  
          // console.log(await response.json())
          const data = await response.json();
          console.log(data);
          localStorage.setItem("loginUser", JSON.stringify(data));
          navigate("/clockIn")
        } else {
          // const data = await response.json();
          setErrors({password: 'something wrong'})
          // console.log(data.error);
        }
      } catch (error) {
        console.error("somthing worng", error);
      }
    }

    // If there are no errors, proceed with form submission
    console.log('Submitted');
  };

  return (
    <div className="login-container">
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="email">email</label>
          <input
            type="text"
            id="email"
            name='email'
            value={formValue.email}
            onChange={handleChange}
            required
          />
          {errors.email && <span className="error">{errors.email}</span>}
        </div>
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            name='password'
            value={formValue.password}
            onChange={handleChange}
            required
          />
          {errors.password && <span className="error">{errors.password}</span>}
        </div>
        <button type="submit">Login</button>
      </form>
      <div
        className="loginTextCenter"
        style={{ textAlign: 'center', marginBottom: '20px' }}
      >
        Don't have an account? <Link to="/signup">Sign up</Link>
      </div>
    </div>
  );
};
