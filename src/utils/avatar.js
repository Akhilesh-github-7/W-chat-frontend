import profilePlaceholder from '../assets/images/profile placeholder.png';

const getAvatarUrl = (avatarPath) => {
  if (!avatarPath) {
    return profilePlaceholder;
  }
  // Check if avatarPath is a full URL
  if (avatarPath.startsWith('http')) {
    return avatarPath;
  }
  return `${import.meta.env.VITE_API_URL}/uploads/${avatarPath}`;
};

export default getAvatarUrl;
