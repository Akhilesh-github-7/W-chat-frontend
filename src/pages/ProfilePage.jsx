import React, { useState, useRef } from 'react';
import { useTheme } from '../context/ThemeContext';
import {
  BsMoon, BsBell, BsLock, BsShield, BsPerson, BsQuestionCircle, BsInfoCircle,
  BsChevronRight, BsToggleOn, BsToggleOff, BsCamera, BsChatDots, BsKey, BsDownload, BsCpu, BsArrowLeft, BsBoxArrowRight
} from 'react-icons/bs';
import getAvatarUrl from '../utils/avatar';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; // Import useAuth

const SettingsSection = ({ title, children, theme }) => (
  <div className="mb-4">
    {title && <h3 className={`text-sm font-semibold mb-2 px-4 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>{title}</h3>}
    <div className={`${theme === 'dark' ? 'bg-gray-700' : 'bg-white'} overflow-hidden`}>
      {children}
    </div>
  </div>
);

const SettingsItem = ({ icon, label, rightElement, onClick, theme }) => (
  <div
    className={`flex items-center justify-between py-3 px-4 cursor-pointer ${theme === 'dark' ? 'hover:bg-gray-600' : 'hover:bg-gray-100'} border-b ${theme === 'dark' ? 'border-gray-600' : 'border-gray-200'} last:border-b-0`}
    onClick={onClick}
  >
    <div className="flex items-center gap-4">
      <div className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
        {icon}
      </div>
      <span className={`${theme === 'dark' ? 'text-white' : 'text-gray-800'} text-base`}>{label}</span>
    </div>
    <div>{rightElement}</div>
  </div>
);

const ProfilePage = ({ onCloseProfile, onAvatarUpdate, avatar, user }) => {
  const { theme, toggleTheme } = useTheme();
  const [notificationsOn, setNotificationsOn] = useState(true);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();
  const { logout } = useAuth(); // Use logout from AuthContext

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

      const data = await response.json(); // data.avatar is the relative path
      
      if (onAvatarUpdate) {
        onAvatarUpdate(data.avatar); // Pass the relative path up to the parent
      }

    } catch (error) {
      console.error('Error uploading avatar:', error);
      // Handle error display to the user
    }
  };

  const handleLogout = () => {
    logout(); // Use context logout
  };

  const currentAvatar = getAvatarUrl(user?.avatar || avatar);


  return (
    <div className={`w-full h-full ${theme === 'dark' ? 'bg-whatsapp-dark-bg-primary' : 'bg-gray-200'} flex flex-col`}>
      <div className="w-full flex flex-col h-full">
        <div className={`w-full flex-none flex flex-col justify-center items-center pt-3 pb-3 ${theme === 'dark' ? 'bg-whatsapp-dark-bg-secondary' : 'bg-white'} relative`}>
          <div className="absolute top-4 left-4">
            <BsArrowLeft size={24} className={`${theme === 'dark' ? 'text-white' : 'text-gray-900'} cursor-pointer`} onClick={onCloseProfile} />
          </div>
          
          <div className="relative w-24 h-24 mb-4">
            <img
              src={currentAvatar}
              alt="User Avatar"
              className="w-full h-full rounded-full object-cover border-4 border-white shadow-lg"
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
              className="absolute bottom-0 right-0 bg-whatsapp-accent p-2 rounded-full border-2 border-white cursor-pointer"
            >
              <BsCamera size={18} className="text-white" />
            </div>
          </div>

          <h2 className={`text-xl sm:text-2xl font-semibold mb-1 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{user?.name || 'User'}</h2>
          <p className={`text-xs sm:text-sm mb-4 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>{user?.bio || 'Hey there! I am using W-Chat.'}</p>
        </div>

        <div className={`w-full flex-grow overflow-y-auto ${theme === 'dark' ? 'bg-whatsapp-dark-bg-primary' : 'bg-gray-200'} py-4`}>
          <SettingsSection theme={theme}>
            <SettingsItem
              icon={<BsKey size={20} />}
              label="Account"
              rightElement={<BsChevronRight size={18} className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`} />}
              onClick={() => console.log('Navigate to Account settings')}
              theme={theme}
            />
            <SettingsItem
              icon={<BsChatDots size={20} />}
              label="Chats"
              rightElement={<BsChevronRight size={18} className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`} />}
              onClick={() => console.log('Navigate to Chats settings')}
              theme={theme}
            />
            <SettingsItem
              icon={<BsBell size={20} />}
              label="Notifications"
              rightElement={
                <div className="flex items-center gap-2" onClick={handleNotificationsToggle}>
                  <span className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>{notificationsOn ? 'On' : 'Off'}</span>
                  <BsChevronRight size={18} className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`} />
                </div>
              }
              theme={theme}
            />
            <SettingsItem
              icon={<BsDownload size={20} />}
              label="Storage and Data"
              rightElement={<BsChevronRight size={18} className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`} />}
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
                  {theme === 'dark' ? <BsToggleOn size={30} className="text-green-500" /> : <BsToggleOff size={30} className="text-gray-400" />}
                </div>
              }
              theme={theme}
            />
          </SettingsSection>

          <SettingsSection theme={theme}>
            <SettingsItem
              icon={<BsQuestionCircle size={20} />}
              label="Help"
              rightElement={<BsChevronRight size={18} className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`} />}
              onClick={() => console.log('Navigate to Help page')}
              theme={theme}
            />
            <SettingsItem
              icon={<BsInfoCircle size={20} />}
              label="About"
              rightElement={<BsChevronRight size={18} className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`} />}
              onClick={() => console.log('Navigate to About page')}
              theme={theme}
            />
            <SettingsItem
              icon={<BsBoxArrowRight size={20} />}
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
