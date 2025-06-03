import { useEffect, useState } from "react";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import SearchBar from "../SearchBar/SearchBar";
import css from "../App/App.module.css";
import MovieGrid from "../MovieGrid/MovieGrid";
import Loader from "../Loader/Loader";
import MovieModal from "../MovieModal/MovieModal";
import { getMovies, type MoviesResponse } from "../../services/movieService";
import { Toaster, toast } from "react-hot-toast";
import ReactPaginate from "react-paginate";
import { type Movie } from "../../types/movie";
import ErrorMessage from "../ErrorMessage/ErrorMessage";

export default function App() {
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);

  const { data, isPending, isError, error, isSuccess } =
    useQuery<MoviesResponse>({
      queryKey: ["movies", query, page],
      queryFn: () => getMovies(query, page),
      enabled: !!query,
      retry: false,
      placeholderData: keepPreviousData,
    });

  useEffect(() => {
    if (isError) {
      toast.error("Failed to load movies");
    }
    if (isSuccess && data?.results.length === 0) {
      toast.error("No movies found for your request");
    }
  }, [isError, isSuccess, data]);

  const handleSearch = (searchQuery: string) => {
    if (!searchQuery.trim()) {
      toast.error("Please enter your search query");
      return;
    }
    setQuery(searchQuery);
    setPage(1);
  };

  const handlePageChange = ({ selected }: { selected: number }) => {
    setPage(selected + 1);
  };

  return (
    <div className={css.app}>
      <Toaster position="top-center" />
      <SearchBar onSubmit={handleSearch} />

      {data?.results && data.results.length > 0 && data.total_pages > 1 && (
        <ReactPaginate
          pageCount={Math.min(data.total_pages, 500)}
          pageRangeDisplayed={5}
          marginPagesDisplayed={1}
          onPageChange={handlePageChange}
          forcePage={page - 1}
          containerClassName={css.pagination}
          activeClassName={css.active}
          previousLabel="←"
          nextLabel="→"
        />
      )}

      {!query && !isPending && (
        <div className={css.placeholder}>Enter movie title to start search</div>
      )}

      {isPending && query && <Loader />}

      {isError && <ErrorMessage error={error} />}

      {data?.results && data.results.length > 0 && (
        <MovieGrid
          movies={data.results}
          onSelect={(movie) => setSelectedMovie(movie)}
        />
      )}

      {selectedMovie && (
        <MovieModal
          movie={selectedMovie}
          onClose={() => setSelectedMovie(null)}
        />
      )}
    </div>
  );
}
