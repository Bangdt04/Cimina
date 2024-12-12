import React, { useState, useEffect } from 'react';
import Logo from "../../../../assets/image/logo.webp";
import LoginModal from "../../../../pages/Client/Login";
import RegisterModal from "../../../../pages/Client/Register";
import { NavLink, Link } from 'react-router-dom';
import config from '../../../../config';
import { Dropdown, Menu, Spin } from 'antd';
import { clearToken, isTokenStoraged, getRoles, getInfoAuth } from '../../../../utils/storage';
import { useGetGernes } from "../../../../hooks/api/useGenreApi";
import Search from "../../../../pages/Client/Home/Search"; // Add this import
import VerifyOtpModal from "../../../../pages/Client/VerifyOtp";
import { MenuOutlined, CloseOutlined } from '@ant-design/icons';
import { Transition } from '@headlessui/react';

function Header() {
    const [showRegisterModal, setShowRegisterModal] = useState(false);
    const [showLoginModal, setShowLoginModal] = useState(false);
    const [showVerifyModal, setShowVerifyModal] = useState(false);
    const [email, setEmail] = useState('');
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isGenreSubMenuOpen, setIsGenreSubMenuOpen] = useState(false); // New state for submenu
    const { data, isLoading } = useGetGernes();
    const roles = getRoles();
    const info = getInfoAuth();

    const onLogout = () => {
        clearToken();
        window.location.reload();
    };

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    };

    const toggleGenreSubMenu = () => {
        setIsGenreSubMenuOpen(!isGenreSubMenuOpen);
    };

    const handleSaveEmail = (email) => {
        setEmail(email);
    };

    // Disable body scroll when mobile menu is open
    useEffect(() => {
        if (isMobileMenuOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'auto';
        }

        // Cleanup on unmount
        return () => {
            document.body.style.overflow = 'auto';
        };
    }, [isMobileMenuOpen]);

    const menu = (
        <Menu>
            <Menu.Item key="1">
                <NavLink to={config.routes.web.profile}>
                    Thông tin cá nhân
                </NavLink>
            </Menu.Item>
            <Menu.Item key="2">
                <button onClick={onLogout} className="w-full text-left">
                    Đăng xuất
                </button>
            </Menu.Item>
        </Menu>
    );

    const menuNavLink = (
        <Menu>
            {isLoading ? (
                <Menu.Item key="loading" className="flex justify-center">
                    <Spin />
                </Menu.Item>
            ) : (
                data && data.data.map((genre) => (
                    <Menu.Item key={genre.id}>
                        <NavLink to={`${config.routes.web.theLoai}/${genre.id}`}>
                            {genre.ten_loai_phim}
                        </NavLink>
                    </Menu.Item>
                ))
            )}
        </Menu>
    );

    return (
        <>
            <header className="bg-primary/30 flex justify-between items-center p-4 transition duration-500 backdrop-blur-sm fixed top-0 left-0 w-full z-50">
                {/* Logo and Navigation */}
                <div className="flex items-center">
                    <Link to={config.routes.web.home} className="flex items-center">
                        <img
                            alt="NCC logo"
                            className="h-12 w-auto"
                            src={Logo}
                        />
                    </Link>
                    {/* Desktop Navigation */}
                    <nav className="hidden lg:flex space-x-6 ml-8" aria-label="Primary">
                        <NavLink
                            className={({ isActive }) =>
                                isActive
                                    ? 'text-white font-semibold'
                                    : 'text-gray-400 hover:text-white transition-colors duration-300'
                            }
                            to={config.routes.web.home}
                        >
                            Trang chủ
                        </NavLink>
                        <Dropdown overlay={menuNavLink} trigger={['hover']} placement="bottom">
                            <button
                                type="button"
                                className="text-gray-400 hover:text-white flex items-center transition-colors duration-300"
                                aria-haspopup="menu"
                            >
                                Thể Loại <span className="ml-1 text-sm">▼</span>
                            </button>
                        </Dropdown>
                        <NavLink
                            className={({ isActive }) =>
                                isActive
                                    ? 'text-white font-semibold'
                                    : 'text-gray-400 hover:text-white transition-colors duration-300'
                            }
                            to={config.routes.web.khuyenMai}
                        >
                            Tin tức
                        </NavLink>
                        <NavLink
                            className={({ isActive }) =>
                                isActive
                                    ? 'text-white font-semibold'
                                    : 'text-gray-400 hover:text-white transition-colors duration-300'
                            }
                            to={config.routes.web.giaVe}
                        >
                            Giá Vé
                        </NavLink>
                        <NavLink
                            className={({ isActive }) =>
                                isActive
                                    ? 'text-white font-semibold'
                                    : 'text-gray-400 hover:text-white transition-colors duration-300'
                            }
                            to={config.routes.web.lienHoanPhim}
                        >
                            Liên Hoan Phim
                        </NavLink>
                        <NavLink
                            className={({ isActive }) =>
                                isActive
                                    ? 'text-white font-semibold'
                                    : 'text-gray-400 hover:text-white transition-colors duration-300'
                            }
                            to={config.routes.web.gioiThieu}
                        >
                            Giới Thiệu
                        </NavLink>
                    </nav>
                </div>

                {/* Search Component - Desktop */}
                <div className="hidden lg:block flex-1 mx-8">
                    <Search />
                </div>

                {/* User Actions and Mobile Menu Button */}
                <div className="flex items-center space-x-4">
                    {isTokenStoraged() ? (
                        <Dropdown overlay={menu} trigger={['click']} placement="bottomRight">
                            <button
                                className="text-white hover:text-gray-400 focus:outline-none flex items-center"
                                aria-haspopup="menu"
                            >
                                {info.ho_ten} <span className="ml-1">▼</span>
                            </button>
                        </Dropdown>
                    ) : (
                        <div className="hidden lg:flex space-x-4">
                            <button
                                className="border border-white text-white py-2 px-4 rounded-full hover:bg-gray-700 transition-colors duration-300"
                                onClick={() => setShowRegisterModal(true)}
                            >
                                Đăng kí
                            </button>
                            <button
                                className="bg-gradient-to-r from-red-500 via-red-600 to-pink-500 text-white py-2 px-4 rounded-full font-semibold hover:from-red-600 hover:to-pink-600 transition-colors duration-300"
                                onClick={() => setShowLoginModal(true)}
                            >
                                Đăng nhập
                            </button>
                        </div>
                    )}

                    {/* Mobile Menu Button */}
                    <button
                        className="lg:hidden text-white focus:outline-none"
                        onClick={toggleMobileMenu}
                        aria-label={isMobileMenuOpen ? "Đóng menu điều hướng" : "Mở menu điều hướng"}
                        aria-expanded={isMobileMenuOpen}
                    >
                        {isMobileMenuOpen ? <CloseOutlined className="text-2xl" /> : <MenuOutlined className="text-2xl" />}
                    </button>
                </div>
            </header>

            {/* Mobile Navigation Menu */}
            <Transition
                show={isMobileMenuOpen}
                enter="transition ease-out duration-300"
                enterFrom="-translate-x-full"
                enterTo="translate-x-0"
                leave="transition ease-in duration-200"
                leaveFrom="translate-x-0"
                leaveTo="-translate-x-full"
            >
                <nav
                    className="lg:hidden bg-slate-700 backdrop-blur-sm fixed top-0 left-0 w-full h-screen z-40 flex flex-col items-center pt-20 space-y-6 p-8 overflow-y-auto"
                    aria-label="Mobile Primary"
                >
                    {/* Trang chủ */}
                    <NavLink
                        className={({ isActive }) =>
                            isActive
                                ? 'text-white text-2xl font-semibold'
                                : 'text-gray-400 text-2xl hover:text-white transition-colors duration-300'
                        }
                        to={config.routes.web.home}
                        onClick={() => setIsMobileMenuOpen(false)}
                    >
                        Trang chủ
                    </NavLink>

                    {/* Thể Loại - Toggle Submenu */}
                    <div className="w-full">
                        <button
                            type="button"
                            className="w-full text-left text-gray-400 text-2xl hover:text-white flex justify-between items-center transition-colors duration-300"
                            onClick={toggleGenreSubMenu}
                        >
                            Thể Loại <span className="ml-1 text-sm">{isGenreSubMenuOpen ? "▲" : "▼"}</span>
                        </button>
                        {/* Submenu */}
                        {isGenreSubMenuOpen && (
                            <div className="mt-2 space-y-2">
                                {isLoading ? (
                                    <div className="flex justify-center">
                                        <Spin />
                                    </div>
                                ) : (
                                    data && data.data.map((genre) => (
                                        <NavLink
                                            key={genre.id}
                                            className={({ isActive }) =>
                                                isActive
                                                    ? 'text-white text-xl font-semibold'
                                                    : 'text-gray-400 text-xl hover:text-white transition-colors duration-300'
                                            }
                                            to={`${config.routes.web.theLoai}/${genre.id}`}
                                            onClick={() => setIsMobileMenuOpen(false)}
                                        >
                                            {genre.ten_loai_phim}
                                        </NavLink>
                                    ))
                                )}
                            </div>
                        )}
                    </div>

                    {/* Tin tức */}
                    <NavLink
                        className={({ isActive }) =>
                            isActive
                                ? 'text-white text-2xl font-semibold'
                                : 'text-gray-400 text-2xl hover:text-white transition-colors duration-300'
                        }
                        to={config.routes.web.khuyenMai}
                        onClick={() => setIsMobileMenuOpen(false)}
                    >
                        Tin tức
                    </NavLink>

                    {/* Giá Vé */}
                    <NavLink
                        className={({ isActive }) =>
                            isActive
                                ? 'text-white text-2xl font-semibold'
                                : 'text-gray-400 text-2xl hover:text-white transition-colors duration-300'
                        }
                        to={config.routes.web.giaVe}
                        onClick={() => setIsMobileMenuOpen(false)}
                    >
                        Giá Vé
                    </NavLink>

                    {/* Liên Hoan Phim */}
                    <NavLink
                        className={({ isActive }) =>
                            isActive
                                ? 'text-white text-2xl font-semibold'
                                : 'text-gray-400 text-2xl hover:text-white transition-colors duration-300'
                        }
                        to={config.routes.web.lienHoanPhim}
                        onClick={() => setIsMobileMenuOpen(false)}
                    >
                        Liên Hoan Phim
                    </NavLink>

                    {/* Giới Thiệu */}
                    <NavLink
                        className={({ isActive }) =>
                            isActive
                                ? 'text-white text-2xl font-semibold'
                                : 'text-gray-400 text-2xl hover:text-white transition-colors duration-300'
                        }
                        to={config.routes.web.gioiThieu}
                        onClick={() => setIsMobileMenuOpen(false)}
                    >
                        Giới Thiệu
                    </NavLink>

                    {/* Search Component - Mobile */}
                    <div className="w-full mt-4">
                        <Search />
                    </div>

                    {/* User Actions - Mobile */}
                    {isTokenStoraged() ? (
                        <Dropdown overlay={menu} trigger={['click']} placement="bottomCenter">
                            <button
                                className="text-white text-2xl hover:text-gray-400 focus:outline-none flex justify-center items-center"
                                aria-haspopup="menu"
                            >
                                {info.ho_ten} ▼
                            </button>
                        </Dropdown>
                    ) : (
                        <div className="flex flex-col space-y-4 mt-4 w-full">
                            <button
                                className="border border-white text-white py-2 px-4 rounded-full hover:bg-gray-700 transition-colors duration-300 text-lg"
                                onClick={() => {
                                    setShowRegisterModal(true);
                                    setIsMobileMenuOpen(false);
                                }}
                            >
                                Đăng kí
                            </button>
                            <button
                                className="bg-gradient-to-r from-red-500 via-red-600 to-pink-500 text-white py-2 px-4 rounded-full font-semibold hover:from-red-600 hover:to-pink-600 transition-colors duration-300 text-lg"
                                onClick={() => {
                                    setShowLoginModal(true);
                                    setIsMobileMenuOpen(false);
                                }}
                            >
                                Đăng nhập
                            </button>
                        </div>
                    )}
                </nav>
            </Transition>

            {/* Modals */}
            {showLoginModal && (
                <LoginModal
                    closeModal={() => setShowLoginModal(false)}
                    openRegisterModal={() => { setShowRegisterModal(true); setShowLoginModal(false); }}
                />
            )}
            {showRegisterModal && (
                <RegisterModal
                    closeModal={() => setShowRegisterModal(false)}
                    openVerifyModal={() => { setShowVerifyModal(true); setShowRegisterModal(false); }}
                    openLoginModal={() => { setShowLoginModal(true); setShowRegisterModal(false); }}
                    handleSaveEmail={handleSaveEmail}
                />
            )}
            {showVerifyModal && (
                <VerifyOtpModal
                    closeModal={() => setShowVerifyModal(false)}
                    openLoginModal={() => { setShowLoginModal(true); setShowVerifyModal(false); }}
                    email={email}
                />
            )}
        </>
    );
}

    export default Header;
