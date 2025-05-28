import { useState, useEffect } from "react";
import Search from "./components/Search";
import LoadingIndicator from "./components/LoadingIndicator";
import MovieCard from "./components/MovieCard";
import { useDebounce } from "react-use";

const API_BASE_URL = "https://api.themoviedb.org/3";
const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

const API_OPTIONS = {
  method: "GET", // HTTP method for requesting the data
  headers: {
    accept: "application/json", // Client's response preference "JSON"
    Authorization: `Bearer ${API_KEY}`,
  },
};

function App() {
  const [searchTerm, setSearchTerm] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [moviesList, setMoviesList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  useDebounce(() => setDebouncedSearchTerm(searchTerm), 750, [searchTerm]);

  const fetchMovies = async (query = "") => {
    setIsLoading(true);
    setErrorMessage("");

    // Fetching the data from the api and dealing with api errors
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

      // Checks for specific error responses from the API.
      if (data.Response === "False") {
        setErrorMessage(data.Error || "Failed to fetch movies");
        setMoviesList([]);
        return;
      }

      setMoviesList(data.results || []);
    } catch (error) {
      // Checking if there is a network/server error
      console.error("Error fetching movies:", error);
      setErrorMessage(
        error.message || "Network error or problem reaching the server"
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMovies(debouncedSearchTerm);
  }, [debouncedSearchTerm]);

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

        <section className="all-movies">
          <h2 className="mt-[40px]">All Movies</h2>

          {/* conditional rendering @1:19:40 */}
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
