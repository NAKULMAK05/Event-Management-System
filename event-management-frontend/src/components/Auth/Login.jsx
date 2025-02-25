import "./Auth.css"; // Keep this if you have additional custom styles
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
    setError("");
    setSuccess("");

    try {
      const url = `${API_BASE_URL}/api/auth/login`;
      const { data: res } = await axios.post(url, data);

      console.log("Login response: ", res);

      if (res?.token && res?.user) {
        localStorage.setItem("token", res.token);
        localStorage.setItem("userType", res.user.type);
        localStorage.setItem("userId", res.user._id);
        localStorage.setItem("userName", `${res.user.firstName} ${res.user.lastName}`);

        setSuccess("Login successful! Redirecting...");

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
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-purple-700 via-blue-600 to-indigo-900 overflow-hidden">
      {/* Background Animation (Optional subtle effect) */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.1),transparent)] animate-pulse-slow" />

      <div className="flex flex-col md:flex-row items-center justify-center w-full max-w-5xl p-6 relative z-10">
        {/* Left Side */}
        <div className="hidden md:flex flex-col text-left mr-12 text-white drop-shadow-lg">
          <h1 className="text-5xl font-extrabold tracking-tight leading-tight">
            Connect with Friends <br /> & the World
          </h1>
          <p className="text-xl mt-4 opacity-80 font-light">
            Login to explore events and stay connected.
          </p>
        </div>

        {/* Right Side (Login Form) */}
        <div className="bg-white/10 backdrop-blur-xl border border-white/20 p-8 rounded-2xl shadow-2xl max-w-md w-full transform transition-all hover:scale-105">
          <h2 className="text-4xl font-bold text-center text-white mb-6 drop-shadow-md">
            Welcome Back
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

            <div className="relative group">
              <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-300 group-focus-within:text-purple-400 transition-colors">
                <Key size={20} />
              </div>
              <input
                className="w-full p-3 pl-12 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-500 focus:outline-none transition-all duration-300 shadow-md hover:bg-white/10"
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
              className="w-full bg-gradient-to-r from-purple-600 to-blue-600 py-3 rounded-lg font-semibold text-white shadow-lg hover:from-purple-700 hover:to-blue-700 transition-all duration-300 transform hover:-translate-y-1 active:scale-95"
            >
              Log In
            </button>

            <div className=" flex justify-between items-center text-sm mt-4 text-gray-200">
              <Link
                to="/signup"
                className=" hover:text-purple-400 transition-colors duration-200 font-medium"
              >
                Create new account
              </Link>
              <Link
                to="/forgot-password"
                className=" text-white hover:text-blue-400  transition-colors duration-200 font-medium"
              >
                Forgot Password?
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
