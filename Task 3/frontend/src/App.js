import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes
} from "react-router-dom";
import Navbar from "./Components/Navbar";
import { Homepage } from "./Components/Homepage";
import { Login } from "./Components/Login";
import { Signup } from "./Components/Signup";

const App = () => {
  return (
    <div>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<Homepage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
        </Routes>
      </Router>
    </div>
  );
};

export default App;
