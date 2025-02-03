import { Mail, Key, User } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import "./Auth.css";

export default function SignupPage() {
  const [data, setData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    type: "student",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const handleChange = ({ currentTarget: input }) => {
    setData({ ...data, [input.name]: input.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Correct API URL for registration
      const url = "http://localhost:8000/api/auth/register"; 

      const { data: res } = await axios.post(url, data);

      console.log("Signup response: ", res);

      if (res.token) {
        // If registration is successful, store the token and show success message
        localStorage.setItem("token", res.token);
        setSuccess("Account created successfully! Redirecting...");
      } else {
        setError("Signup failed. Please try again.");
        return;
      }

      // Redirect to the login page after 2 seconds
      setTimeout(() => navigate("/"), 2000); 
    } catch (error) {
      // Display error message based on backend response
      if (error.response && error.response.status >= 400 && error.response.status <= 500) {
        setError(error.response.data.msg || "An error occurred during sign-up.");
      } else {
        setError("Something went wrong. Please try again later.");
      }
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-600 to-indigo-800">
      <div className="flex flex-col md:flex-row items-center justify-center w-full max-w-5xl p-6">
        {/* Left Side - Welcome Text */}
        <div className="hidden md:flex flex-col text-left mr-10">
          <h1 className="text-5xl font-bold">Join Us Today!</h1>
          <p className="text-lg mt-3 opacity-90">Sign up and start exploring the platform.</p>
        </div>

        {/* Right Side - Signup Form */}
        <div className="bg-white p-8 rounded-xl shadow-lg max-w-sm w-full">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">Sign Up</h2>

          {/* Displaying Success or Error messages */}
          {error && <p className="text-red-500 text-center bg-red-100 p-2 rounded mb-4">{error}</p>}
          {success && <p className="text-green-500 text-center bg-green-100 p-2 rounded mb-4">{success}</p>}

          {/* Signup Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              {/* First Name */}
              <div className="relative">
                <div className="absolute left-3 top-3 text-gray-500">
                  <User size={20} />
                </div>
                <input
                  className="w-full p-3 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition shadow-sm"
                  type="text"
                  name="firstName"
                  placeholder="First Name"
                  onChange={handleChange}
                  value={data.firstName}
                  required
                />
              </div>

              {/* Last Name */}
              <div className="relative">
                <div className="absolute left-3 top-3 text-gray-500">
                  <User size={20} />
                </div>
                <input
                  className="w-full p-3 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition shadow-sm"
                  type="text"
                  name="lastName"
                  placeholder="Last Name"
                  onChange={handleChange}
                  value={data.lastName}
                  required
                />
              </div>
            </div>

            {/* Email */}
            <div className="relative">
              <div className="absolute left-3 top-3 text-gray-500">
                <Mail size={20} />
              </div>
              <input
                className="w-full p-3 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition shadow-sm"
                type="email"
                name="email"
                placeholder="Enter your email"
                onChange={handleChange}
                value={data.email}
                required
              />
            </div>

            {/* Password */}
            <div className="relative">
              <div className="absolute left-3 top-3 text-gray-500">
                <Key size={20} />
              </div>
              <input
                className="w-full p-3 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition shadow-sm"
                type="password"
                name="password"
                placeholder="Enter your password"
                onChange={handleChange}
                value={data.password}
                required
              />
            </div>

            {/* User Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">User Type</label>
              <select
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition shadow-sm"
                name="type"
                value={data.type}
                onChange={handleChange}
              >
                <option value="student">Student</option>
                <option value="organizer">Organizer</option>
              </select>
            </div>

            {/* Sign Up Button */}
            <button
              type="submit"
              className="w-full bg-blue-600 py-3 rounded-lg font-medium hover:bg-blue-700 transition duration-200 shadow-md"
            >
              Sign Up
            </button>

            {/* Link to Login */}
            <div className="text-center text-sm mt-4">
              Already have an account?{" "}
              <Link to="/login" className="text-blue-600 hover:underline">Login</Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
