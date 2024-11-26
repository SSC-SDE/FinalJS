export function useMovies(query, onStateChange = () => {}) {
  const KEY = "69c6dd20";

  let movies = [];
  let isLoading = false;
  let error = "";

  const controller = new AbortController();

  async function fetchMovies() {
    // Reset state before starting a fetch
    isLoading = true;
    error = "";
    onStateChange({ movies, isLoading, error });

    try {
      // Only fetch if the query is long enough
      if (query.length < 3) {
        movies = [];
        error = "";
        isLoading = false;
        onStateChange({ movies, isLoading, error });
        return;
      }

      console.log(
        `https://www.omdbapi.com/?i=tt3896198&apikey=${KEY}&s=${query}`,
        "<----- Fetch URL"
      );

      const res = await fetch(
        `https://www.omdbapi.com/?i=tt3896198&apikey=${KEY}&s=${query}`,
        { signal: controller.signal }
      );

      if (!res.ok)
        throw new Error("Something went wrong with fetching movies");

      const data = await res.json();
      if (data.Response === "False") throw new Error("Movie not found");

      movies = data.Search;
    } catch (err) {
      if (err.name !== "AbortError") {
        error = err.message;
        console.error(err.message);
      }
    } finally {
      isLoading = false;
      onStateChange({ movies, isLoading, error });
    }
  }

  // Cleanup function to abort ongoing requests
  function cleanup() {
    controller.abort();
  }

  // Return state and functions for managing it
  return {
    fetchMovies,
    cleanup,
    getState: () => ({ movies, isLoading, error }),
  };
}
