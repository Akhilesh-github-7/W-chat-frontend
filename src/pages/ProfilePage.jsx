import React, { useState, useRef } from 'react';
import { useTheme } from '../context/ThemeContext';
import {
  BsMoon, BsBell, BsLock, BsShield, BsPerson, BsQuestionCircle, BsInfoCircle,
  BsChevronRight, BsToggleOn, BsToggleOff, BsCamera, BsChatDots, BsKey, BsDownload, BsCpu, BsArrowLeft, BsBoxArrowRight
} from 'react-icons/bs';
import getAvatarUrl from '../utils/avatar';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const SettingsSection = ({ title, children, theme }) => (
  <div className="mb-4">
    {title && <h3 className={`text-sm font-bold mb-2 px-4 ${theme === 'dark' ? 'text-cyan-400/80' : 'text-blue-600/80'} uppercase tracking-wider`}>{title}</h3>}
    <div className={`${theme === 'dark' ? 'bg-white/10 backdrop-blur-md' : 'bg-white'} rounded-lg overflow-hidden ${theme === 'dark' ? 'border border-white/20' : 'border border-gray-200'}`}>
      {children}
    </div>
  </div>
);

const SettingsItem = ({ icon, label, rightElement, onClick, theme }) => (
  <div
    className={`flex items-center justify-between py-4 px-4 cursor-pointer ${theme === 'dark' ? 'hover:bg-black/20' : 'hover:bg-gray-100'} transition-colors border-b ${theme === 'dark' ? 'border-white/10' : 'border-gray-200'} last:border-b-0`}
    onClick={onClick}
  >
    <div className="flex items-center gap-4">
      <div className={theme === 'dark' ? 'text-cyan-300' : 'text-blue-500'}>
        {icon}
      </div>
      <span className={`${theme === 'dark' ? 'text-white' : 'text-gray-800'} text-base font-medium`}>{label}</span>
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

  const containerStyle = `w-full h-full ${theme === 'dark' ? 'bg-transparent text-white' : 'bg-gray-100 text-gray-800'} flex flex-col`;
  const headerStyle = `w-full flex-none pt-6 pb-4 ${theme === 'dark' ? 'bg-black/20 backdrop-blur-md' : 'bg-white shadow-md'} relative`;
  const profileInfoStyle = `w-full flex-none flex flex-col justify-center items-center pt-8 pb-6 ${theme === 'dark' ? '' : 'bg-white'}`;
  const avatarBorderStyle = `w-full h-full rounded-full object-cover border-4 ${theme === 'dark' ? 'border-cyan-400/50' : 'border-blue-500/50'} shadow-lg`;
  const cameraIconStyle = `absolute bottom-0 right-0 ${theme === 'dark' ? 'bg-cyan-500' : 'bg-blue-500'} p-2.5 rounded-full border-2 ${theme === 'dark' ? 'border-gray-800' : 'border-white'} cursor-pointer ${theme === 'dark' ? 'hover:bg-cyan-400' : 'hover:bg-blue-600'} transition-colors`;
  const userNameStyle = `text-2xl font-bold mb-1 ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`;
  const userBioStyle = `text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`;
  const settingsListStyle = `w-full flex-grow overflow-y-auto px-4 py-4 ${theme === 'dark' ? '' : 'bg-gray-100'}`;

  return (
    <div className={containerStyle}>
      <div className="w-full flex flex-col h-full">
        {/* Header */}
        <div className={headerStyle}>
          <div className="absolute top-6 left-4">
            <BsArrowLeft size={24} className={`${theme === 'dark' ? 'text-white' : 'text-gray-800'} cursor-pointer`} onClick={onCloseProfile} />
          </div>
          <div className={`text-center text-xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>Profile</div>
        </div>
        
        {/* Profile Info */}
        <div className={profileInfoStyle}>
          <div className="relative w-28 h-28 mb-4">
            <img
              src={currentAvatar}
              alt="User Avatar"
              className={avatarBorderStyle}
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
              className={cameraIconStyle}
            >
              <BsCamera size={20} className="text-white" />
            </div>
          </div>

          <h2 className={userNameStyle}>{user?.name || 'User'}</h2>
          <p className={userBioStyle}>{user?.bio || 'Hey there! I am using W-Chat.'}</p>
        </div>

        {/* Settings List */}
        <div className={settingsListStyle}>
          <SettingsSection theme={theme}>
            <SettingsItem
              icon={<BsKey size={20} />}
              label="Account"
              rightElement={<BsChevronRight size={18} />}
              onClick={() => console.log('Navigate to Account settings')}
              theme={theme}
            />
            <SettingsItem
              icon={<BsChatDots size={20} />}
              label="Chats"
              rightElement={<BsChevronRight size={18} />}
              onClick={() => console.log('Navigate to Chats settings')}
              theme={theme}
            />
            <SettingsItem
              icon={<BsBell size={20} />}
              label="Notifications"
              rightElement={
                <div className="flex items-center gap-2" onClick={handleNotificationsToggle}>
                  <span className={theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}>{notificationsOn ? 'On' : 'Off'}</span>
                  <BsChevronRight size={18} />
                </div>
              }
              theme={theme}
            />
            <SettingsItem
              icon={<BsDownload size={20} />}
              label="Storage and Data"
              rightElement={<BsChevronRight size={18} />}
              onClick={() => console.log('Navigate to Storage and Data settings')}
              theme={theme}
            />
          </SettingsSection>

          <SettingsSection title="App Settings" theme={theme}>
            <SettingsItem
              icon={<BsMoon size={20} />}
              label="Theme"
              rightElement={
                <div onClick={toggleTheme} className="cursor-pointer">
                  {theme === 'dark' ? <BsToggleOn size={30} className="text-cyan-400" /> : <BsToggleOff size={30} className="text-gray-500" />}
                </div>
              }
              theme={theme}
            />
          </SettingsSection>

          <SettingsSection theme={theme}>
            <SettingsItem
              icon={<BsQuestionCircle size={20} />}
              label="Help"
              rightElement={<BsChevronRight size={18} />}
              onClick={() => console.log('Navigate to Help page')}
              theme={theme}
            />
            <SettingsItem
              icon={<BsInfoCircle size={20} />}
              label="About"
              rightElement={<BsChevronRight size={18} />}
              onClick={() => console.log('Navigate to About page')}
              theme={theme}
            />
            <SettingsItem
              icon={<BsBoxArrowRight size={20} className="text-red-500" />}
              label="Logout"
              onClick={handleLogout}
              theme={theme}
            />
          </SettingsSection>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
