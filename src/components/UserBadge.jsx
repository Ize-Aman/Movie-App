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
    <div className="relative">
      <div
        onClick={() => setIsProfileModalOpen(true)}
        className="flex items-center gap-2 bg-gray-800 text-white pr-4 pl-2 py-1 rounded-full shadow-md cursor-pointer hover:bg-gray-700 transition"
      >
        <img
          src={avatarToShow}
          alt="Profile"
          className="w-8 rounded-full object-cover"
        />
        <span className="font-medium text-sm text-white">
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
