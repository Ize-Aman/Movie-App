import React, { useEffect, useState } from "react";
import Search from "./components/Search";
import { ThreeDot } from "react-loading-indicators";
import MovieCard from "./components/MovieCard";
import { useDebounce } from "react-use";
import MovieModal from "./components/MovieModal";
import { updateSearchCount, getTrendingMovies } from "./firebase/firebase";
import { li, section } from "motion/react-client";
import { useAuth } from "./contexts/authContext";
import { Navigate } from "react-router-dom";

const API_BASE_URL = "https://api.themoviedb.org/3";
const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const API_OPTIONS = {
  method: "GET",
  headers: {
    accept: "application/json",
    Authorization: `Bearer ${API_KEY}`,
  },
};

const App = (props) => {
  const [error, setError] = useState("");
  const [movieList, setMovieList] = useState([]);
  const [trendingMovies, setTrendingMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { currentUser } = useAuth();
  var displayName = null

  if (!currentUser) {
    return <Navigate to={'/'} replace={true} />;
  } else {
    displayName = currentUser.displayName ? currentUser.displayName : currentUser.email;
    if (currentUser.displayName) {
      displayName = displayName.substring(0, displayName.indexOf(' '));
    }
    else {
      displayName = displayName.substring(0, displayName.indexOf('@'))
    }
  }

  useDebounce(() => setDebouncedSearchTerm(searchTerm), 600, [searchTerm]);

  useEffect(() => {
    fetchMovies(debouncedSearchTerm);
  }, [debouncedSearchTerm]);

  useEffect(() => {
    loadTrendingMovies();
  }, []);

  const fetchMovies = async (query = "") => {
    setIsLoading(true);
    setError("");

    try {
      const endPoint = query
        ? `${API_BASE_URL}/search/movie?query=${encodeURI(query)}`
        : `${API_BASE_URL}/discover/movie?sort_by=popularity.desc`;
      const response = await fetch(endPoint, API_OPTIONS);

      if (!response.ok) throw new Error(`failed to fetch movies`);

      const data = await response.json();

      if (data.response === false) {
        setError(data.error || "Failed to fetch movies");
        setMovieList([]);
        return;
      }

      setMovieList(data.results || []);
      // Update search count in Firebase only if it's a search query
      if (query && data.results.length > 0) {
        await updateSearchCount(query, data.results[0]);
      }
    } catch (e) {
      console.error(`error fetching movies. ${e}`);
      setError(`error fetching movies, please try again later`);
    } finally {
      setIsLoading(false);
    }
  };

  const loadTrendingMovies = async () => {
    try {
      const movies = await getTrendingMovies();

      setTrendingMovies(movies);
    } catch (error) {
      console.log(`error fetching trending movies: ${error}`);
    }
  };

  return (
    <main>
      <div className="pattern" />
      <div className="wrapper">
        <header>
          {/*TODO this is how you can access display name*/}
          <h2>{displayName}</h2>
          <img src="./logo.png" alt="" srcset="" className="w-22 mb-0" />
          <img src="./hero.png" alt="hero banner" />
          <h1>
            Find <span className="text-gradient">Movies</span> You'll Enjoy
            Without the Hassle
          </h1>
          <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
        </header>

        {trendingMovies.length > 0 && (
          <section className="trending">
            <h2>Trending Movies</h2>
            <ul>
              {trendingMovies.map((movie, index) => (
                <li key={movie.$id}>
                  <p>{index + 1}</p>
                  <img src={movie.poster_url} alt={movie.title} />
                </li>
              ))}
            </ul>
          </section>
        )}

        <section className="all-movies">
          <h2>{debouncedSearchTerm ? "Search Results" : "Popular Movies"}</h2>

          {isLoading ? (
            <ThreeDot
              variant="pulsate"
              color="#4B0082"
              size="medium"
              text=""
              textColor=""
            />
          ) : error ? (
            <p className="text-red-500">{error}</p>
          ) : (
            <ul>
              {movieList.map((movie) => (
                <MovieCard
                  key={movie.id}
                  movie={movie}
                  onClick={() => {
                    setSelectedMovie(movie);
                    setIsModalOpen(true);
                  }}
                  isModalOpen={isModalOpen}
                />
              ))}
            </ul>
          )}
        </section>
      </div>
      {selectedMovie && (
        <MovieModal
          movie={selectedMovie}
          isModalOpen={isModalOpen}
          setIsModalOpen={setIsModalOpen}
        />
      )}
    </main>
  );
};

export default App;
