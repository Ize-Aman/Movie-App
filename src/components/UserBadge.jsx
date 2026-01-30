import { useEffect, useState } from "react";
import { useAuth } from "../contexts/authContext";
import ProfileModal from "./ProfileModal";
import { getDoc } from "firebase/firestore";
import { userDocRef } from "../firebase/firebase";

const DEFAULT_AVATAR = "./default-avatar.png";
const TROLL_AVATAR = "./icons8-hitler-90.png";

const TROLLED_UID = "Rk9C3jXALnTVA3izxnDPLzX59P93";

const UserBadge = ({ movies, setSelectedMovie, setIsModalOpen }) => {
  const { currentUser } = useAuth();
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [profileDisplayName, setProfileDisplayName] = useState("");

  useEffect(() => {
    if (!currentUser?.uid) return;

    const fetchProfileName = async () => {
      const snap = await getDoc(userDocRef(currentUser.uid));
      if (snap.exists()) {
        const data = snap.data();
        setProfileDisplayName(data.displayName || "");
      } else {
        setProfileDisplayName("");
      }
    };

    fetchProfileName();
  }, [currentUser?.uid]);

  if (!currentUser) return null;

  const rawDisplayName = currentUser.displayName || profileDisplayName || currentUser.email;
  const displayName = rawDisplayName.includes(" ")
    ? rawDisplayName.split(" ")[0]
    : rawDisplayName.includes("@")
      ? rawDisplayName.split("@")[0]
      : rawDisplayName;

  const avatarToShow =
    currentUser.uid === TROLLED_UID
      ? TROLL_AVATAR
      : DEFAULT_AVATAR;

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
