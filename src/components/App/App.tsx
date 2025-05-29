import { useState } from "react";
import SearchBar from "../SearchBar/SearchBar";
import css from "../App/App.module.css";
import { type Movie } from "../../types/movie";
import MovieGrid from "../MovieGrid/MovieGrid";
import Loader from "../Loader/Loader";
import ErrorMessage from "../ErrorMessage/ErrorMessage";
import MovieModal from "../MovieModal/MovieModal";
import { getMovies } from "../../services/movieService";
import toast from "react-hot-toast";
import { Toaster } from "react-hot-toast";

export default function App() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);

  const handleSearch = async (query: string) => {
    if (!query.trim()) {
      toast.error("Please enter your search query");
      return;
    }

    try {
      setMovies([]);
      setIsLoading(true);
      setIsError(false);

      const fetchedMovies = await getMovies(query);
      console.log("Received movies:", fetchedMovies);

      if (fetchedMovies.length === 0) {
        toast.error("No movies found for your request");
      }

      setMovies(fetchedMovies);
    } catch (error) {
      console.error("Search error:", error);
      setIsError(true);
      toast.error("There was an error fetching movies");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCloseModal = () => {
    setSelectedMovie(null);
  };

  return (
    <div className={css.app}>
      <Toaster position="top-center" />
      <SearchBar onSubmit={handleSearch} />
      {isLoading && <Loader />}
      {isError && <ErrorMessage />}
      {movies.length > 0 && (
        <MovieGrid
          movies={movies}
          onSelect={(movie) => setSelectedMovie(movie)}
        />
      )}
      {selectedMovie && (
        <MovieModal movie={selectedMovie} onClose={handleCloseModal} />
      )}
    </div>
  );
}
