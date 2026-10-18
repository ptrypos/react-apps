import { useState, useEffect } from 'react'
import { Routes, Route, Link, useParams } from 'react-router-dom'
import './MovieSearchExplorer.css'

const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w500";

function MovieContainer({ movie }) {
    const hasPoster = Boolean(movie.poster_path && movie.poster_path.trim());

    return (
        <div className='movie-card'>
            {hasPoster ? (
                <img
                    src={`${IMAGE_BASE_URL}${movie.poster_path}`}
                    alt={movie.title || "Movie poster"}
                    loading="lazy"
                />
            ) : (
                <div className="no-poster">No Image Available</div>
            )}
            <h3>{movie.title}</h3>
            <p className='movie-meta'>
                <span>{movie.release_date || 'TBA'}</span>
                <span>★ {movie.vote_average ? movie.vote_average.toFixed(1) : 'N/A'}</span>
            </p>
        </div>
    );
}

function MovieDetails() {
    const { id } = useParams();
    const [movie, setMovie] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchDetails = async () => {
            try {
                const res = await fetch(`https://api.themoviedb.org/3/movie/${id}?api_key=${API_KEY}&language=en-US&append_to_response=credits,watch/providers`);
                if (!res.ok) throw new Error("Could not find movie details");
                const data = await res.json();
                setMovie(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchDetails();
    }, [id]);

    if (loading) return <p className="status-message">Loading details...</p>;
    if (error) return <p className="error-message">{error}</p>;
    if (!movie) return null;

    const hasPoster = Boolean(movie.poster_path && movie.poster_path.trim());
    const topCast = movie.credits?.cast?.slice(0, 10) || [];

    const providers = movie['watch/providers']?.results?.US;
    const streamingServices = providers?.flatrate || [];
    const rentServices = providers?.rent || [];

    return (
        <div>
            <nav className='nav-bar'>
                <Link to='..' relative='path' className='back-button'>
                    ← Back to Movies
                </Link>
                <h2 className='nav-title'>{movie.title}</h2>
                <div className='nav-spacer'></div>
            </nav>

            <main className='details-container'>
                <div className='details-content'>
                    {hasPoster && (
                        <img
                            src={`${IMAGE_BASE_URL}${movie.poster_path}`}
                            alt={movie.title || "Movie poster"}
                            className='details-poster'
                        />
                    )}
                    <div className='details-info'>
                        <h1 className='details-title'>{movie.title}</h1>
                        <p className='details-meta'>
                            {movie.release_date} • ★ {movie.vote_average?.toFixed(1) ?? 'N/A'}/10
                        </p>

                        <h3>Overview</h3>
                        <p className='details-overview'>{movie.overview || "No overview available."}</p>

                        <h3>Genres</h3>
                        <div className='details-genres'>
                            {movie.genres?.map((genre) => (
                                <span key={genre.id} className='genre-badge'>
                                    {genre.name}
                                </span>
                            ))}
                        </div>

                        <h3>Where to Watch</h3>
                        <div className='details-watch-providers'>
                            {streamingServices.length > 0 ? (
                                <div className='provider-group'>
                                    <span className='provider-label'>Stream:</span>
                                    <div className='provider-icons'>
                                        {streamingServices.map((provider) => (
                                            <img
                                                key={provider.provider_id}
                                                src={`${IMAGE_BASE_URL}${provider.logo_path}`}
                                                alt={provider.provider_name}
                                                title={provider.provider_name}
                                                className='provider-logo'
                                            />
                                        ))}
                                    </div>
                                </div>
                            ) : null}

                            {rentServices.length > 0 ? (
                                <div className='provider-group'>
                                    <span className='provider-label'>Rent/Buy:</span>
                                    <div className='provider-icons'>
                                        {rentServices.map((provider) => (
                                            <img
                                                key={provider.provider_id}
                                                src={`${IMAGE_BASE_URL}${provider.logo_path}`}
                                                alt={provider.provider_name}
                                                title={provider.provider_name}
                                                className='provider-logo'
                                            />
                                        ))}
                                    </div>
                                </div>
                            ) : null}

                            {!streamingServices.length && !rentServices.length && (
                                <p className='no-providers'>No streaming info available in your region.</p>
                            )}
                        </div>

                        <h3>Top Cast</h3>
                        <div className='details-cast'>
                            {topCast.map((actor) => (
                                <div key={actor.id} className='cast-card'>
                                    {actor.profile_path ? (
                                        <img
                                            src={`${IMAGE_BASE_URL}${actor.profile_path}`}
                                            alt={actor.name}
                                            className='cast-img'
                                            loading='lazy'
                                        />
                                    ) : (
                                        <div className='cast-placeholder'>👤</div>
                                    )}
                                    <div className='cast-text'>
                                        <span className='cast-actor-name'>{actor.name}</span>
                                        <span className='cast-character-name'>{actor.character}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}

function MovieDiscovery() {
    const [movies, setMovies] = useState([]);
    const [query, setQuery] = useState('');
    const [loadingMovies, setLoadingMovies] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const controller = new AbortController();

        const fetchMovies = async () => {
            try {
                setLoadingMovies(true);
                setError(null);

                if (query.trim()) {
                    const searchRes = await fetch(
                        `https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(query)}&language=en-US&page=1`,
                        { signal: controller.signal }
                    );

                    if (!searchRes.ok) throw new Error("Failed to search movies");
                    const searchData = await searchRes.json();
                    setMovies(searchData.results || []);
                } else {
                    const today = new Date();
                    const todayString = today.toISOString().split('T')[0];

                    const threeMonthsAgo = new Date(today);
                    threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);
                    const pastString = threeMonthsAgo.toISOString().split('T')[0];

                    const releasedRes = await fetch(
                        `https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&language=en-US&page=1&primary_release_date.gte=${pastString}&primary_release_date.lte=${todayString}&sort_by=popularity.desc`,
                        { signal: controller.signal }
                    );

                    if (!releasedRes.ok) {
                        throw new Error("Failed to load movies");
                    }

                    const releasedData = await releasedRes.json();

                    setMovies(releasedData.results || []);
                }
            } catch (err) {
                if (err.name !== 'AbortError') {
                    setError(err.message);
                }
            } finally {
                setLoadingMovies(false);
            }
        };

        const timer = setTimeout(() => {
            fetchMovies();
        }, 400);

        return () => {
            clearTimeout(timer);
            controller.abort();
        };
    }, [query]);

    return (
        <div>
            <nav className='nav-bar'>
                <Link to='/' className='back-button'>
                    &larr; Back to Dashboard
                </Link>
                <h2 className='nav-title'>Movie Search Explorer</h2>
                <div className='nav-spacer'></div>
            </nav>

            <div className='search-bar-wrapper'>
                <input
                    type="text"
                    className="movie-search-input"
                    placeholder="Search any movie..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                />
            </div>

            <div className='movie-search-container'>
                {loadingMovies && <p className="status-message">Loading movies...</p>}
                {error && <p className='error-message'>{error}</p>}

                {!loadingMovies && !error && movies.length === 0 && (
                    <p className="status-message">No movies found matching "{query}".</p>
                )}

                {!loadingMovies && !error && movies.map((movie) => (
                    <Link
                        to={`${movie.id}`}
                        key={movie.id}
                        className='movie-card-link'
                    >
                        <MovieContainer movie={movie} />
                    </Link>
                ))}
            </div>
        </div>
    );
}

function MovieSearchExplorer() {
    return (
        <Routes>
            <Route path='/' element={<MovieDiscovery />} />
            <Route path=':id' element={<MovieDetails />} />
        </Routes>
    );
}

export default MovieSearchExplorer;