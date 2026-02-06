// Displaying our list of movies
import MovieCard from "../components/MovieCard";
import { useState, useEffect } from "react";
import { searchMovies, getPopularMovies } from "../services/api";
import "../css/Home.css";


// Contains the entire UI for home page
function Home() {
    // Use this state to persist search query
    const [searchQuery, setSearchQuery] = useState(""); 
    const [movies, setMovies] = useState([]); 
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    // set to true because as soon as we run the component, we run useEffect and load data

    useEffect(() => {
        const loadPopularMovies = async () => {
            try {
                const popularMovies = await getPopularMovies();
                setMovies(popularMovies);
            } catch (err) {
                console.log(err)
                setError("Failed to load movies...")
            }
            finally {
                setLoading(false);
            }
        }
        loadPopularMovies();
    }, []);

    const handleSearch = async (e) => {
        // prevent default behavior so page isn't updated - search query stays
        e.preventDefault();
        if (!searchQuery.trim()) return 
        if (loading) return
        // so we don't allow search if already searching for something else

        setLoading(true)
        try {
            const searchResults = await searchMovies(searchQuery);
            setMovies(searchResults)
            setError(null)
        } catch (err) {
            console.log(err)
            setError("Failed to search movies...")
        } finally {
            setLoading(false)
        }

        setSearchQuery("----");
    };

    return (
        <div className="home">
            <form onSubmit={handleSearch} className="search-form">
                <input 
                    type="text" 
                    placeholder="Search movies..." 
                    className="search-input" 
                    // connect component to searchQuery state
                    value={searchQuery} 
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
                <button type="submit" className="search-button">Search</button>
            </form>

        {error && <div className="error-message">{error}</div>}

        {loading ? (<div className="loading">Loading...</div>
        ) : (
            <div className="movies-grid">
                {/* Use a conditional render so we can handle searching */}
                {movies.map((movie) => (
                    // rerender movies that start to match the search query - convert to lowercase so it's not case sensitive
                    movie.title.toLowerCase().startsWith(searchQuery) && ( 
                        <MovieCard movie={movie} key={movie.id} />
                    )
                ))}
            </div>
        )}
        </div>
    );

}

export default Home;