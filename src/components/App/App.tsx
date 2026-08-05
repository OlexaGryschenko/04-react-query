import { useState } from "react";
import styles from "./App.module.css";
import { useQuery, keepPreviousData } from '@tanstack/react-query';
import SearchBar from "../SearchBar/SearchBar";
import { fetchMovies } from "../../services/movieService"; 
import type { Movie } from "../../types/movie";
import MovieGrid from "../MovieGrid/MovieGrid"; 
import { useEffect } from 'react';
import toast, { Toaster } from "react-hot-toast";
import ErrorMessage from "../ErrorMessage/ErrorMessage";
import Loader from "../Loader/Loader";
import MovieModal from "../MovieModal/MovieModal";
import Pagination from "../Pagination/Pagination";


export default function App() {
  const [query, setQuery] = useState<string>('');
  const [page, setPage] = useState<number>(1); 
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);

  const { data, isLoading, isError } = useQuery({
    queryKey: ['movies', query, page],
    queryFn: () => fetchMovies(query, page),
    placeholderData: keepPreviousData,
    enabled: !!query,
  });


const openModal = (movie: Movie) => {
    setSelectedMovie(movie);
  };

  const closeModal = () => {
    setSelectedMovie(null);
  };


  const handleSearch = (topic: string) => {
    setQuery(topic);
    setPage(1);
  };

  useEffect(() => {
    if (data?.results && data.results.length === 0) {
      toast.error("No movies found for your request.");
    }
  }, [data]);

  return (
    <div className={styles.container}>
      <h1>Main content of the page</h1>
      <SearchBar onSubmit={handleSearch} />

      {isError && <ErrorMessage/>}
      {isLoading && <Loader />}

      {data?.total_pages && data.total_pages > 1 && !isLoading && !isError && (
      <Pagination
        totalPages={data.total_pages} 
        currentPage={page} 
        onPageChange={setPage} 
      />
       )}
               
      {data?.results && data.results.length > 0 && !isLoading && !isError && (
        <MovieGrid movies={data.results} onSelect={openModal} />        
      )}

      
      

      {selectedMovie && <MovieModal movie={selectedMovie} onClose={closeModal} />}

      <Toaster position="top-left" />

    </div>
  );
}