import { Dialog, DialogPanel, DialogTitle, DialogBackdrop } from "@headlessui/react";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

const MovieModal = ({ movie, isModalOpen, setIsModalOpen }) => {
    return (
        <AnimatePresence>
            {open && (<Dialog
                open={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                className="relative z-50"
                as={motion.div}
                exit={{ opacity: 0 }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
            >
                <DialogBackdrop className="fixed inset-0 bg-black/80" />

                <div className="fixed inset-0 p-4 overflow-y-auto">
                    <DialogPanel className="bg-[#0F0D23] rounded-xl p-6 max-w-md w-full mt-0">
                        <DialogTitle className="text-2xl font-bold">{movie?.title}</DialogTitle>

                        <img src={movie.poster_path ? `https://image.tmdb.org/t/p/w500/${movie.poster_path}` : './no-movie.png'} alt="Movie" />
                        <p className="mt-4 text-gray-300">overview: {movie.overview}</p>

                        <button onClick={() => setIsModalOpen(false)} className="mt-4 px-4 py-2 bg-purple-600 text-white rounded cursor-pointer">Close</button>
                    </DialogPanel>
                </div>
            </Dialog>
            )}

        </AnimatePresence>
    );
};

export default MovieModal;
