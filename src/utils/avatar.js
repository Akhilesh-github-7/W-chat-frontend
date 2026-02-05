import profilePlaceholder from '../assets/images/profle placeholder.png';

const getAvatarUrl = (avatarPath) => {
  if (!avatarPath) {
    return profilePlaceholder;
  }

  // Ensure VITE_API_URL is available
  const baseUrl = import.meta.env.VITE_API_URL || '';

  // If it's a full URL, check if it's a legacy URL pointing to /uploads/
  if (avatarPath.startsWith('http')) {
    if (avatarPath.includes('/uploads/')) {
      // Extract the part after /uploads/
      const parts = avatarPath.split('/uploads/');
      const relativePath = parts[parts.length - 1];
      return `${baseUrl}/uploads/${relativePath}`;
    }
    // If it's an external URL (like pravatar), return it as is
    return avatarPath;
  }

  // Clean the path - remove leading slashes
  const cleanPath = avatarPath.startsWith('/') ? avatarPath.substring(1) : avatarPath;

  // If the path starts with 'avatars/', prepend 'uploads/'
  if (cleanPath.startsWith('avatars/')) {
    return `${baseUrl}/uploads/${cleanPath}`;
  }

  // If the path already includes 'uploads/', handle it
  if (cleanPath.startsWith('uploads/')) {
    return `${baseUrl}/${cleanPath}`;
  }

  return `${baseUrl}/uploads/${cleanPath}`;
};

export default getAvatarUrl;
