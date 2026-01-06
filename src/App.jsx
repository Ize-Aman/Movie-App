import React, { useEffect, useState } from "react"
import Search from "./components/Search";
import { ThreeDot } from "react-loading-indicators";
import MovieCard from "./components/MovieCard";
import { useDebounce } from "react-use";

const API_BASE_URL = 'https://api.themoviedb.org/3';
const API_KEY = import.meta.env.VITE_TMDB_API_KEY
const API_OPTIONS = {
  method: 'GET',
  headers: {
    accept: 'application/json',
    Authorization: `Bearer ${API_KEY}`
  }
}


const App = (props) => {
  const [error, setError] = useState('');
  const [movieList, setMovieList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');

  useDebounce(() => setDebouncedSearchTerm(searchTerm), 600, [searchTerm]);

  useEffect(() => {
    fetchMovies(debouncedSearchTerm)
  }, [debouncedSearchTerm]);

  const fetchMovies = async (query = '') => {
    setIsLoading(true)
    setError('')

    try {
      const endPoint = query ? `${API_BASE_URL}/search/movie?query=${encodeURI(query)}`
        : `${API_BASE_URL}/discover/movie?sort_by=popularity.desc`;
      const response = await fetch(endPoint, API_OPTIONS);

      if (!response.ok)
        throw new Error(`failed to fetch movies`);

      const data = await response.json();

      if (data.response === false) {
        setError(data.error || "Failed to fetch movies");
        setMovieList([]);
        return;
      }

      setMovieList(data.results || [])
    } catch (e) {
      console.error(`error fetching movies. ${e}`);
      setError(`error fetching movies, please try again later`)
    } finally {
      setIsLoading(false);
    }
  }



  return (
    <main>
      <div className="pattern" />
      <div className="wrapper">
        <header>
          <img src="./logo.png" alt="" srcset="" className="w-22 mb-0" />
          <img src="./hero.png" alt="hero banner" />
          <h1>Find <span className="text-gradient">Movies</span> You'll Enjoy Without the Hassle</h1>
          <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
        </header>
        <section className="all-movies">
          <h2 className="mt-10">Popular Movies</h2>

          {isLoading ? (
            <ThreeDot variant="pulsate" color="#4B0082" size="medium" text="" textColor="" />
          ) : error ? (
            <p className="text-red-500">{error}</p>
          ) : (
            <ul>
              {movieList.map((movie) => (
                <MovieCard key={movie.id} movie={movie} />
              ))}
            </ul>
          )}
        </section>
      </div>
    </main>
  )
};

export default App;
