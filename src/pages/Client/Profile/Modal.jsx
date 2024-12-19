import React from 'react';
import { jsPDF } from 'jspdf';
import './modal.css';

const Modal = ({ isOpen, onClose, ticket }) => {
    if (!isOpen) return null;

    const handlePrintBill = () => {
        const doc = new jsPDF();
        doc.text('Hóa Đơn Vé', 20, 10);
        doc.text(`Tên phim: ${ticket.ten_phim}`, 20, 20);
        doc.text(`Tên phòng: ${ticket.ten_phong}`, 20, 30);
        doc.text(`Ngày mua: ${ticket.ngay_mua}`, 20, 40);
        doc.text(`Trạng thái: ${ticket.trang_thai}`, 20, 50);
        doc.text(`Số lượng: ${ticket.so_luong}`, 20, 60);
        doc.text(`Ghế ngồi: ${ticket.ghe_ngoi}`, 20, 70);
        doc.text(`Tổng tiền: ${Number(ticket.tong_tien_thanh_toan).toLocaleString()} VNĐ`, 20, 80);
        doc.text(`Ghi chú: ${ticket.ghi_chu || "Không có ghi chú"}`, 20, 90);
        doc.text(`Mã giảm giá: ${ticket.ma_giam_gia || "Không có mã giảm giá"}`, 20, 100);
        doc.text(`Đồ ăn: ${ticket.do_an || "Không có đồ ăn"}`, 20, 110);
        doc.text(`Phương thức thanh toán: ${ticket.phuong_thuc_thanh_toan}`, 20, 120);
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h2 className="modal-title">Chi tiết vé</h2>
                <div className="modal-body">
                    <div className="modal-section">
                        <span className="icon">🎥</span>
                        <h3>Thông tin phim</h3>
                        <p><strong>Tên phim:</strong> {ticket.ten_phim}</p>
                        <p><strong>Tên phòng:</strong> {ticket.ten_phong_chieu}</p>
                        <p><strong>Ngày mua:</strong> {ticket.ngay_mua}</p>
                    </div>
                    <div className="modal-section">
                        <span className="icon">💺</span>
                        {ticket.trang_thai === 0 || ticket.trang_thai === 1 ? (
                            <div>
                                <h3>Trạng thái</h3>
                                <p>
                                    <strong>Trạng thái:</strong>{' '}
                                    {ticket.trang_thai === 0 ? 'Đã thanh toán' : 'Đã check in'}
                                </p>
                            </div>
                        ) : (
                            <span className="px-6 py-2 rounded-full bg-red-500">Chưa xử lý</span>
                        )}
                        <p><strong>Số lượng:</strong> {ticket.so_luong}</p>
                        <p><strong>Ghế ngồi:</strong> {ticket.ghe_ngoi}</p>
                    </div>
                    <div className="modal-section">
                        <span className="icon">💵</span>
                        <h3>Thanh toán</h3>
                        <p><strong>Tổng tiền:</strong> {Number(ticket.tong_tien_thanh_toan).toLocaleString()} VNĐ</p>
                        <p><strong>Phương thức thanh toán:</strong> {ticket.phuong_thuc_thanh_toan}</p>
                    </div>
                    <div className="modal-section">
                        <span className="icon">🍿</span>
                        <h3>Thông tin khác</h3>
                        <p><strong>Đồ ăn:</strong> {ticket.do_an || "Không có đồ ăn"}</p>
                        <p><strong>Ghi chú:</strong> {ticket.ghi_chu || "Không có ghi chú"}</p>
                        <p><strong>Mã giảm giá:</strong> {ticket.ma_giam_gia || "Không có mã giảm giá"}</p>
                    </div>
                </div>
                <div className="modal-footer">
                    <button className="btn btn-secondary" onClick={onClose}>Đóng</button>
                </div>
            </div>
        </div>
    );
};

export default Modal;
