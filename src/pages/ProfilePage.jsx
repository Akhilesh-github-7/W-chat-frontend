import React, { useState, useRef } from 'react';
import { useTheme } from '../context/ThemeContext';
import {
  BsMoon, BsBell, BsLock, BsShield, BsPerson, BsQuestionCircle, BsInfoCircle,
  BsChevronRight, BsToggleOn, BsToggleOff, BsCamera, BsChatDots, BsKey, BsDownload, BsCpu, BsArrowLeft, BsBoxArrowRight
} from 'react-icons/bs';
import getAvatarUrl from '../utils/avatar';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; // Import useAuth

const SettingsSection = ({ title, children }) => (
  <div className="mb-4">
    {title && <h3 className="text-sm font-bold mb-2 px-4 text-cyan-400/80 uppercase tracking-wider">{title}</h3>}
    <div className="bg-white/10 backdrop-blur-md rounded-lg overflow-hidden border border-white/20">
      {children}
    </div>
  </div>
);

const SettingsItem = ({ icon, label, rightElement, onClick }) => (
  <div
    className="flex items-center justify-between py-4 px-4 cursor-pointer hover:bg-black/20 transition-colors border-b border-white/10 last:border-b-0"
    onClick={onClick}
  >
    <div className="flex items-center gap-4">
      <div className="text-cyan-300">
        {icon}
      </div>
      <span className="text-white text-base font-medium">{label}</span>
    </div>
    <div className="text-gray-400">{rightElement}</div>
  </div>
);

const ProfilePage = ({ onCloseProfile, onAvatarUpdate, avatar, user }) => {
  const { theme, toggleTheme } = useTheme();
  const [notificationsOn, setNotificationsOn] = useState(true);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleNotificationsToggle = () => {
    setNotificationsOn(!notificationsOn);
  };

  const handleAvatarClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('avatar', file);

    try {
      const token = sessionStorage.getItem('token');
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/users/avatar`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      if (!response.ok) {
        throw new Error('Avatar upload failed');
      }

      const data = await response.json();
      
      if (onAvatarUpdate) {
        onAvatarUpdate(data.avatar);
      }

    } catch (error) {
      console.error('Error uploading avatar:', error);
    }
  };

  const handleLogout = () => {
    logout();
  };

  const currentAvatar = getAvatarUrl(user?.avatar || avatar);

  return (
    <div className="w-full h-full bg-transparent text-white flex flex-col">
      <div className="w-full flex flex-col h-full">
        {/* Header */}
        <div className="w-full flex-none pt-6 pb-4 bg-black/20 backdrop-blur-md relative">
          <div className="absolute top-6 left-4">
            <BsArrowLeft size={24} className="text-white cursor-pointer" onClick={onCloseProfile} />
          </div>
          <div className="text-center text-xl font-bold">Profile</div>
        </div>
        
        {/* Profile Info */}
        <div className="w-full flex-none flex flex-col justify-center items-center pt-8 pb-6">
          <div className="relative w-28 h-28 mb-4">
            <img
              src={currentAvatar}
              alt="User Avatar"
              className="w-full h-full rounded-full object-cover border-4 border-cyan-400/50 shadow-lg"
            />
            <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                className="hidden"
                accept="image/*"
            />
            <div
              onClick={handleAvatarClick}
              className="absolute bottom-0 right-0 bg-cyan-500 p-2.5 rounded-full border-2 border-gray-800 cursor-pointer hover:bg-cyan-400 transition-colors"
            >
              <BsCamera size={20} className="text-white" />
            </div>
          </div>

          <h2 className="text-2xl font-bold mb-1">{user?.name || 'User'}</h2>
          <p className="text-sm text-gray-300">{user?.bio || 'Hey there! I am using W-Chat.'}</p>
        </div>

        {/* Settings List */}
        <div className="w-full flex-grow overflow-y-auto px-4 py-4">
          <SettingsSection>
            <SettingsItem
              icon={<BsKey size={20} />}
              label="Account"
              rightElement={<BsChevronRight size={18} />}
              onClick={() => console.log('Navigate to Account settings')}
            />
            <SettingsItem
              icon={<BsChatDots size={20} />}
              label="Chats"
              rightElement={<BsChevronRight size={18} />}
              onClick={() => console.log('Navigate to Chats settings')}
            />
            <SettingsItem
              icon={<BsBell size={20} />}
              label="Notifications"
              rightElement={
                <div className="flex items-center gap-2" onClick={handleNotificationsToggle}>
                  <span className="text-gray-300">{notificationsOn ? 'On' : 'Off'}</span>
                  <BsChevronRight size={18} />
                </div>
              }
            />
            <SettingsItem
              icon={<BsDownload size={20} />}
              label="Storage and Data"
              rightElement={<BsChevronRight size={18} />}
              onClick={() => console.log('Navigate to Storage and Data settings')}
            />
          </SettingsSection>

          <SettingsSection title="App Settings">
            
          </SettingsSection>

          <SettingsSection>
            <SettingsItem
              icon={<BsQuestionCircle size={20} />}
              label="Help"
              rightElement={<BsChevronRight size={18} />}
              onClick={() => console.log('Navigate to Help page')}
            />
            <SettingsItem
              icon={<BsInfoCircle size={20} />}
              label="About"
              rightElement={<BsChevronRight size={18} />}
              onClick={() => console.log('Navigate to About page')}
            />
            <SettingsItem
              icon={<BsBoxArrowRight size={20} className="text-red-500" />}
              label="Logout"
              onClick={handleLogout}
            />
          </SettingsSection>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
