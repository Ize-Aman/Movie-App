import { useState } from "react";
import { useAuth } from "../contexts/authContext";
import ProfileModal from "./ProfileModal";

const DEFAULT_AVATAR = "/default-avatar.png";
const TROLL_AVATAR = "public\icons8-hitler-90.png";

const TROLLED_UID = "Rk9C3jXALnTVA3izxnDPLzX59P93";

const UserBadge = ({ movies, setSelectedMovie, setIsModalOpen }) => {
  const { currentUser } = useAuth();
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

  if (!currentUser) return null;

  const displayName = currentUser.displayName
    ? currentUser.displayName.split(" ")[0]
    : currentUser.email.split("@")[0];

  const avatarToShow =
    currentUser.uid === TROLLED_UID
      ? TROLL_AVATAR
      : currentUser.photoURL || DEFAULT_AVATAR;

  return (
    <div className="relative ml-auto">
      {/* Badge box */}
      <div
        onClick={() => setIsProfileModalOpen(true)}
        className="flex items-center gap-3 bg-gray-800 text-white px-3 py-1 rounded-full shadow-md cursor-pointer hover:bg-gray-700 transition"
      >
        <img
          src={avatarToShow}
          alt="Profile"
          className="w-10 h-10 rounded-full object-cover"
        />
        <span className="font-semibold text-white">
          {displayName}
        </span>
      </div>

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

export default UserBadge;
