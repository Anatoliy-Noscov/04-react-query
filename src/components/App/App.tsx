import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import SearchBar from "../SearchBar/SearchBar";
import css from "../App/App.module.css";
import MovieGrid from "../MovieGrid/MovieGrid";
import Loader from "../Loader/Loader";
import MovieModal from "../MovieModal/MovieModal";
import { getMovies, type MoviesResponse } from "../../services/movieService";
import { Toaster, toast } from "react-hot-toast";
import ReactPaginate from "react-paginate";
import { type Movie } from "../../types/movie";

export default function App() {
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);

  const { data, isLoading, isError, error } = useQuery<MoviesResponse>({
    queryKey: ["movies", query, page],
    queryFn: () => getMovies(query, page),
    enabled: !!query,
    retry: false,
  });

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

  if (isError) {
    toast.error("Failed to load movies");
    console.error("API Error:", error);
  }

  return (
    <div className={css.app}>
      <Toaster position="top-center" />
      <SearchBar onSubmit={handleSearch} />

      {data?.total_pages && data.total_pages > 1 ? (
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
      ) : null}

      {isLoading && <Loader />}

      {data?.results ? (
        <MovieGrid
          movies={data.results}
          onSelect={(movie) => setSelectedMovie(movie)}
        />
      ) : null}

      {selectedMovie && (
        <MovieModal
          movie={selectedMovie}
          onClose={() => setSelectedMovie(null)}
        />
      )}
    </div>
  );
}
