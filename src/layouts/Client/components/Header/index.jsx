import Logo from "../../../../assets/image/logo.webp";
import LoginModal from "../../../../pages/Client/Login";
import RegisterModal from "../../../../pages/Client/Register";
import { useState } from "react";


function Header() {
    const [showRegisterModal, setShowRegisterModal] = useState(false);
    const [showLoginModal, setShowLoginModal] = useState(false);

    const openRegisterModal = () => {
        setShowRegisterModal(true);
    };

    const closeRegisterModal = () => {
        setShowRegisterModal(false);
    };

    const openLoginModal = () => {
        console.log("Login Modal")
        setShowLoginModal(true);
    };

    const closeLoginModal = () => {
        setShowLoginModal(false);
    };

    return (
        <div>
            <header className="header bg-primary/30 flex justify-between items-center p-4 transition duration-500">
                <div className="flex items-center" style={{ marginLeft: 100 }}>
                    <img alt="NCC logo" className="mr-2" height="50" src={Logo} width="50" />
                    <nav className="flex space-x-4">
                        <a className="text-red-500 pr-5" href="index.html">
                            Trang chủ
                        </a>
                        <a className="text-white pr-5 hover-text" href="#">
                            Lịch Chiếu
                        </a>
                        <a className="text-white pr-5 hover-text" href="#">
                            Tin Tức
                        </a>
                        <a className="text-white pr-5 hover-text" href="#">
                            Khuyến Mãi
                        </a>
                        <a className="text-white pr-5 hover-text" href="#">
                            Giá Vé
                        </a>
                        <a className="text-white pr-5 hover-text" href="#">
                            Liên Hoan Phim
                        </a>
                        <a className="text-white pr-5 hover-text" href="#">
                            Giới Thiệu
                        </a>
                    </nav>
                </div>
                <div className="flex items-center" style={{ marginRight: 100 }}>
                    <button
                        className="border border-white text-white py-2 px-4 pr-6 pl-6 rounded-full mr-6 hover-zoom"
                        onClick={openRegisterModal}
                    >
                        Đăng Kí
                    </button>
                    <button className="bg-red-500 text-white py-2 px-4 rounded-full hover-zoom"
                        onClick={openLoginModal}
                    >
                        Đăng nhập
                    </button>
                </div>
            </header>


            {showLoginModal && (
                <LoginModal
                    closeModal={closeLoginModal}
                    openRegisterModal={() => {setShowRegisterModal(true), setShowLoginModal(false)}}
                />
            )}
            {showRegisterModal && (
                <RegisterModal
                    closeModal={closeRegisterModal}
                    openLoginModal={() => { setShowLoginModal(true); setShowRegisterModal(false) }}
                />
            )}
        </div>
    );
}

export default Header;