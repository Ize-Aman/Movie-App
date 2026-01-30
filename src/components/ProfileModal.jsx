import {
    Dialog,
    DialogPanel,
    DialogTitle,
    DialogBackdrop,
} from "@headlessui/react";
import { motion, AnimatePresence } from "framer-motion";
import { auth } from "../firebase/firebase";
import { useAuth } from "@/contexts/authContext";
import { useEffect, useState } from "react";
import { getDoc } from "firebase/firestore";
import { userDocRef } from "../firebase/firebase";
import MovieCard from "./MovieCard";
import { doSignOut } from "@/firebase/auth";
import { Navigate, useNavigate } from "react-router-dom";
import { ThreeDot } from "react-loading-indicators";



const API_BASE_URL = "https://api.themoviedb.org/3";
const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const API_OPTIONS = {
    method: "GET",
    headers: {
        accept: "application/json",
        Authorization: `Bearer ${API_KEY}`,
    },
};

const ProfileModal = ({ movies, isProfileModalOpen, setIsProfileModalOpen, setSelectedMovie, setIsModalOpen }) => {

    const uid = auth.currentUser?.uid;

    const [watchlist, setWatchlist] = useState([]);
    const [watched, setWatched] = useState([]);
    const [watchListMovies, setWatchListMovies] = useState([]);
    const [watchedMovies, setWatchedMovies] = useState([]);
    const [profileDisplayName, setProfileDisplayName] = useState("");
    const [isListsLoading, setIsListsLoading] = useState(false);

    const navigate = useNavigate();

    useEffect(() => {
        if (!uid || !isProfileModalOpen) return;

        const fetchUserMovies = async () => {
            const snap = await getDoc(userDocRef(uid));
            if (snap.exists()) {
                const data = snap.data();
                setWatchlist(data.watchlist || []);
                setWatched(data.watched || []);
                setProfileDisplayName(data.displayName || "");
            } else {
                setWatchlist([]);
                setWatched([]);
                setProfileDisplayName("");
            }
        };

        fetchUserMovies();
    }, [uid, isProfileModalOpen]);

    useEffect(() => {
        if (!isProfileModalOpen) return;

        const getEntryId = (entry) => {
            if (typeof entry === "object" && entry !== null) {
                return entry.id;
            }
            return entry;
        };

        const fetchMovieById = async (id) => {
            const response = await fetch(`${API_BASE_URL}/movie/${id}`, API_OPTIONS);
            if (!response.ok) throw new Error("Failed to fetch movie details");
            return response.json();
        };

        const fetchLists = async () => {
            setIsListsLoading(true);
            try {
                if (watchlist.length === 0) {
                    setWatchListMovies([]);
                } else {
                    const watchlistData = await Promise.all(
                        watchlist
                            .map((entry) => {
                                if (typeof entry === "object" && entry !== null) {
                                    return entry;
                                }
                                const id = getEntryId(entry);
                                if (!id) return null;
                                return fetchMovieById(id);
                            })
                    );
                    setWatchListMovies(watchlistData.filter(Boolean));
                }

                if (watched.length === 0) {
                    setWatchedMovies([]);
                } else {
                    const watchedData = await Promise.all(
                        watched
                            .map((entry) => {
                                if (typeof entry === "object" && entry !== null) {
                                    return entry;
                                }
                                const id = getEntryId(entry);
                                if (!id) return null;
                                return fetchMovieById(id);
                            })
                    );
                    setWatchedMovies(watchedData.filter(Boolean));
                }
            } catch (error) {
                console.error("Error fetching list movies:", error);
                setWatchListMovies([]);
                setWatchedMovies([]);
            } finally {
                setIsListsLoading(false);
            }
        };

        fetchLists();
    }, [isProfileModalOpen, watchlist, watched]);

    const { currentUser } = useAuth();
    var displayName = null

    if (!currentUser) {
        return <Navigate to={'/'} replace={true} />;
    } else {
        displayName = currentUser.displayName || profileDisplayName || currentUser.email;
        if (currentUser.displayName || profileDisplayName) {
            const spaceIndex = displayName.indexOf(' ');
            displayName = spaceIndex > 0 ? displayName.substring(0, spaceIndex) : displayName;
        }
        else {
            const atIndex = displayName.indexOf('@');
            displayName = atIndex > 0 ? displayName.substring(0, atIndex) : displayName;
        }
    }

    return (
        <AnimatePresence>
            {isProfileModalOpen && (

                <Dialog
                    open={isProfileModalOpen}
                    onClose={() => setIsProfileModalOpen(false)}
                    className="profile-modal"
                    as="div"
                >
                    <DialogBackdrop
                        as={motion.div}
                        className="fixed inset-0 bg-primary/94"
                        initial={{ opacity: 0 }}
                        animate={{
                            opacity: 1,
                            transition: {
                                opacity: { ease: "linear" },
                            },
                        }}
                        exit={{ opacity: 0 }}
                    />

                    <div className="flex self-center justify-center fixed inset-0 p-4">
                        <DialogPanel
                            as={motion.div}
                            className="profile-panel overflow-y-auto hide-scrollbar max-h-screen"
                            initial={{ y: 5, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            exit={{ y: 20, opacity: 0 }}
                            transition={{ duration: 2 }}
                        >
                            <DialogTitle className="font-Sacramento text-2xl mt-4 text-center font-light">
                                <h1 className="font-light">Hello {displayName || "there"}!</h1>
                                <h3 className="mr-30">Welcome Back!</h3>
                            </DialogTitle>

                            <h3 className="font-bold text-left mt-5 text-2xl text-white">Your Watchlist</h3>

                            <section className="all-movies">
                                <ul className="flex gap-5 overflow-x-auto overflow-y-hidden hide-scrollbar mt-5 ">
                                    <li className="max-w-56 min-w-56 flex gap-5">
                                        {isListsLoading && watchListMovies.length === 0 && (
                                            <ThreeDot variant="pulsate" color="#9abee1dd" size="small" text="" textColor="" />
                                        )}

                                        {!isListsLoading && watchListMovies.length === 0 && (
                                            <p className="text-red-300">Your watchlist is currently empty.</p>
                                        )}

                                        {watchListMovies.map((movie, index) => (
                                            <MovieCard
                                                key={`${movie.id}-${index}`}
                                                movie={movie}
                                                onClick={() => {
                                                    setSelectedMovie(movie);
                                                    setIsModalOpen(true);
                                                }}
                                            />
                                        ))}
                                    </li>

                                </ul>

                            </section>

                            <h3 className="font-bold text-left mt-5 text-2xl text-white">Your Watched movies</h3>

                            <section className="all-movies">

                                <ul className="flex gap-5 overflow-x-auto overflow-y-hidden hide-scrollbar mt-5">
                                    <li className="max-w-56 min-w-56 flex gap-5">
                                        {isListsLoading && watchedMovies.length === 0 && (
                                            <ThreeDot variant="pulsate" color="#9abee1dd" size="small" text="" textColor="" />
                                        )}

                                        {!isListsLoading && watchedMovies.length === 0 && (
                                            <p className="text-red-300">No watched movies yet.</p>
                                        )}

                                        {watchedMovies.map((movie, index) => (
                                            <MovieCard
                                                key={`${movie.id}-${index}`}
                                                movie={movie}
                                                onClick={() => {
                                                    setSelectedMovie(movie);
                                                    setIsModalOpen(true);
                                                }}
                                            />
                                        ))}
                                    </li>
                                </ul>
                            </section>

                            <button
                                className="btn-gradient mt-4 px-5 py-2 font-semibold text-[13px] "
                                onClick={() => doSignOut().then(() => { navigate('/') })}
                            >
                                <img src="./logout.svg" alt="" className="inline w-4.5" /> Logout
                            </button>
                        </DialogPanel>
                    </div>
                </Dialog>

            )}
        </AnimatePresence>
    );

};


export default ProfileModal;