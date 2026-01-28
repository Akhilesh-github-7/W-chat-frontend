import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BsPersonFill, BsLockFill } from 'react-icons/bs'; // For user and padlock icons
import bgImage from '../assets/images/bg.jpg'; // Import the background image
import logo from '../assets/images/logo.png'; // Import the logo image
import { useAuth } from '../context/AuthContext'; // Import useAuth

const Login = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const { login } = useAuth(); // Use login from AuthContext

  const handleSignIn = async (e) => {
    e.preventDefault();
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
        login(data.token, data); // Use context login
        alert('Login successful!');
        navigate('/chat');
      } else {
        alert(data.message || 'Login failed.');
      }
    } catch (error) {
      console.error('Login error:', error);
      alert('An error occurred during login.');
    }
  };

  return (
    <div
      className="flex items-center justify-center min-h-screen font-sans bg-cover bg-center bg-no-repeat p-4 sm:p-0" // Added p-4 for outer margin on small screens
      style={{ backgroundImage: `url(${bgImage})` }}
    >
      <div className="w-full max-w-md p-4 sm:p-8 rounded-lg shadow-2xl bg-opacity-80 backdrop-blur-sm text-center">
        <img src={logo} alt="Logo" className="mx-auto h-16 sm:h-20 md:h-24 mb-2" /> {/* Responsive logo height */}
        <p className="text-blue-200 text-xl sm:text-2xl font-script mb-6 sm:mb-8">Chat time? Lets go.</p>


        <form onSubmit={handleSignIn} className="space-y-4 sm:space-y-6"> {/* Responsive vertical spacing */}
          {/* Username Input */}
          <div className="relative">
            <BsPersonFill className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Username"
              className="w-full pl-12 pr-4 py-3 rounded-xl bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gold-accent border border-gold-accent transition duration-200"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

          {/* Password Input */}
          <div className="relative">
            <BsLockFill className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="password"
              placeholder="Password"
              className="w-full pl-12 pr-4 py-3 rounded-xl bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gold-accent border border-gold-accent transition duration-200"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {/* Remember Me & Forgot Password */}
          <div className="flex justify-between items-center text-sm">
            <label className="flex items-center text-gray-700">
              <input
                type="checkbox"
                className="form-checkbox h-4 w-4 text-gold-accent rounded border-gray-300 focus:ring-gold-accent"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
              />
              <span className="ml-2">Remember me</span>
            </label>
            <a href="#" className="text-gray-600 hover:text-gold-accent transition duration-200">
              Forget your password?
            </a>
          </div>

          {/* Sign In Button */}
          <button
            type="submit"
            className="w-full bg-whatsapp-accent hover:bg-green-600 text-white font-bold py-2 px-6 rounded-full focus:outline-none focus:shadow-outline transition duration-300 ease-in-out"
          >
            Sign In
          </button>
        </form>

        {/* Register Link */}
        <p className="mt-8 text-gray-400 text-sm">
          Do not have account?{' '}
          <a
            href="#"
            onClick={() => navigate('/register')}
            className="text-blue-500 hover:underline font-semibold transition duration-200"
          >
            Register
          </a>
        </p>
      </div>
    </div>
  );
};

export default Login;