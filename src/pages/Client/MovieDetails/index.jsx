import { useEffect, useState } from "react";
import ImageMovie from "../../../assets/image/joker.webp";
import ModalTrailerPage from "./ModalTrailer";
import Box from "./Box";
import { useParams } from "react-router-dom";
import { useGetMovieById } from "../../../hooks/api/useMovieApi";


const MovieDetailsPage = () => {
    const [showTrailerModal, setShowTrailerModal] = useState(false);
    let { id } = useParams();
    const { isLoading: isLoadingMovie, data: movie } = id
    ? useGetMovieById(id)
    : { isLoading: null, data: null };

    useEffect(() => {
        if(!movie) return;
        console.log("Movie", movie)
    }, [movie]);

    const closeTrailerModal = () => {
        setShowTrailerModal(false);
    };

    const openTrailerModal = () => {
        console.log("Modal Trailer")
        setShowTrailerModal(true);
    };
    return (
        <>
            <main className="main-content py-16 px-8 mt-20">
                <div className="flex px-64" >
                    <img alt="Movie Poster" className="mr-8 rounded-lg" height="450" src={ImageMovie} width="300" />
                    <div>
                        <h1 className="text-4xl font-bold mb-4">
                            JOKER: FOLIE À DEUX ĐIÊN CÓ ĐÔI-TIẾP
                        </h1>
                        <p className="mb-2">
                            Kinh dị, Tâm lý, tình cảm, Nhạc kịch | MY | 138 phút | Đạo diễn: Todd Phillips
                        </p>
                        <p className="mb-2">
                            Diễn viên: Sequel to the film "JOKER" from 2019
                        </p>
                        <p className="mb-2">
                            Khởi chiếu: 04/10/2024
                        </p>
                        <p className="mb-4">
                            Phần tiếp theo của bộ phim "JOKER" năm 2019
                        </p>
                        <p className="mb-4 text-red-500">
                            Kiểm duyệt: T18: Phim được phổ biến đến khán giả từ đủ 18 tuổi trở lên.
                        </p>
                        <div className="flex space-x-4">
                            <button className="bg-gray-800 text-white py-2 px-4 rounded-full hover-zoom">
                                Chi tiết nội dung
                            </button>
                            <button className="btn-primary  text-yellow-400 py-2 px-4 rounded-full hover-zoom" id="trailerBtn" onClick={openTrailerModal}>
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
                />
            )}

        </>
    );

}

export default MovieDetailsPage;