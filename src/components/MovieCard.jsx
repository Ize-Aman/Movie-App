import React from "react"
import { motion, scale } from "motion/react"

const MovieCard = ({ movie:
    { title, vote_average, poster_path, release_date, original_language }, onClick
}) => {
    return (
        <motion.div className="movie-card"
            whileHover={{ scale: 1.03, boxShadow: "0 2px 20px rgba(255,255,255,0.19)" }}
            whileTap={{ scale: 0.99 }}
            transition={{ duration: 0.19 }}
            onClick={onClick}
        >
            <img src={poster_path ? `https://image.tmdb.org/t/p/w500/${poster_path}` : '/no-movie.png'} alt={title} srcSet="" />

            <div className="mt-5">
                <h3>{title}</h3>
                <div className="content">
                    <div className="rating">
                        <img src='/star.svg' alt="" srcSet=""/>
                        <p>{vote_average ? vote_average.toFixed(1) : 'N/A'}</p>
                        <span>•</span>
                        <p>{original_language}</p>
                        <span>•</span>
                        <p>{release_date ? release_date.split('-')[0] : 'N/A'}</p>
                    </div>
                </div>
            </div>
        </motion.div>
    )
};

export default MovieCard;
