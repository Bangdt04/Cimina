import { Swiper, SwiperSlide } from 'swiper/react';
import BannerImage from "../../../assets/image/banner.webp";
import BannerImage1 from "../../../assets/image/Banner image1.webp";
import BannerImage2 from "../../../assets/image/Banner image2.webp";
import BannerImage3 from "../../../assets/image/Banner image3.webp";
import BannerImage4 from "../../../assets/image/Banner image4.webp";

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

// Import required modules
import { Autoplay, Pagination, Navigation } from 'swiper/modules';
import './Banner.css'; // Giả sử bạn tạo một file CSS riêng cho Banner

const Banner = () => {
    return (
        <div className="banner-container">
            <Swiper
                spaceBetween={30}
                centeredSlides={true}
                autoplay={{
                    delay: 4500,
                    disableOnInteraction: false,
                }}
                pagination={{
                    clickable: true,
                }}
                navigation={true}
                loop={true}
                modules={[Autoplay, Pagination, Navigation]}
                className="mySwiper"
                breakpoints={{
                    320: {
                        slidesPerView: 1,
                        spaceBetween: 10
                    },
                    640: {
                        slidesPerView: 1,
                        spaceBetween: 20
                    },
                    768: {
                        slidesPerView: 1,
                        spaceBetween: 30
                    },
                    1024: {
                        slidesPerView: 1,
                        spaceBetween: 30
                    }
                }}
            >
                <SwiperSlide>
                    <img alt="Banner image" src={BannerImage} />
                </SwiperSlide>
                <SwiperSlide>
                    <img alt="Banner image" src={BannerImage1} />
                </SwiperSlide>
                <SwiperSlide>
                    <img alt="Banner image" src={BannerImage2} />
                </SwiperSlide>
                <SwiperSlide>
                    <img alt="Banner image" src={BannerImage3} />
                </SwiperSlide>
                <SwiperSlide>
                    <img alt="Banner image" src={BannerImage4} />
                </SwiperSlide>
            </Swiper>
        </div>
    )
}

export default Banner;
