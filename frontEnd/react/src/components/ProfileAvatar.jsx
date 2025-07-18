const ProfileAvatar = ({ firstName, lastName }) => {
  const fullName = `${firstName} ${lastName}`;
  const avatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(fullName)}&background=random&color=fff`;

  return (
    <img
      src={avatarUrl}
      alt={`${fullName} avatar`}
      className="w-12 h-12 rounded-full"
    />
  );
};

export default ProfileAvatar;
