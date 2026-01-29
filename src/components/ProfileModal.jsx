import {
    Dialog,
    DialogPanel,
    DialogTitle,
    DialogBackdrop,
} from "@headlessui/react";
import { motion, AnimatePresence } from "framer-motion";
import { auth } from "../firebase/firebase";
import { useEffect, useState } from "react";
import { getDoc } from "firebase/firestore";
import { userDocRef } from "../firebase/firebase";
import MovieCard from "./MovieCard";



const ProfileModal = ({ movies, isProfileModalOpen, setIsProfileModalOpen, setSelectedMovie, setIsModalOpen }) => {

    const uid = auth.currentUser?.uid;

    const [watchlist, setWatchlist] = useState([]);
    const [watched, setWatched] = useState([]);

    const watchListMovies = movies.filter((movie) => watchlist.includes(movie.id));
    const watchedMovies = movies.filter((movie) => watched.includes(movie.id));

    useEffect(() => {
        if (!uid || !isProfileModalOpen) return;

        const fetchUserMovies = async () => {
            const snap = await getDoc(userDocRef(uid));
            if (snap.exists()) {
                const data = snap.data();
                setWatchlist(data.watchlist || []);
                setWatched(data.watched || []);
            }
        };
        fetchUserMovies();
    }, [uid, isProfileModalOpen]);


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
                                <h1 className="font-light">Hello {auth.currentUser?.displayName.substring(0, auth.currentUser?.displayName.indexOf(' ')) || "there"}!</h1>
                                <h3 className="mr-30">Welcome Back!</h3>
                            </DialogTitle>

                            <h3 className="font-bold text-left mt-5 text-2xl text-white">Your Watchlist</h3>

                            <section className="profile-contents">
                                <ul className="flex gap-5 overflow-x-auto overflow-y-hidden hide-scrollbar mt-5">
                                    {watchListMovies.length === 0 && <p>Your watchlist is currently empty.</p>}

                                    {watchListMovies.map((movie) => (
                                        <MovieCard
                                            key={movie.id}
                                            movie={movie}
                                            onClick={() => {
                                                setSelectedMovie(movie);
                                                setIsModalOpen(true);
                                            }}
                                        />
                                    ))}

                                </ul>

                            </section>

                            <h3 className="font-bold text-left mt-5 text-2xl text-white">Your Watched movies</h3>

                            <section className="profile-contents">

                                <ul className="flex gap-5 overflow-x-auto overflow-y-hidden hide-scrollbar mt-5">
                                    {watchedMovies.length === 0 && <p>No watched movies yet.</p>}

                                    {watchedMovies.map((movie) => (
                                        <MovieCard
                                            key={movie.id}
                                            movie={movie}
                                            onClick={() => {
                                                setSelectedMovie(movie);
                                                setIsModalOpen(true);
                                            }}
                                        />
                                    ))}
                                </ul>
                            </section>

                            <button
                                className="btn-gradient m-10"
                                onClick={() => setIsProfileModalOpen(false)}
                            >
                                Back
                            </button>
                        </DialogPanel>
                    </div>
                </Dialog>

            )}
        </AnimatePresence>
    );

};


export default ProfileModal;