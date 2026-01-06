import { motion, AnimatePresence } from "framer-motion";

const MovieModal = ({ movie, onClose }) => {
    return (
        <AnimatePresence>
            {movie && (
                <motion.div
                    className="movie-modal "
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                >
                    <motion.div
                        whileInView={{ boxShadow: "0px 0px 50px -20px rgba(255,255,255,1)" }}
                        className="inner"
                        exit={{ opacity: 0 }}
                        initial={{ scale: 0.9, y: 30 }}
                        animate={{ scale: 1, y: 0 }}
                        transition={{ type: "spring", stiffness: 300 }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <h2 className="text-2xl font-bold">{movie.title}</h2>
                        <img src={movie.poster_path ? `https://image.tmdb.org/t/p/w500/${movie.poster_path}` : './no-movie.png'} alt="Movie" />
                        <p className="mt-4 text-gray-300">overview: {movie.overview}</p>

                        <button onClick={onClose}>Close</button>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default MovieModal;
