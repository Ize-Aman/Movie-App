import { motion, AnimatePresence } from "framer-motion";

const MovieModal = ({ movie, onClose }) => {
    return (
        <AnimatePresence>
            {movie && (
                <motion.div
                    className="fixed inset-0 bg-black/70 flex items-center justify-center z-50"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                >
                    <motion.div
                        className="bg-[#0F0D23] rounded-xl p-6 max-w-300 w-full max-h-150 h-full"
                        initial={{ scale: 0.9, y: 30 }}
                        animate={{ scale: 1, y: 0 }}
                        exit={{ scale: 0.9, y: 30 }}
                        transition={{ type: "spring", stiffness: 300 }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <h2 className="text-2xl font-bold">{movie.title}</h2>
                        <p className="mt-4 text-gray-300">{movie.overview}</p>

                        <button
                            className="mt-6 px-4 py-2 bg-indigo-600 rounded"
                            onClick={onClose}
                        >
                            Close
                        </button>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default MovieModal;
