import { useEffect, useState } from 'react';
import Screen from '../../../assets/image/screen.webp';
const Seat = () => {
    const [timeLeft, setTimeLeft] = useState(600); 

    useEffect(() => {
        if (timeLeft === 0) return;
        const timerId = setInterval(() => {
            setTimeLeft((prevTime) => prevTime - 1);
        }, 1000); 
        return () => clearInterval(timerId);
    }, [timeLeft]);


    const formatTime = (seconds) => {
        const minutes = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${minutes}:${secs < 10 ? '0' : ''}${secs}`; // Add leading zero to seconds if needed
    };
    return (
        <>
            <div className="flex justify-between items-center p-4 px-64">
                <div className="flex justify-center items-center">
                    <p className="mr-4">Giờ chiếu: <span className="font-bold">10:20</span></p>
                </div>
                <div className="flex space-x-4">
                    <button id="timer" className="bg-red-600 text-white px-4 py-2 rounded-full">
                        Thời gian chọn ghế: {formatTime(timeLeft)}
                    </button>
                </div>
            </div>
            <div className="px-32">
                <img className='ml-28' src={Screen} alt="" />
                <div className="px-52">
                    <div className="seat available">A15</div>
                    <div className="seat available">A14</div>
                    <div className="seat available">A13</div>
                    <div className="seat available">A12</div>
                    <div className="seat available">A11</div>
                    <div className="seat available">A10</div>
                    <div className="seat available">A9</div>
                    <div className="seat available">A8</div>
                    <div className="seat available">A7</div>
                    <div className="seat available">A6</div>
                    <div className="seat available">A5</div>
                    <div className="seat available">A4</div>
                    <div className="seat available">A3</div>
                    <div className="seat available">A2</div>
                    <div className="seat available">A1</div>
                    <div className="seat available">A0</div>

                    <div className="seat available">B15</div>
                    <div className="seat available">B14</div>
                    <div className="seat available">B13</div>
                    <div className="seat available">B12</div>
                    <div className="seat available">B11</div>
                    <div className="seat available">B10</div>
                    <div className="seat available">B9</div>
                    <div className="seat available">B8</div>
                    <div className="seat available">B7</div>
                    <div className="seat available">B6</div>
                    <div className="seat available">B5</div>
                    <div className="seat available">B4</div>
                    <div className="seat available">B3</div>
                    <div className="seat available">B2</div>
                    <div className="seat available">B1</div>
                    <div className="seat available">B0</div>

                    <div className="seat available">C15</div>
                    <div className="seat available">C14</div>
                    <div className="seat available">C13</div>
                    <div className="seat available">C12</div>
                    <div className="seat available">C11</div>
                    <div className="seat available">C10</div>
                    <div className="seat available">C9</div>
                    <div className="seat available">C8</div>
                    <div className="seat available">C7</div>
                    <div className="seat available">C6</div>
                    <div className="seat available">C5</div>
                    <div className="seat available">C4</div>
                    <div className="seat available">C3</div>
                    <div className="seat available">C2</div>
                    <div className="seat available">C1</div>
                    <div className="seat available">C0</div>

                    <div className="seat available">D15</div>
                    <div className="seat available">D14</div>
                    <div className="seat available">D13</div>
                    <div className="seat vip">D12</div>
                    <div className="seat vip">D11</div>
                    <div className="seat available">D10</div>
                    <div className="seat available">D9</div>
                    <div className="seat vip">D8</div>
                    <div className="seat vip">D7</div>
                    <div className="seat available">D6</div>
                    <div className="seat vip">D5</div>
                    <div className="seat vip">D4</div>
                    <div className="seat vip">D3</div>
                    <div className="seat available">D2</div>
                    <div className="seat available">D1</div>
                    <div className="seat available">D0</div>

                    <div className="seat available">E15</div>
                    <div className="seat available">E14</div>
                    <div className="seat available">E13</div>
                    <div className="seat available">E12</div>
                    <div className="seat available">E11</div>
                    <div className="seat available">E10</div>
                    <div className="seat available">E9</div>
                    <div className="seat available">E8</div>
                    <div className="seat available">E7</div>
                    <div className="seat available">E6</div>
                    <div className="seat available">E5</div>
                    <div className="seat available">E4</div>
                    <div className="seat available">E3</div>
                    <div className="seat available">E2</div>
                    <div className="seat available">E1</div>
                    <div className="seat available">E0</div>

                    <div className="seat available">F15</div>
                    <div className="seat available">F14</div>
                    <div className="seat available">F13</div>
                    <div className="seat available">F12</div>
                    <div className="seat available">F11</div>
                    <div className="seat available">F10</div>
                    <div className="seat available">F9</div>
                    <div className="seat available">F8</div>
                    <div className="seat available">F7</div>
                    <div className="seat available">F6</div>
                    <div className="seat available">F5</div>
                    <div className="seat available">F4</div>
                    <div className="seat available">F3</div>
                    <div className="seat available">F2</div>
                    <div className="seat available">F1</div>
                    <div className="seat available">F0</div>

                    <div className="seat available">G15</div>
                    <div className="seat available">G14</div>
                    <div className="seat available">G13</div>
                    <div className="seat available">G12</div>
                    <div className="seat available">G11</div>
                    <div className="seat available">G10</div>
                    <div className="seat available">G9</div>
                    <div className="seat selected">G8</div>
                    <div className="seat available">G7</div>
                    <div className="seat available">G6</div>
                    <div className="seat available">G5</div>
                    <div className="seat available">G4</div>
                    <div className="seat available">G3</div>
                    <div className="seat available">G2</div>
                    <div className="seat available">G1</div>
                    <div className="seat available">G0</div>

                    <div className="seat available">H15</div>
                    <div className="seat available">H14</div>
                    <div className="seat available">H13</div>
                    <div className="seat available">H12</div>
                    <div className="seat available">H11</div>
                    <div className="seat available">H10</div>
                    <div className="seat available">H9</div>
                    <div className="seat available">H8</div>
                    <div className="seat available">H7</div>
                    <div className="seat available">H6</div>
                    <div className="seat available">H5</div>
                    <div className="seat available">H4</div>
                    <div className="seat available">H3</div>
                    <div className="seat available">H2</div>
                    <div className="seat available">H1</div>
                    <div className="seat available">H0</div>

                    <div className="seat available">I15</div>
                    <div className="seat available">I14</div>
                    <div className="seat available">I13</div>
                    <div className="seat available">I12</div>
                    <div className="seat available">I11</div>
                    <div className="seat available">I10</div>
                    <div className="seat available">I9</div>
                    <div className="seat available">I8</div>
                    <div className="seat available">I7</div>
                    <div className="seat available">I6</div>
                    <div className="seat available">I5</div>
                    <div className="seat available">I4</div>
                    <div className="seat available">I3</div>
                    <div className="seat available">I2</div>
                    <div className="seat available">I1</div>
                    <div className="seat available">I0</div>

                    <div className="seat available">J15</div>
                    <div className="seat available">J14</div>
                    <div className="seat available">J13</div>
                    <div className="seat available">J12</div>
                    <div className="seat available">J11</div>
                    <div className="seat available">J10</div>
                    <div className="seat available">J9</div>
                    <div className="seat available">J8</div>
                    <div className="seat available">J7</div>
                    <div className="seat available">J6</div>
                    <br />
                    <div className="seat double">K13</div>
                    <div className="seat double">K12</div>
                    <div className="seat double">K11</div>
                    <div className="seat double">K10</div>
                    <div className="seat double">K9</div>
                    <div className="seat double">K8</div>
                    <div className="seat double">K7</div>
                    <div className="seat double">K6</div>
                    <div className="seat double">K5</div>
                    <div className="seat double">K4</div>
                    <div className="seat double">K3</div>
                    <div className="seat double">K2</div>
                    <div className="seat double">K1</div>
                    <div className="seat double">K0</div>
                </div>
            </div>
            <div className="flex justify-center mt-4">
                <div className="flex items-center mr-4">
                    <div className="seat taken mr-2"></div>
                    <span>Đã đặt</span>
                </div>
                <div className="flex items-center mr-4">
                    <div className="seat selected mr-2"></div>
                    <span>Ghế bạn chọn</span>
                </div>
                <div className="flex items-center mr-4">
                    <div className="seat available mr-2"></div>
                    <span>Ghế thường</span>
                </div>
                <div className="flex items-center mr-4">
                    <div className="seat vip mr-2"></div>
                    <span>Ghế VIP</span>
                </div>
                <div className="flex items-center">
                    <div className="seat double mr-2"></div>
                    <span>Ghế đôi</span>
                </div>
            </div>
            <div className="flex justify-between items-center p-4 px-64">
                <div>
                    <p className="text-lg">Ghế đã chọn:</p>
                    <p className="text-lg">Tổng tiền: <span className="font-bold">0đ</span></p>
                </div>
                <div className="flex space-x-4">
                    <button className="px-4 py-2 border border-gray-500 rounded-full text-white hover-background">Quay lại</button>
                    <button className="px-4 py-2 bg-red-600 rounded-full text-gray-300 hover-zoom"> <a href="checkout.html">Thanh toán</a></button>
                </div>
            </div>
        </>
    );
}

export default Seat;