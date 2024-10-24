import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import ModalTrailerPage from "./ModalTrailer";
import Box from "./Box";
import { moviesData } from "./moviesData";

const MovieDetailsPage = () => {
    const [showTrailerModal, setShowTrailerModal] = useState(false);
    const [movieDetails, setMovieDetails] = useState(null);
    const { id } = useParams();

    useEffect(() => {
        const movie = moviesData.find(movie => movie.id === parseInt(id));
        setMovieDetails(movie);
    }, [id]);

    const closeTrailerModal = () => {
        setShowTrailerModal(false);
    };

    const openTrailerModal = () => {
        setShowTrailerModal(true);
    };

    if (!movieDetails) {
        return <div>Loading...</div>;
    }

    return (
        <>
            <main className="main-content py-16 px-8 mt-20">
                <div className="flex px-64" >
                    <img alt="Movie Poster" className="mr-8 rounded-lg" height="450" src={movieDetails.posterImage} width="300" />
                    <div>
                        <h1 className="text-4xl font-bold mb-4">
                            {movieDetails.title}
                        </h1>
                        <p className="mb-2">
                            {`${movieDetails.genre} | ${movieDetails.country} | ${movieDetails.duration} | Đạo diễn: ${movieDetails.director}`}
                        </p>
                        <p className="mb-2">
                            Diễn viên: {movieDetails.actors}
                        </p>
                        <p className="mb-2">
                            Khởi chiếu: {movieDetails.releaseDate}
                        </p>
                        <p className="mb-4">
                            {movieDetails.description}
                        </p>
                        <p className="mb-4 text-red-500">
                            Kiểm duyệt: {movieDetails.ageRating}
                        </p>
                        <div className="flex space-x-4">
                            <button className="bg-gray-800 text-white py-2 px-4 rounded-full hover-zoom">
                                Chi tiết nội dung
                            </button>
                            <button className="btn-primary text-yellow-400 py-2 px-4 rounded-full hover-zoom" id="trailerBtn" onClick={openTrailerModal}>
                                Xem trailer
                            </button>
                        </div>
                    </div>
                </div>
            </main>
            <Box />
            {showTrailerModal && (
                <ModalTrailerPage
                    closeModal={closeTrailerModal}
                    trailerUrl={movieDetails.trailerUrl}
                />
            )}
        </>
    );
}

export default MovieDetailsPage;