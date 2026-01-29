import {
  Dialog,
  DialogPanel,
  DialogTitle,
  DialogBackdrop,
} from "@headlessui/react";
import { motion, AnimatePresence } from "framer-motion";
import { addToWatchList, addToWatched, removeFromWatchList, removeFromWatched } from "../firebase/firebase";
import { auth, userDocRef } from "../firebase/firebase";
import { useEffect, useState } from "react";

import { getDoc } from "firebase/firestore";

const MovieModal = ({ movie, isModalOpen, setIsModalOpen }) => {

  const uid = auth.currentUser?.uid;

  const [inWatchList, setInWatchList] = useState(false);
  const [inWatched, setInWatched] = useState(false);


  useEffect(() => {
    if (!movie || !uid) return;
    const checkLists = async () => {
      const docSnap = await getDoc(userDocRef(uid));
      if (docSnap.exists()) {
        const data = docSnap.data();

        setInWatchList(
          data.watchlist?.includes(movie.id) || false);
        setInWatched(
          data.watched?.includes(movie.id) || false
        );
      }
    };

    checkLists();
  }, [movie, uid]);

  return (
    <AnimatePresence>
      {isModalOpen && (
        <Dialog
          open={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          className="movie-modal"
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
              className="modal-panel overflow-y-auto hide-scrollbar max-h-screen"
              initial={{ y: 5, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 20, opacity: 0 }}
              transition={{ duration: 2 }}
            >
              <DialogTitle className="text-2xl font-bold mb-4">
                {movie?.title}
              </DialogTitle>
              <p className="meta-title text-[12px] pb-5">
                {movie.release_date}
              </p>

              <div className="modal-contents">
                <img
                  src={
                    movie.poster_path
                      ? `https://image.tmdb.org/t/p/w500/${movie.poster_path}`
                      : "./no-movie.png"
                  }
                  alt="Movie"
                />
                <video src="#" controls></video>
              </div>

              <button
                onClick={() => setIsModalOpen(false)}
                className="btn-gradient"
              >
                Back to Homepage
              </button>

              <div className="movie-meta">
                <div className="meta-row">
                  <span className="meta-title">Overview </span>
                  <span className="meta-value"> {movie.overview}</span>
                </div>

                <div className="meta-row">
                  <span className="meta-title">Release Date </span>
                  <span className="meta-value"> {movie.release_date}</span>
                </div>

                <div className="meta-row">
                  <span className="meta-title">Status </span>
                  <span className="meta-value"> Released</span>
                </div>

                <div className="meta-row">
                  <span className="meta-title">Language </span>
                  <span className="meta-value"> English • Korean • Hindi</span>
                </div>

              </div>
              <div className="action-btn flex gap-4 mt-4">

                <button
                  className={`flex flex-col items-center gap-1 px-4 py-2 rounded-full transition-colors ${inWatchList ? 'bg-purple-500 text-white' : 'bg-gray-700 text-gray-300'}`}
                  onClick={async () => {
                    if (!uid) return;

                    if (inWatchList) {
                      await removeFromWatchList(uid, movie);
                      setInWatchList(false);
                    } else {
                      await addToWatchList(uid, movie);
                      setInWatchList(true);
                    }
                  }}
                ><img src="../../public/bookmark.svg" alt="watchlist" />
                  <span className="text-xs">
                    {inWatchList ? "In Watchlist" : "Add to Watchlist"}</span>
                </button>

                <button className={`flex flex-col items-center gap-1 px-4 py-2 rounded-md transition-colors ${inWatched ? 'bg-purple-500 text-white' : 'bg-gray-700 text-gray-300'}`}
                  onClick={async () => {
                    if (!uid) return;

                    if (inWatched) {
                      await removeFromWatched(uid, movie);
                      setInWatched(false);
                    } else {
                      await addToWatched(uid, movie);
                      setInWatched(true);
                      if (inWatchList) {
                        await removeFromWatchList(uid, movie);
                        setInWatchList(false);
                      }
                    }
                  }}
                >
                  <img src="/tick(1).svg" alt="watched" />
                  <span className="text-xs">
                    {inWatched ? "Watched" : "Mark as Watched"}</span></button>
              </div>
              console.log("moviemodal movie:", movie);

            </DialogPanel>
          </div>
        </Dialog>
      )}
    </AnimatePresence>
  );
};

export default MovieModal;
