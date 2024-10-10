
const LoginModal = ({ closeModal, openRegisterModal }) => {
    return (
        <div className="fixed inset-0 bg-black bg-opacity-65 flex justify-center items-center z-50" id="loginModal">
            <div className="bg-black bg-opacity-90 p-8 rounded-lg shadow-lg w-96 relative">
                <button className="absolute top-2 right-2 text-white" onClick={closeModal}>
                    X
                </button>
                <h2 className="text-white text-2xl mb-6">
                    Đăng nhập
                </h2>
                <form>
                    <div className="mb-4">
                        <label className="block text-white mb-2" htmlFor="email">
                            Email
                        </label>
                        <input
                            className="w-full p-2 rounded-lg border border-gray-300"
                            id="email"
                            placeholder="Email"
                            type="email"
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-white mb-2" htmlFor="password">
                            Mật khẩu
                        </label>
                        <input
                            className="w-full p-2 rounded-lg border border-gray-300"
                            id="password"
                            placeholder="Mật khẩu"
                            type="password"
                        />
                    </div>
                    <div className="flex justify-between items-center mb-6">
                        <a className="text-red-500" href="#">
                            Quên mật khẩu?
                        </a>
                    </div>
                    <button
                        className="w-full bg-red-500 text-white py-2 rounded-lg hover-zoom"
                        type="submit"
                    >
                        Đăng Nhập
                    </button>
                </form>
                <p className="text-white mt-4 text-center">
                    Bạn chưa có tài khoản?
                    <a className="text-red-500" href="#" onClick={openRegisterModal}>
                        Đăng kí
                    </a>
                </p>
            </div>
        </div>
    )
}

export default LoginModal;