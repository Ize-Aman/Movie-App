import {
  Dialog,
  DialogPanel,
  DialogTitle,
  DialogBackdrop,
} from "@headlessui/react";
import { motion, AnimatePresence } from "framer-motion";
import {
  addToWatchList,
  addToWatched,
  removeFromWatchList,
  removeFromWatched,
} from "../firebase/firebase";
import { auth, userDocRef } from "../firebase/firebase";
import { useEffect, useState } from "react";
import { getDoc } from "firebase/firestore";
import YouTube from "react-youtube";

const API_BASE_URL = "https://api.themoviedb.org/3";
const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

const MovieModal = ({ movie, isModalOpen, setIsModalOpen }) => {
  const uid = auth.currentUser?.uid;

  const [inWatchList, setInWatchList] = useState(false);
  const [inWatched, setInWatched] = useState(false);
  const [details, setDetails] = useState(null);
  const [languages, setLanguages] = useState([]);
  const [videos, setVideos] = useState([]);

  useEffect(() => {
    if (!movie) return;

    const fetchDetails = async () => {
      const res = await fetch(
        `${API_BASE_URL}/movie/${movie.id}?append_to_response=videos`,
        {
          headers: {
            Authorization: `Bearer ${API_KEY}`,
            accept: "application/json",
          },
        }
      );
      const json = await res.json();
      setDetails(json);
      if (json.videos?.results?.length) {
        setVideos(json.videos.results);
      }
    };

    const fetchTranslations = async () => {
      const res = await fetch(
        `${API_BASE_URL}/movie/${movie.id}/translations`,
        {
          headers: {
            Authorization: `Bearer ${API_KEY}`,
            accept: "application/json",
          },
        }
      );
      const json = await res.json();
      setLanguages(json.translations || []);
    };

    fetchDetails();
    fetchTranslations();
  }, [movie]);

  useEffect(() => {
    if (!movie || !uid) return;
    const checkLists = async () => {
      const docSnap = await getDoc(userDocRef(uid));
      if (docSnap.exists()) {
        const data = docSnap.data();
        setInWatchList(data.watchlist?.includes(movie.id) || false);
        setInWatched(data.watched?.includes(movie.id) || false);
      }
    };
    checkLists();
  }, [movie, uid]);

  const releaseYear = movie.release_date
    ? new Date(movie.release_date).getFullYear()
    : "N/A";

  const formatVotes = (votes) => {
    if (!votes) return "0";
    if (votes >= 1000) return (votes / 1000).toFixed(1) + "k";
    return votes.toString();
  };

  const trailerKey = videos.length > 0 ? videos[0].key : null;

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
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          <div className="flex self-center justify-center fixed inset-0 p-4">
            <DialogPanel
              as={motion.div}
              className="modal-panel overflow-y-auto hide-scrollbar max-h-screen"
              initial={{ y: 5, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 20, opacity: 0 }}
            >
              <div className="flex justify-between items-center">
                <DialogTitle className="text-2xl font-bold mb-2">
                  {movie.title}
                </DialogTitle>
                <div className="flex items-center gap-1 bg-gray-800 text-white px-2 py-1 rounded">
                  <img src="/star.svg" alt="star" className="w-4 h-4" />
                  <span>
                    {details?.vote_average
                      ? details.vote_average.toFixed(1)
                      : "N/A"}{" "}
                    / 10
                    {details?.vote_count
                      ? ` (${formatVotes(details.vote_count)})`
                      : ""}
                  </span>
                </div>
              </div>

              <p className="meta-title text-[12px] pb-5">
                {releaseYear} • {details?.certification || "PG"} •{" "}
                {details?.runtime ? `${details.runtime} min` : "N/A"}
              </p>

              <div className="modal-contents flex px-2">
                <img
                  src={
                    movie.poster_path
                      ? `https://image.tmdb.org/t/p/w500/${movie.poster_path}`
                      : "./no-movie.png"
                  }
                  alt="Movie"
                />
                {trailerKey && (
                  <YouTube
                    videoId={trailerKey}
                    className="w-screen"
                    opts={{
                      width: "100%",
                      height: "100%",
                      playerVars: { autoplay: 0 },
                    }}
                  />
                )}
              </div>

              <div className="movie-meta mt-4 space-y-2">
                <div className="flex justify-between items-start">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="meta-title w-[120px]">Genres:</span>
                    {details?.genres?.map((g) => (
                      <div
                        key={g.id}
                        className="bg-gray-800 text-white px-2 py-1 rounded text-sm"
                      >
                        {g.name}
                      </div>
                    )) || "N/A"}
                  </div>
                  <button
                    onClick={() => setIsModalOpen(false)}
                    className="btn-gradient px-5 py-2 text-sm"
                  >
                    Back to Homepage
                  </button>
                </div>

                <div className="flex gap-2">
                  <span className="meta-title w-[120px]">Overview:</span>
                  <span className="meta-value flex-1">{movie.overview}</span>
                </div>

                <div className="flex gap-2">
                  <span className="meta-title w-[120px]">Release Date:</span>
                  <span className="meta-value flex-1">{movie.release_date}</span>
                </div>

                <div className="flex gap-2">
                  <span className="meta-title w-[120px]">Status:</span>
                  <span className="meta-value flex-1">Released</span>
                </div>

                <div className="flex gap-2">
                  <span className="meta-title w-[120px]">Language:</span>
                  <span className="meta-value flex-1">
                    {languages
                      .slice(0, 6)
                      .map((l) => l.english_name)
                      .join(" • ") || "N/A"}
                  </span>
                </div>

                <div className="flex gap-2">
                  <span className="meta-title w-[120px]">Budget:</span>
                  <span className="meta-value flex-1">
                    {details?.budget ? `$${details.budget.toLocaleString()}` : "N/A"}
                  </span>
                </div>

                <div className="flex gap-2">
                  <span className="meta-title w-[120px]">Revenue:</span>
                  <span className="meta-value flex-1">
                    {details?.revenue ? `$${details.revenue.toLocaleString()}` : "N/A"}
                  </span>
                </div>

                <div className="flex gap-2">
                  <span className="meta-title w-[120px]">Tagline:</span>
                  <span className="meta-value flex-1 italic">
                    {details?.tagline || "N/A"}
                  </span>
                </div>

                <div className="meta-row btns">
                  <span className="meta-title">
                    <button
                      className={`flex flex-col items-center gap-1 px-2 py-2 rounded-full cursor-pointer transition-colors duration-300 ${inWatchList
                        ? "bg-green-400 text-white"
                        : "bg-blue-600 text-white"
                        }`}
                      onClick={async () => {
                        if (!uid) return;
                        if (inWatchList) {
                          await removeFromWatchList(uid, movie);
                          setInWatchList(false);
                        } else {
                          await addToWatchList(uid, movie);
                          setInWatchList(true);
                          if (inWatched) {
                            await removeFromWatched(uid, movie);
                            setInWatched(false);
                          }
                        }
                      }}
                    >
                      <span className="flex items-center gap-2 text-[13px]">
                        {inWatchList ? "Watchlisted" : "Watchlist"}
                        <img
                          src="./Group 66731.png"
                          alt="watchlist icon"
                          className="w-5 h-5"
                        />
                      </span>
                    </button>
                  </span>

                  <span className="meta-title">
                    <button
                      className={`flex flex-col items-center gap-2 px-2 py-2 rounded-full cursor-pointer transition-colors duration-300 ${inWatched
                        ? "bg-green-400 text-white"
                        : "bg-blue-600 text-white"
                        }`}
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
                      <span className="flex items-center gap-2 text-[13px]">
                        Watched
                        <img
                          src="./Group 66732.png"
                          alt="watched icon"
                          className="w-5 h-5"
                        />
                      </span>
                    </button>
                  </span>
                </div>
              </div>
            </DialogPanel>
          </div>
        </Dialog>
      )}
    </AnimatePresence>
  );
};

export default MovieModal;
