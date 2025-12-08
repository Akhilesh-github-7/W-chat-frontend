import profilePlaceholder from '../assets/images/profle placeholder.png';

const getAvatarUrl = (avatarPath) => {
  if (!avatarPath) {
    return profilePlaceholder;
  }
  return `${import.meta.env.VITE_API_URL}/uploads/${avatarPath}`;
};

export default getAvatarUrl;
