import { Mail, Key, User, Eye, EyeOff } from "lucide-react";
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
    confirmPassword: "",
    type: "student",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL
  const handleChange = ({ currentTarget: input }) => {
    setData({ ...data, [input.name]: input.value });
  };
  axios.defaults.withCredentials = true;
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (data.password !== data.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    try {
      const url = 'https://event-management-system-e2ip.vercel.app/api/auth/register';
      const { data: res } = await axios.post(url, data);

      console.log("Signup response: ", res);

      if (res.token) {
        localStorage.setItem("token", res.token);
        setSuccess("Account created successfully! Redirecting...");
        setTimeout(() => navigate("/"), 2000);
      } else {
        setError("Signup failed. Please try again.");
      }
    } catch (error) {
      if (error.response && error.response.status >= 400 && error.response.status <= 500) {
        setError(error.response.data.msg || "An error occurred during sign-up.");
      } else {
        setError("Something went wrong. Please try again later.");
      }
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-purple-700 via-blue-600 to-indigo-900 overflow-hidden">
      {/* Background Animation */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.1),transparent)] animate-pulse-slow" />

      <div className="flex flex-col md:flex-row items-center justify-center w-full max-w-5xl p-6 relative z-10">
        {/* Left Side - Welcome Text */}
        <div className="hidden md:flex flex-col text-left mr-12 text-white drop-shadow-lg">
          <h1 className="text-5xl font-extrabold tracking-tight leading-tight">
            Join the Adventure!
          </h1>
          <p className="text-xl mt-4 opacity-80 font-light">
            Sign up to create and explore events.
          </p>
        </div>

        {/* Right Side - Signup Form */}
        <div className="bg-white/10 backdrop-blur-xl border border-white/20 p-8 rounded-2xl shadow-2xl max-w-md w-full transform transition-all hover:scale-105">
          <h2 className="text-4xl font-bold text-center text-white mb-6 drop-shadow-md">
            Create Account
          </h2>

          {error && (
            <p className="text-red-300 text-center bg-red-900/30 p-3 rounded-lg mb-4 shadow-inner">
              {error}
            </p>
          )}
          {success && (
            <p className="text-green-300 text-center bg-green-900/30 p-3 rounded-lg mb-4 shadow-inner">
              {success}
            </p>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              {/* First Name */}
              <div className="relative group">
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-300 group-focus-within:text-purple-400 transition-colors">
                  <User size={20} />
                </div>
                <input
                  className="w-full p-3 pl-12 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-500 focus:outline-none transition-all duration-300 shadow-md hover:bg-white/10"
                  type="text"
                  name="firstName"
                  placeholder="First Name"
                  onChange={handleChange}
                  value={data.firstName}
                  required
                />
              </div>

              {/* Last Name */}
              <div className="relative group">
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-300 group-focus-within:text-purple-400 transition-colors">
                  <User size={20} />
                </div>
                <input
                  className="w-full p-3 pl-12 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-500 focus:outline-none transition-all duration-300 shadow-md hover:bg-white/10"
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
            <div className="relative group">
              <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-300 group-focus-within:text-purple-400 transition-colors">
                <Mail size={20} />
              </div>
              <input
                className="w-full p-3 pl-12 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-500 focus:outline-none transition-all duration-300 shadow-md hover:bg-white/10"
                type="email"
                name="email"
                placeholder="Enter your email"
                onChange={handleChange}
                value={data.email}
                required
              />
            </div>

            {/* Password */}
            <div className="relative group">
              <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-300 group-focus-within:text-purple-400 transition-colors">
                <Key size={20} />
              </div>
              <input
                className="w-full p-3 pl-12 pr-12 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-500 focus:outline-none transition-all duration-300 shadow-md hover:bg-white/10"
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Enter your password"
                onChange={handleChange}
                value={data.password}
                required
              />
              <div
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-300 hover:text-purple-400 cursor-pointer transition-colors"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </div>
            </div>

            {/* Confirm Password */}
            <div className="relative group">
              <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-300 group-focus-within:text-purple-400 transition-colors">
                <Key size={20} />
              </div>
              <input
                className="w-full p-3 pl-12 pr-12 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-500 focus:outline-none transition-all duration-300 shadow-md hover:bg-white/10"
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                placeholder="Confirm your password"
                onChange={handleChange}
                value={data.confirmPassword}
                required
              />
              <div
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-300 hover:text-purple-400 cursor-pointer transition-colors"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </div>
            </div>

            {/* User Type */}
            <div>
              <label className="block text-sm font-medium text-gray-200 mb-1">
                User Type
              </label>
              <select
                className="w-full p-3 bg-white/5 border border-white/10 rounded-lg text-white focus:ring-2 focus:ring-purple-500 focus:outline-none transition-all duration-300 shadow-md hover:bg-white/10"
                name="type"
                value={data.type}
                onChange={handleChange}
              >
                <option value="student" className="bg-gray-800">
                  Student
                </option>
                <option value="organizer" className="bg-gray-800">
                  Organizer
                </option>
              </select>
            </div>

            {/* Sign Up Button */}
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-purple-600 to-blue-600 py-3 rounded-lg font-semibold text-white shadow-lg hover:from-purple-700 hover:to-blue-700 transition-all duration-300 transform hover:-translate-y-1 active:scale-95"
            >
              Sign Up
            </button>

            {/* Link to Login */}
            <div className="text-center text-sm mt-4 text-gray-200">
              Already have an account?{" "}
              <Link
                to="/"
                className="hover:text-purple-400 transition-colors duration-200 font-medium"
              >
                Login
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
