import { useEffect, useState } from "react";

const KEY = "668f504b";

type Movie = {
  id: string;
  title: string;
  year: string;
};

export const MovieList = () => {
  const [inputValue, setInputValue] = useState("");
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const controller = new AbortController();

    const fetchData = async () => {
      try {
        setLoading("Loading...");
        setError("");

        const response = await fetch(
          `http://www.omdbapi.com/?apikey=${KEY}&s=${inputValue}`,
          { signal: controller.signal }
        );
        if (!response.ok) throw new Error("Something went wrong");

        const data = await response.json();

        if (data.Response === "False") throw new Error("No movies found.");

        const transformedMovie = data.Search.map((movie: any) => {
          return {
            id: movie.imdbID,
            title: movie.Title,
            year: movie.Year,
          };
        });
        setMovies(transformedMovie);
        setError("");
      } catch (error: any) {
        if (error.name !== "AbortError") {
          setError(error.message);
        }
      } finally {
        setLoading("");
        setError("");
      }

      if (!inputValue) {
        setMovies([]);
        setError("");
      }
    };

    fetchData();

    return function () {
      controller.abort();
    };
  }, [inputValue]);

  const onChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  return (
    <div className="movie-list">
      <div>
        <form>
          <div>
            <label>Search movie</label>
            <input onChange={onChangeHandler} value={inputValue} />
          </div>
        </form>
        <div>
          {inputValue.length > 2 && movies.length === 0 && <p>{loading}</p>}
          {error ? <p>{error}</p> : <p>{""}</p>}
          <ul>
            {movies.map((movie: any) => (
              <li key={movie.id}>
                <p>{movie.title}</p>
                <p>{movie.year}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};
