import MovieList from "./MovieList";
import MovieHead from "./MovieHead";
import './movie.scss'

function MoviePage(){
    return (
        <div className="movie-container h-full flex flex-col">
            <MovieHead />
            <MovieList />
        </div>
    );
}

export default MoviePage;