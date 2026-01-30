import React, { useEffect, useState } from "react";
import Search from "./components/Search";
import { ThreeDot } from "react-loading-indicators";
import MovieCard from "./components/MovieCard";
import { useDebounce } from "react-use";
import MovieModal from "./components/MovieModal";
import { updateSearchCount, getTrendingMovies } from "./firebase/firebase";
import { useAuth } from "./contexts/authContext";
import { Navigate } from "react-router-dom";
import UserBadge from "./components/UserBadge";

const API_BASE_URL = "https://api.themoviedb.org/3";
const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const API_OPTIONS = {
  method: "GET",
  headers: {
    accept: "application/json",
    Authorization: `Bearer ${API_KEY}`,
  },
};

const App = () => {
  const [error, setError] = useState("");
  const [movieList, setMovieList] = useState([]);
  const [trendingMovies, setTrendingMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { currentUser } = useAuth();

  if (!currentUser) {
    return <Navigate to="/" replace />;
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
      if (!response.ok) throw new Error("Failed to fetch movies");

      const data = await response.json();
      setMovieList(data.results || []);

      if (query && data.results?.length > 0) {
        await updateSearchCount(query, data.results[0]);
      }
    } catch (e) {
      console.error(e);
      setError("Error fetching movies, please try again later");
    } finally {
      setIsLoading(false);
    }
  };

  const loadTrendingMovies = async () => {
    try {
      const movies = await getTrendingMovies();
      setTrendingMovies(movies);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <main>
      <div className="pattern" />
      <div className="wrapper">
        <header className="flex flex-col items-center">
          
          {/* TOP BAR */}
          <div className="relative w-full flex items-center mb-4">
            
            {/* Centered Logo (absolute, never moves) */}
            <img
              src="./logo.png"
              alt="logo"
              className="absolute left-1/2 -translate-x-1/2 w-22"
            />

            {/* Right-side Profile Badge */}
            <div className="ml-auto">
              <UserBadge
                movies={movieList}
                setSelectedMovie={setSelectedMovie}
                setIsModalOpen={setIsModalOpen}
              />
            </div>
          </div>

          <img src="./hero.png" alt="hero banner" />

          <h1 className="text-center">
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
                <li key={movie.id}>
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
            <ThreeDot variant="pulsate" color="#4B0082" size="medium" />
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
