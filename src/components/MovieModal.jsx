import { Dialog, DialogPanel, DialogTitle, DialogBackdrop } from "@headlessui/react";
import { motion, AnimatePresence } from "framer-motion";

const MovieModal = ({ movie, isModalOpen, setIsModalOpen }) => {
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
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            exit={{ y: 20, opacity: 0 }}
                            transition={{ duration: 0.18 }}
                        >
                            <DialogTitle className="text-2xl font-bold mb-4">{movie?.title}
                            </DialogTitle>
                            <p className="meta-title text-[12px] pb-5">{movie.release_date}</p>

                            <div className="modal-contents">
                                <img src={movie.poster_path ? `https://image.tmdb.org/t/p/w500/${movie.poster_path}` : './no-movie.png'} alt="Movie" />
                                <video src="#" controls></video>
                            </div>

                            <div className="movie-meta">
                                <div className="meta-row">
                                    <span className="meta-title">Overview</span>
                                    <span className="meta-value">{movie.overview}</span>
                                </div>

                                <div className="meta-row">
                                    <span className="meta-title">Release Date</span>
                                    <span className="meta-value">{movie.release_date}</span>
                                </div>

                                <div className="meta-row">
                                    <span className="meta-title">Status</span>
                                    <span className="meta-value">Released</span>
                                </div>

                                <div className="meta-row">
                                    <span className="meta-title">Language</span>
                                    <span className="meta-value">English • Korean • Hindi</span>
                                </div>
                            </div>

                            <button onClick={() => setIsModalOpen(false)} className="btn-gradient">Back to Homepage</button>
                        </DialogPanel>
                    </div>
                </Dialog>
            )}

        </AnimatePresence>
    );
};

export default MovieModal;
