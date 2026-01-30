// src/components/ProfileSettings.jsx
import { useState } from "react";
import { useAuth } from "../contexts/authContext";
import ProfileModal from "./ProfileModal";

const DEFAULT_AVATAR = "/default-avatar.png"; // put your default avatar in /public

const ProfileSettings = ({ movies, setSelectedMovie, setIsModalOpen }) => {
  const { currentUser } = useAuth();
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

  if (!currentUser) return null;

  return (
    <div className="profile-settings">
      {/* Avatar or clickable text */}
      <img
        src={currentUser.photoURL || DEFAULT_AVATAR}
        alt="Profile"
        className="w-10 h-10 rounded-full cursor-pointer"
        onClick={() => setIsProfileModalOpen(true)}
      />

      {/* Optional: fallback to text instead of image */}
      {/* <span
        className="cursor-pointer font-semibold"
        onClick={() => setIsProfileModalOpen(true)}
      >
        {currentUser.displayName || currentUser.email.split('@')[0]}
      </span> */}

      {isProfileModalOpen && (
        <ProfileModal
          movies={movies}
          isProfileModalOpen={isProfileModalOpen}
          setIsProfileModalOpen={setIsProfileModalOpen}
          setSelectedMovie={setSelectedMovie}
          setIsModalOpen={setIsModalOpen}
        />
      )}
    </div>
  );
};

export default ProfileSettings;
