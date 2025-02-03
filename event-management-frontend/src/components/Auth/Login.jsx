import "./Auth.css";
import { Mail, Key } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";

export default function LoginPage() {
  const [data, setData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const handleChange = ({ currentTarget: input }) => {
    setData({ ...data, [input.name]: input.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); // Clear previous errors
    setSuccess(""); // Clear success message
  
    try {
      const url = "http://localhost:8000/api/auth/login";
      const { data: res } = await axios.post(url, data);
  
      console.log("Login response: ", res);
  
      if (res?.token && res?.user) {
        // Store the response data in localStorage
        localStorage.setItem("token", res.token);
        localStorage.setItem("userType", res.user.type);
        localStorage.setItem("userId", res.user._id); // Fix: Store userId from response
        localStorage.setItem("userName", `${res.user.firstName} ${res.user.lastName}`);
  
        setSuccess("Login successful! Redirecting...");
        
        // Redirect immediately without delay
        if (res.user.type === "student") {
          navigate("/student-dashboard");
        } else if (res.user.type === "organizer") {
          navigate("/organizer-dashboard");
        }
      } else {
        setError("Invalid login response. Please try again.");
      }
    } catch (error) {
      console.error("Login error: ", error);
      setError(
        error.response?.data?.msg || 
        error.response?.data?.message || 
        error.response?.data?.error || 
        "Something went wrong. Please try again."
      );
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-600 to-indigo-800">
      <div className="flex flex-col md:flex-row items-center justify-center w-full max-w-4xl p-6">
        {/* Left Side */}
        <div className="hidden md:flex flex-col  text-left mr-10">
          <h1 className="text-5xl font-bold">Connect with friends and the world.</h1>
          <p className="text-lg mt-3 opacity-90">Login now to stay updated and explore.</p>
        </div>

        {/* Right Side (Login Form) */}
        <div className="bg-white p-8 rounded-xl shadow-lg max-w-sm w-full">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">Login</h2>

          {error && <p className="text-red-500 text-center bg-red-100 p-2 rounded mb-4">{error}</p>}
          {success && <p className="text-green-500 text-center bg-green-100 p-2 rounded mb-4">{success}</p>}

          <form onSubmit={handleSubmit} className="space-y-4">
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

            <button
              type="submit"
              className="w-full bg-blue-600 py-3 rounded-lg font-medium hover:bg-blue-700 transition duration-200 shadow-md"
            >
              Log In
            </button>

            <div className="flex justify-between items-center text-sm mt-4">
              <Link to="/signup" className="text-blue-600 hover:underline">Create new account</Link>
              <Link to="/forgot-password" className="text-gray-600 hover:text-gray-900 transition">Forgot Password?</Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
