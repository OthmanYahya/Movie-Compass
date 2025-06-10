import { useState, useEffect } from "react";
import Search from "./components/Search";
import LoadingIndicator from "./components/LoadingIndicator";
import MovieCard from "./components/MovieCard";
import { useDebounce } from "react-use";
// Correct variable name for the error state setter
import { updateSearchCount, getTrendingMovies } from "./appwrite.js";

const API_BASE_URL = "https://api.themoviedb.org/3";
const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

const API_OPTIONS = {
  method: "GET",
  headers: {
    accept: "application/json",
    Authorization: `Bearer ${API_KEY}`,
  },
};

function App() {
  const [searchTerm, setSearchTerm] = useState("");
  const [errorMessage, setErrorMessage] = useState(""); // Default to empty string for no error
  const [trendingError, setTrendingError] = useState(""); // Renamed for consistency
  const [moviesList, setMoviesList] = useState([]);
  const [trendingMovies, setTrendingMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  useDebounce(() => setDebouncedSearchTerm(searchTerm), 1000, [searchTerm]);

  const fetchMovies = async (query = "") => {
    setIsLoading(true);
    setErrorMessage(""); // Clear previous errors
    // No need to clear trendingError here, it's for a different section

    try {
      const endpoint = query
        ? `${API_BASE_URL}/search/movie?include_adult=false&query=${encodeURIComponent(
            query
          )}`
        : `${API_BASE_URL}/discover/movie?sort_by=popularity.desc`;
      const response = await fetch(endpoint, API_OPTIONS);

      if (!response.ok) {
        throw new Error("Failed to fetch movies");
      }

      const data = await response.json();

      if (data.Response === "False") {
        setErrorMessage(data.Error || "Failed to fetch movies");
        setMoviesList([]);
        return;
      }

      setMoviesList(data.results || []);

      if (query && data.results.length > 0) {
        await updateSearchCount(query, data.results[0]);
      }
    } catch (error) {
      console.error("Error fetching movies:", error);
      setErrorMessage(
        error.message || "Network error or problem reaching the server"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const loadTrendingMovies = async () => {
    try {
      const movies = await getTrendingMovies(); // This function now throws errors
      setTrendingMovies(movies);
      setTrendingError(""); // Clear any previous trending errors on success
    } catch (error) {
      console.error("Error loading trending movies:", error);
      // Set the trending error state here, because appwrite.js now throws it.
      setTrendingError(error.message || "Failed to load trending movies.");
    }
  };

  useEffect(() => {
    fetchMovies(debouncedSearchTerm);
  }, [debouncedSearchTerm]);

  useEffect(() => {
    loadTrendingMovies();
  }, []);

  return (
    <main>
      <div className="pattern" />

      <div className="wrapper">
        <header>
          <img src="/hero.png" alt="Hero Banner" />
          <h2>
            The <span className="text-gradient">Movie Compass</span> is your
            one-stop guide to your favorite movies and more
          </h2>
          <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
        </header>

        {trendingError ? ( // If there's a trending error, display it
          <p className="text-red-500">{trendingError}</p>
        ) : trendingMovies.length > 0 ? ( // Otherwise, if there are trending movies, display them
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
        ) : (
          <>
            <p className="text-gray-500">Loading trending movies...</p>
            <LoadingIndicator />
          </>
        )}

        <section className="all-movies">
          <h2>All Movies</h2>

          {isLoading ? (
            <p className="text-white">{<LoadingIndicator />}</p>
          ) : errorMessage ? (
            <p className="text-red-500">{errorMessage}</p>
          ) : (
            <ul>
              {moviesList.map((movie) => (
                <MovieCard key={movie.id} movie={movie} />
              ))}
            </ul>
          )}
        </section>
      </div>
    </main>
  );
}

export default App;
