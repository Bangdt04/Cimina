import React, { useState } from 'react';
import { Modal } from 'antd';
import { 
    PlayCircleOutlined, 
    CloseOutlined, 
    LoadingOutlined 
} from '@ant-design/icons';
import './1.css';

const ModalTrailerPage = ({ closeModal, trailerUrl }) => {
    const [isLoading, setIsLoading] = useState(true);

    // Extract YouTube video ID from the URL
    const getYouTubeEmbedUrl = (url) => {
        if (!url) return null;
        
        const videoIdMatch = url.match(/(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
        
        return videoIdMatch 
            ? `https://www.youtube.com/embed/${videoIdMatch[1]}?autoplay=1&modestbranding=1&rel=0` 
            : null;
    };

    const embedUrl = getYouTubeEmbedUrl(trailerUrl);

    return (
        <Modal
            open={true}
            onCancel={closeModal}
            footer={null}
            // Make width responsive
            width="90%"
            // Adjust max-width for larger screens
            style={{ maxWidth: '1200px' }}
            centered
            closeIcon={<CloseOutlined className="text-white hover:text-yellow-500 transition-all duration-300" />}
            className="custom-trailer-modal"
            destroyOnClose
        >
            <div className="trailer-wrapper bg-gradient-to-br from-gray-900 to-black rounded-2xl overflow-hidden shadow-2xl border-4 border-gray-800">
                <div className="trailer-content relative pt-[56.25%]"> {/* 16:9 Aspect Ratio Container */}
                    {isLoading && (
                        <div className="absolute inset-0 z-10 flex items-center justify-center bg-black bg-opacity-70">
                            <LoadingOutlined 
                                className="text-5xl text-yellow-500" 
                                spin 
                            />
                        </div>
                    )}

                    {embedUrl ? (
                        <iframe
                            // Use absolute positioning to fill the aspect ratio container
                            className="absolute top-0 left-0 w-full h-full"
                            src={embedUrl}
                            title="Movie Trailer"
                            frameBorder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                            onLoad={() => setIsLoading(false)}
                        />
                    ) : (
                        <div className="absolute inset-0 flex items-center justify-center bg-gray-900 text-center">
                            <div className="text-red-400 text-2xl flex flex-col items-center space-y-4 p-6">
                                <PlayCircleOutlined className="text-6xl text-red-500" />
                                <p className="text-white text-center">
                                    Không thể tải trailer. 
                                    <br />
                                    URL không hợp lệ hoặc đã bị lỗi.
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </Modal>
    );
};

export default ModalTrailerPage;