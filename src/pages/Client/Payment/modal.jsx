
const PromoCodeModal = ({ isOpen, onClose, promoCodes, onSelectPromoCode }) => {
    if (!isOpen) return null;
  
    return (
      <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-lg w-96">
          <div className="bg-yellow-500 text-white text-lg font-semibold p-4 rounded-t-lg flex justify-between items-center">
            <span>Chọn Voucher</span>
            <button className="text-xl" onClick={onClose}>×</button>
          </div>
          <div className="p-4">
            <input className="w-full p-2 border rounded-md mb-4" placeholder="Nhập mã khuyến mãi" type="text" />
            <div className="space-y-4">
              {promoCodes.map((code, index) => (
                code?.status === "Còn hạn" ? (
                  <div key={index} className="border rounded-md p-4 flex items 
                  center justify-between" style={{ cursor: 'pointer' }} onClick={() => onSelectPromoCode(code.ma_giam_gia)}>
                    <div className="flex items-center">
                      <img alt="Voucher image" className="w-16 h-16 mr-4" src="https://storage.googleapis.com/a1aa/image/mtqkgsnb9j70L1wtUJ3YU0JKLgMdco5IhPhoctBgPdNs238E.jpg" />
                      <div>
                        <div className="text-red-600 font-semibold">Giảm giá {code.muc_giam_gia}%</div>
                        <div className="text-gray-600">Đơn tối thiểu {code.gia_don_toi_thieu}đ</div>
                        <div className="text-gray-600">Hạn dùng: <span className="text-red-600">{code.ngay_het_han}</span></div>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <div className="bg-green-500 text-white rounded-full w-8 h-8 flex items-center justify-center mr-2">{code.usageCount}</div>
                      <input className="form-radio" name="voucher" type="radio" />
                    </div>
                  </div>
                ) : (
                  <></>
                )
              ))}
            </div>
          </div>
          <div className="bg-gray-100 p-4 flex justify-end space-x-4 rounded-b-lg">
            <button className="bg-gray-500 text-white px-4 py-2 rounded-md" onClick={onClose}>Quay lại</button>
          </div>
        </div>
      </div>
    );
  };

  export default PromoCodeModal;