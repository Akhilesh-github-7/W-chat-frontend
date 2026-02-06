import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BsPersonFill, BsLockFill, BsEnvelopeFill, BsEyeFill, BsEyeSlashFill } from 'react-icons/bs';
import logo from '../assets/images/logo.png';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const Register = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();

  const handleSignUp = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error("Passwords do not match!");
      return;
    }

    if (password.length < 6) {
      toast.error("Password must be at least 6 characters long.");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: username, email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        login(data.token, data);
        toast.success('Registration successful!');
        navigate('/chat');
      } else {
        toast.error(data.message || 'Registration failed. Try a different username or email.');
      }
    } catch (error) {
      console.error('Registration error:', error);
      toast.error('Connection lost. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-dvh w-dvw flex items-center justify-center bg-gray-900 font-inter overflow-hidden relative">
      {/* Animated Background Gradient */}
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-blue-600 via-cyan-500 to-indigo-900 opacity-20 animate-gradient bg-[length:400%_400%]"></div>
      
      {/* Decorative Orbs */}
      <div className="absolute top-[-10%] right-[-10%] w-72 h-72 bg-neon-blue/20 rounded-full blur-[100px] animate-pulse"></div>
      <div className="absolute bottom-[-10%] left-[-10%] w-96 h-96 bg-neon-cyan/10 rounded-full blur-[120px] animate-pulse delay-700"></div>

      {/* Main container with glassmorphism */}
      <div className="relative w-full max-w-md p-6 sm:p-10 rounded-none sm:rounded-3xl shadow-2xl bg-white/5 backdrop-blur-xl border border-white/10 text-center h-dvh sm:h-auto flex flex-col justify-center animate-fadeIn">
        <div className="mb-6">
          <img src={logo} alt="Logo" className="mx-auto h-16 sm:h-20 md:h-24 mb-3 drop-shadow-lg hover:scale-105 transition-transform duration-300" />
          <h1 className="text-white text-2xl sm:text-3xl font-bold tracking-tight mb-1">Create Account</h1>
          <p className="text-gray-400 text-sm sm:text-base font-script italic">Powered by people. Connected by you</p>
        </div>

        <form onSubmit={handleSignUp} className="space-y-4 sm:space-y-5">
          {/* Username Input */}
          <div className="group relative">
            <BsPersonFill className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-neon-blue transition-colors duration-200" size={18} />
            <input
              type="text"
              placeholder="Username"
              className="w-full pl-11 pr-4 py-3 rounded-xl bg-white/5 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-neon-blue/50 border border-white/10 hover:border-white/20 transition-all duration-200 text-sm"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              disabled={isLoading}
            />
          </div>

          {/* Email Input */}
          <div className="group relative">
            <BsEnvelopeFill className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-neon-blue transition-colors duration-200" size={18} />
            <input
              type="email"
              placeholder="Email"
              className="w-full pl-11 pr-4 py-3 rounded-xl bg-white/5 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-neon-blue/50 border border-white/10 hover:border-white/20 transition-all duration-200 text-sm"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={isLoading}
            />
          </div>

          {/* Password Input */}
          <div className="group relative">
            <BsLockFill className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-neon-blue transition-colors duration-200" size={18} />
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              className="w-full pl-11 pr-11 py-3 rounded-xl bg-white/5 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-neon-blue/50 border border-white/10 hover:border-white/20 transition-all duration-200 text-sm"
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
              {showPassword ? <BsEyeSlashFill size={18} /> : <BsEyeFill size={18} />}
            </button>
          </div>

          {/* Confirm Password Input */}
          <div className="group relative">
            <BsLockFill className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-neon-blue transition-colors duration-200" size={18} />
            <input
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Confirm Password"
              className="w-full pl-11 pr-11 py-3 rounded-xl bg-white/5 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-neon-blue/50 border border-white/10 hover:border-white/20 transition-all duration-200 text-sm"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              disabled={isLoading}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
            >
              {showConfirmPassword ? <BsEyeSlashFill size={18} /> : <BsEyeFill size={18} />}
            </button>
          </div>

          {/* Sign Up Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="group relative w-full overflow-hidden bg-gradient-to-r from-neon-blue to-blue-600 text-white font-bold py-3.5 rounded-2xl focus:outline-none shadow-lg shadow-neon-blue/20 hover:shadow-neon-blue/40 transition-all duration-300 active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed"
          >
            <span className={`flex items-center justify-center transition-all duration-300 ${isLoading ? 'opacity-0' : 'opacity-100'}`}>
              Create Account
            </span>
            {isLoading && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-5 h-5 border-3 border-white/30 border-t-white rounded-full animate-spin"></div>
              </div>
            )}
          </button>
        </form>

        {/* Login Link */}
        <p className="mt-8 text-gray-400 text-sm">
          Already have an account?{' '}
          <button
            onClick={() => navigate('/login')}
            className="text-neon-cyan hover:text-neon-blue font-bold transition-all duration-200 underline-offset-4 hover:underline"
          >
            Login
          </button>
        </p>
      </div>
    </div>
  );
};

export default Register;

