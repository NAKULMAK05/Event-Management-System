import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./components/Auth/Login";
import Signup from "./components/Auth/Signup";
import StudentDashboard from "./components/Dashboard/StudentDashboard";
import OrganizerDashboard from "./components/Dashboard/OrganizerDashboard";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/student-dashboard" element={<StudentDashboard />} />
        <Route path="/organizer-dashboard" element={<OrganizerDashboard />} />
      </Routes>
    </Router>
  );
};

export default App;
