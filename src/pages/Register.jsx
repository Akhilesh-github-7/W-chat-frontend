import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BsPersonFill, BsLockFill, BsEnvelopeFill } from 'react-icons/bs';
import logo from '../assets/images/logo.png'; // Import the logo image
import { useAuth } from '../context/AuthContext'; // Import useAuth

const Register = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const { login } = useAuth(); // Use login from AuthContext

    const handleSignUp = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

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
        login(data.token, data); // Use context login
        alert('Registration successful and logged in!');
        navigate('/chat');
      } else {
        alert(data.message || 'Registration failed.');
      }
    } catch (error) {
      console.error('Registration error:', error);
      alert('An error occurred during registration.');
    }
  };

  return (
    <div className="h-svh w-dvw flex items-center justify-center bg-gray-900 font-inter">
      {/* Background Gradient */}
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-blue-500 via-cyan-500 to-blue-700 opacity-30 animate-gradient"></div>

      {/* Main container with glassmorphism */}
      <div className="relative w-full max-w-md p-4 sm:p-8 rounded-2xl shadow-2xl bg-white/10 backdrop-blur-lg text-center">
        <img src={logo} alt="Logo" className="mx-auto h-16 sm:h-20 md:h-24 mb-2" /> {/* Responsive logo height */}
        <p className="text-blue-200 text-xl sm:text-2xl font-script mb-6 sm:mb-8">Powered by people. Connected by you</p>


        <form onSubmit={handleSignUp} className="space-y-4 sm:space-y-6"> {/* Responsive vertical spacing */}
          {/* Username Input */}
          <div className="relative">
            <BsPersonFill className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Username"
              className="w-full pl-12 pr-4 py-3 rounded-xl bg-black/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-neon-blue border border-gray-600 transition duration-200"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

          {/* Email Input */}
          <div className="relative">
            <BsEnvelopeFill className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="email"
              placeholder="Email"
              className="w-full pl-12 pr-4 py-3 rounded-xl bg-black/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-neon-blue border border-gray-600 transition duration-200"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          {/* Password Input */}
          <div className="relative">
            <BsLockFill className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="password"
              placeholder="Password"
              className="w-full pl-12 pr-4 py-3 rounded-xl bg-black/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-neon-blue border border-gray-600 transition duration-200"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {/* Confirm Password Input */}
          <div className="relative">
            <BsLockFill className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} /> {/* Re-using padlock for confirm */}
            <input
              type="password"
              placeholder="Confirm Password"
              className="w-full pl-12 pr-4 py-3 rounded-xl bg-black/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-neon-blue border border-gray-600 transition duration-200"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>

          {/* Sign Up Button */}
          <button
            type="submit"
            className="w-full bg-neon-blue/80 hover:bg-neon-blue text-white font-bold py-2 px-6 rounded-full focus:outline-none focus:shadow-outline transition duration-300 ease-in-out"
          >
            Sign Up
          </button>
        </form>

        {/* Login Link */}
        <p className="mt-8 text-gray-200 text-sm">
          Already have an account?{' '}
          <a
            href="#"
            onClick={() => navigate('/login')}
            className="text-neon-cyan hover:underline font-semibold transition duration-200"
          >
            Login
          </a>
        </p>
      </div>
    </div>
  );
};

export default Register;
