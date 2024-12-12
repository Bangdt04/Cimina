import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import ModalTrailerPage from "./ModalTrailer";
import Box from "./Box";
import { useGetMovieById } from "../../../hooks/api/useMovieApi";
import { Spin, Modal } from "antd";

const MovieDetailsPage = () => {
    const [showTrailerModal, setShowTrailerModal] = useState(false);
    const [showContentDetailsModal, setShowContentDetailsModal] = useState(false);
    const { id } = useParams();
    const { isLoading: isLoadingMovie, data: movie } = id
        ? useGetMovieById(id)
        : { isLoading: null, data: null };

    useEffect(() => {
        if (!movie) return;
    }, [movie]);

    const allMovieGenres = movie?.data?.movie_genres.map((genre) => genre.ten_loai_phim).join(', ');
    
    const closeTrailerModal = () => {
        setShowTrailerModal(false);
    };

    const openTrailerModal = () => {
        setShowTrailerModal(true);
    };

    const openContentDetailsModal = () => {
        setShowContentDetailsModal(true);
    };

    const closeContentDetailsModal = () => {
        setShowContentDetailsModal(false);
    };

    if (isLoadingMovie || !movie) {
        return <Spin size="large" className='flex items-center justify-center h-screen'></Spin>;
    }

    return (
        <>
           <main 
    className="main-content pt-10 pb-10 px-4 sm:px-6 lg:px-8 mt-20"
    style={{
        backgroundImage: `linear-gradient(to bottom, rgba(72, 84, 96, 0.9) 0%, rgba(0,0,0,0.9) 100%), url(http://localhost:8000${movie.data.anh_phim})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
    }}
>
    {/* Container tổng, max-width để căn giữa nội dung */}
    <div className="max-w-5xl mx-auto flex flex-col lg:flex-row lg:items-start">
        {/* Poster */}
        <div className="flex-shrink-0 mb-4 lg:mb-0 lg:mr-8 w-full lg:w-1/3">
            <img 
                alt="Movie Poster" 
                className="w-full h-auto rounded-lg" 
                src={`http://localhost:8000${movie.data.anh_phim}`} 
            />
        </div>

        {/* Nội dung phim */}
        <div className="flex-1 text-center lg:text-left">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 text-white">
                {movie.data.ten_phim}
            </h1>
            <p className="text-sm sm:text-base text-gray-300 mb-2">
                {`${allMovieGenres} - ${movie.data.thoi_gian_phim} phút - ${movie.data.quoc_gia}`}
            </p>
            <p className="text-sm sm:text-base text-gray-300 mb-2">
                Đạo diễn: {movie.data.dao_dien}
            </p>
            <p className="text-sm sm:text-base text-gray-300 mb-2">
                Diễn viên: {movie.data.dien_vien}
            </p>
            <p className="text-sm sm:text-base text-gray-300 mb-2">
                Khởi chiếu: {movie.data.ngay_khoi_chieu}
            </p>
            <p className="text-sm sm:text-base text-gray-300 leading-relaxed mb-4">
                {movie.data.noi_dung}
            </p>
            <p className="text-sm sm:text-base text-red-500 mb-4">
                Kiểm duyệt: {movie.data.kiem_duyet} - Phim được phổ biến đến {movie.data.do_tuoi} tuổi...
            </p>
            
            <div className="flex flex-col sm:flex-row justify-center lg:justify-start gap-2 sm:gap-4">
                <button 
                    className="border border-yellow-500 rounded-full py-2 px-6 sm:px-8 text-yellow-500 hover:scale-105 transition-transform duration-200 w-full sm:w-auto"
                    onClick={openContentDetailsModal}
                >
                    Chi tiết nội dung
                </button>
                <button 
                    className="border border-yellow-500 rounded-full py-2 px-6 sm:px-8 text-yellow-500 hover:scale-105 transition-transform duration-200 w-full sm:w-auto" 
                    id="trailerBtn" 
                    onClick={openTrailerModal}
                >
                    Xem trailer
                </button>
            </div>
        </div>
    </div>
</main>


            {movie?.data?.hinh_thuc_phim !== 1 && <Box detail={movie?.data} />}

            {showTrailerModal && (
                <ModalTrailerPage
                    closeModal={closeTrailerModal}
                    trailerUrl={movie.data.trailer}
                />
            )}
            <Modal
                open={showContentDetailsModal}
                onCancel={closeContentDetailsModal}
                footer={null}
                width={window.innerWidth < 640 ? '90%' : 600}
                centered
                className="content-details-modal"
            >
                <div className="p-4 sm:p-6 bg-gray-50 rounded-lg">
                    <div className="flex items-center mb-4">
                        <svg 
                            xmlns="http://www.w3.org/2000/svg" 
                            className="h-6 w-6 sm:h-8 sm:w-8 mr-3 text-yellow-500" 
                            fill="none" 
                            viewBox="0 0 24 24" 
                            stroke="currentColor"
                        >
                            <path 
                                strokeLinecap="round" 
                                strokeLinejoin="round" 
                                strokeWidth={2} 
                                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" 
                            />
                        </svg>
                        <h2 className="text-xl sm:text-2xl font-bold text-gray-800">Nội Dung Phim</h2>
                    </div>
                    <div className="bg-white p-3 sm:p-4 rounded-md shadow-sm border border-gray-200">
                        <p className="text-gray-700 leading-relaxed text-sm sm:text-base">
                            {movie.data.noi_dung}
                        </p>
                    </div>
                </div>
            </Modal>
        </>
    );
}

export default MovieDetailsPage;
