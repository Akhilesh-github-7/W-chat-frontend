import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Sidebar from './components/Sidebar';
import ChatWindow from './components/ChatWindow';
import ProfilePage from './pages/ProfilePage';
import ChatPage from "./pages/ChatPage"; // Import the new ChatPage

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route
        path="/chat"
        element={<ChatPage />} // Render ChatPage here
      />
      <Route path="*" element={<Navigate to="/login" />} />
    </Routes>
  );
}

export default App;