import React, { useState } from 'react';
import './Signup.css'; // Importing CSS file for styling
import { useNavigate } from "react-router-dom";

export const Signup = () => {
  // State variables to store input values
  // const [firstName, setFirstName] = useState('');
  // const [lastName, setLastName] = useState('');
  // const [email, setEmail] = useState('');
  // const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});

  const navigate = useNavigate();
  const [formValue, setFormValue] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
   
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
  
    setFormValue({
      ...formValue,
      [name]: value,
    });
  };
  

  // const { firstName, lastName } = formValue;
  

  // Function to handle form submission
  const handleSubmit =async (e) => {
    e.preventDefault();
    // Validation logic
    const errors = {};
    if (!formValue.firstName) {
      errors.firstName = "First name is required";
    }
    if (!formValue.lastName) {
      errors.lastName = "Last name is required";
    }
    if (!formValue.email) {
      errors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formValue.email)) {
      errors.email = "Email address is invalid";
    }
    if (!formValue.password) {
      errors.password = "Password is required";
    } else if (formValue.password.length < 6) {
      errors.password = "Password must be at least 6 characters long";
    }

     const formData = {
      firstName: formValue.firstName,
      lastName: formValue.lastName,
      email: formValue.email,
      password: formValue.password,
    };
   
    // const formData = new FormData();
    // formData.append('firstName', formValue.firstName);
    // formData.append('lastName', formValue.lastName);
    // formData.append('email', formValue.email);
    // formData.append('password', formValue.password);

    setErrors(errors);
    if (Object.keys(errors).length === 0) {
      try {
        const response = await fetch("http://localhost:3003/signup", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
          // body: formData
        });

        if (response.ok) {
          const data = await response.json();
          console.log(data);
          navigate("/login");
        } else {
          const data = await response.json();
          alert(data.error);
          // setErrors({email: 'email already used'})
        }
      } catch (error) {
        console.error("Error registering users :", error);
        alert("Failed to register user");
      }
    }
  };

  return (
    <div className="signup-container">
      <h2>Signup</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="firstName">First Name:</label>
          <input
            type="text"
            id="firstName"
            name='firstName'
            value={formValue.firstName}
            onChange={handleChange}
            required
          />
          {errors.firstName && <span className="error">{errors.firstName}</span>}
        </div>
        <div className="form-group">
          <label htmlFor="lastName">Last Name:</label>
          <input
            type="text"
            id="lastName"
            name='lastName'
            value={formValue.lastName}
            onChange={handleChange}
            required
          />
          {errors.lastName && <span className="error">{errors.lastName}</span>}
        </div>
        <div className="form-group">
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            name='email'
            value={formValue.email}
            onChange={handleChange}
            required
          />
          {errors.email && <span className="error">{errors.email}</span>}
        </div>
        <div className="form-group">
          <label htmlFor="password">Password:</label>
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
        <button type="submit">Signup</button>
      </form>
    </div>
  );
};
