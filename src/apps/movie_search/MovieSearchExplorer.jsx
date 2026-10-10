import { Link } from 'react-router-dom'
import "./MovieSearchExplorer.css"

function MovieSearchExplorer() {
    return (
        <div>
            <nav className='nav-bar'>
                <Link to='/' className='back-button'>
                    ← Back to Dashboard
                </Link>
                <h2 className='nav-title'>Movie Search Explorer</h2>

                <div className='nav-spacer'></div>
            </nav>

            <div className='movie-search-container'>
                <p>Temp text for movie search explorer</p>
            </div>
        </div>
    )
}

export default MovieSearchExplorer;