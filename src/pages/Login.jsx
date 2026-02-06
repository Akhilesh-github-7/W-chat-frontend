import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BsPersonFill, BsLockFill, BsEyeFill, BsEyeSlashFill } from 'react-icons/bs';
import logo from '../assets/images/logo.png';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const Login = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();

  const handleSignIn = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: username, password }),
      });

      const data = await response.json();

      if (response.ok) {
        login(data.token, data);
        toast.success('Welcome back!');
        navigate('/chat');
      } else {
        toast.error(data.message || 'Invalid username or password');
      }
    } catch (error) {
      console.error('Login error:', error);
      toast.error('Connection lost. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-full w-full flex items-center justify-center bg-gray-900 font-inter overflow-hidden relative">
      {/* Animated Background Gradient */}
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-blue-600 via-cyan-500 to-indigo-900 opacity-20 animate-gradient bg-[length:400%_400%]"></div>
      
      {/* Decorative Orbs */}
      <div className="absolute top-[-10%] left-[-10%] w-72 h-72 bg-neon-blue/20 rounded-full blur-[100px] animate-pulse"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-neon-cyan/10 rounded-full blur-[120px] animate-pulse delay-700"></div>

      {/* Main container with glassmorphism */}
      <div className="relative w-full max-w-md p-6 sm:p-10 rounded-none sm:rounded-3xl shadow-2xl bg-white/5 backdrop-blur-xl mobile-no-blur border border-white/10 text-center h-full sm:h-auto flex flex-col justify-center animate-fadeIn">
        <div className="mb-8">
          <img src={logo} alt="Logo" className="mx-auto h-20 sm:h-24 md:h-28 mb-4 drop-shadow-lg hover:scale-105 transition-transform duration-300" />
          <h1 className="text-white text-3xl sm:text-4xl font-bold tracking-tight mb-2">Welcome Back</h1>
          <p className="text-gray-400 text-sm sm:text-base font-script">Chat time? Lets go.</p>
        </div>

        <form onSubmit={handleSignIn} className="space-y-5 sm:space-y-6">
          {/* Username Input */}
          <div className="group relative">
            <BsPersonFill className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-neon-blue transition-colors duration-200" size={20} />
            <input
              type="text"
              placeholder="Username"
              className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-white/5 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-neon-blue/50 border border-white/10 hover:border-white/20 transition-all duration-200"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              disabled={isLoading}
            />
          </div>

          {/* Password Input */}
          <div className="group relative">
            <BsLockFill className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-neon-blue transition-colors duration-200" size={20} />
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              className="w-full pl-12 pr-12 py-3.5 rounded-2xl bg-white/5 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-neon-blue/50 border border-white/10 hover:border-white/20 transition-all duration-200"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={isLoading}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
            >
              {showPassword ? <BsEyeSlashFill size={20} /> : <BsEyeFill size={20} />}
            </button>
          </div>

          {/* Remember Me & Forgot Password */}
          <div className="flex justify-between items-center text-xs sm:text-sm px-1">
            <label className="flex items-center text-gray-400 cursor-pointer group">
              <div className="relative flex items-center">
                <input
                  type="checkbox"
                  className="peer hidden"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                />
                <div className="h-5 w-5 border-2 border-white/20 rounded-md peer-checked:bg-neon-blue peer-checked:border-neon-blue transition-all duration-200 flex items-center justify-center">
                  {rememberMe && (
                    <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="4">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </div>
              </div>
              <span className="ml-2 group-hover:text-gray-300 transition-colors">Remember me</span>
            </label>
            <a href="#" className="text-neon-cyan hover:text-neon-blue transition-colors duration-200 font-medium">
              Forgot password?
            </a>
          </div>

          {/* Sign In Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="group relative w-full overflow-hidden bg-gradient-to-r from-neon-blue to-blue-600 text-white font-bold py-3.5 rounded-2xl focus:outline-none shadow-lg shadow-neon-blue/20 hover:shadow-neon-blue/40 transition-all duration-300 active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed"
          >
            <span className={`flex items-center justify-center transition-all duration-300 ${isLoading ? 'opacity-0' : 'opacity-100'}`}>
              Sign In
            </span>
            {isLoading && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-6 h-6 border-3 border-white/30 border-t-white rounded-full animate-spin"></div>
              </div>
            )}
          </button>
        </form>

        {/* Register Link */}
        <p className="mt-10 text-gray-400 text-sm">
          Dont have an account?{' '}
          <button
            onClick={() => navigate('/register')}
            className="text-neon-cyan hover:text-neon-blue font-bold transition-all duration-200 underline-offset-4 hover:underline"
          >
            Register Now
          </button>
        </p>
      </div>
    </div>
  );
};

export default Login;