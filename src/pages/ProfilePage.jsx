import React, { useState, useRef } from 'react';
import { useTheme } from '../context/ThemeContext';
import {
  BsMoon, BsBell, BsLock, BsShield, BsPerson, BsQuestionCircle, BsInfoCircle,
  BsChevronRight, BsToggleOn, BsToggleOff, BsCamera, BsChatDots, BsKey, BsDownload, BsCpu, BsArrowLeft, BsBoxArrowRight
} from 'react-icons/bs';
import getAvatarUrl from '../utils/avatar';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const SettingsSection = ({ title, children }) => (
  <div className="mb-6 animate-fadeIn">
    {title && <h3 className="text-[11px] font-bold mb-3 px-5 text-neon-blue uppercase tracking-[0.2em] opacity-80">{title}</h3>}
    <div className="bg-white/5 backdrop-blur-xl rounded-2xl overflow-hidden border border-white/10 shadow-lg">
      {children}
    </div>
  </div>
);

const SettingsItem = ({ icon, label, rightElement, onClick, isDanger }) => (
  <div
    className={`flex items-center justify-between py-4 px-5 cursor-pointer transition-all duration-200 border-b border-white/5 last:border-b-0 hover:bg-white/5 active:bg-white/10`}
    onClick={onClick}
  >
    <div className="flex items-center gap-4">
      <div className={`${isDanger ? 'text-red-400' : 'text-neon-cyan'}`}>
        {icon}
      </div>
      <span className={`text-base font-medium ${isDanger ? 'text-red-400' : 'text-gray-100'}`}>{label}</span>
    </div>
    <div className="text-gray-500">{rightElement}</div>
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
    <div className="w-full h-full bg-transparent text-white flex flex-col animate-fadeIn">
      <div className="w-full flex flex-col h-full">
        {/* Header */}
        <div className="w-full flex-none pt-8 pb-4 bg-white/5 backdrop-blur-2xl border-b border-white/10 relative px-6">
          <div className="flex items-center">
            <button 
              onClick={onCloseProfile}
              className="p-2 rounded-full hover:bg-white/10 transition-colors -ml-2"
            >
              <BsArrowLeft size={22} className="text-white" />
            </button>
            <div className="flex-1 text-center font-bold text-lg tracking-wide mr-6">Settings</div>
          </div>
        </div>
        
        {/* Profile Info */}
        <div className="w-full flex-none flex flex-col justify-center items-center pt-10 pb-8 px-6">
          <div className="relative group">
            <div className="w-32 h-32 rounded-full border-4 border-neon-blue/30 p-1 group-hover:border-neon-blue/50 transition-all duration-300 shadow-[0_0_20px_rgba(0,191,255,0.2)]">
               <img
                src={currentAvatar}
                alt="User Avatar"
                className="w-full h-full rounded-full object-cover shadow-2xl transition-transform duration-500 group-hover:scale-[1.02]"
              />
            </div>
           
            <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                className="hidden"
                accept="image/*"
            />
            <button
              onClick={handleAvatarClick}
              className="absolute bottom-1 right-1 bg-gradient-to-br from-neon-blue to-blue-600 p-3 rounded-full border-2 border-gray-900 cursor-pointer shadow-lg hover:shadow-neon-blue/40 transition-all duration-300 active:scale-90"
              title="Change Avatar"
            >
              <BsCamera size={18} className="text-white" />
            </button>
          </div>

          <h2 className="mt-5 text-2xl font-bold text-white tracking-tight">{user?.name || 'User'}</h2>
          <p className="text-sm text-gray-400 mt-1 italic font-script">"{user?.bio || 'Hey there! I am using W-Chat.'}"</p>
        </div>

        {/* Settings List */}
        <div className="w-full flex-grow overflow-y-auto px-6 py-4 custom-scrollbar">
          <SettingsSection title="Personal">
            <SettingsItem
              icon={<BsKey size={20} />}
              label="Account Security"
              rightElement={<BsChevronRight size={16} />}
              onClick={() => console.log('Navigate to Account settings')}
            />
            <SettingsItem
              icon={<BsChatDots size={20} />}
              label="Chat Customization"
              rightElement={<BsChevronRight size={16} />}
              onClick={() => console.log('Navigate to Chats settings')}
            />
          </SettingsSection>

          <SettingsSection title="System">
             <SettingsItem
              icon={<BsDownload size={20} />}
              label="Data & Storage"
              rightElement={<BsChevronRight size={16} />}
              onClick={() => console.log('Navigate to Storage and Data settings')}
            />
            <SettingsItem
              icon={<BsBell size={20} />}
              label="Notifications"
              rightElement={
                <button 
                    onClick={(e) => { e.stopPropagation(); handleNotificationsToggle(); }}
                    className="p-1"
                >
                    {notificationsOn ? <BsToggleOn size={28} className="text-neon-cyan" /> : <BsToggleOff size={28} />}
                </button>
              }
            />
          </SettingsSection>

          <SettingsSection title="Support">
            <SettingsItem
              icon={<BsQuestionCircle size={20} />}
              label="Help Center"
              rightElement={<BsChevronRight size={16} />}
              onClick={() => console.log('Navigate to Help page')}
            />
            <SettingsItem
              icon={<BsInfoCircle size={20} />}
              label="About W-Chat"
              rightElement={<BsChevronRight size={16} />}
              onClick={() => console.log('Navigate to About page')}
            />
          </SettingsSection>
          
          <div className="mb-10 mt-4 px-1">
             <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center gap-3 py-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-500 font-bold hover:bg-red-500/20 transition-all duration-300 active:scale-[0.98]"
            >
              <BsBoxArrowRight size={22} />
              <span>Logout Session</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;

