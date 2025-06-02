import axios from "axios";
import { type Movie } from "../types/movie";

interface MoviesResponse {
  results: Movie[];
  total_pages: number;
  page: number;
  total_results: number;
}

export const getMovies = async (
  query: string,
  page: number = 1
): Promise<MoviesResponse> => {
  const response = await axios.get<MoviesResponse>(
    "https://api.themoviedb.org/3/search/movie",
    {
      params: {
        query,
        include_adult: false,
        language: "en-US",
        page,
      },
      headers: {
        Authorization: `Bearer ${import.meta.env.VITE_TMDB_TOKEN}`,
      },
    }
  );
  return response.data;
};
