import React, { useState } from 'react';
import { Input, Modal } from 'antd';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';

const Search: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalVisible, setIsModalVisible] = useState(false);
    const navigate = useNavigate();

    const handleSearch = (value: string) => {
        console.log("Searching for:", value);
        setSearchTerm(''); 
        setIsModalVisible(false); // Đóng modal sau khi tìm kiếm
        navigate(`/search?query=${encodeURIComponent(value)}`);
    };

    const showModal = () => {
        setIsModalVisible(true);
    };

    const handleCancel = () => {
        setIsModalVisible(false);
    };

    return (
        <div
            className="search-container"
            style={{
                display: 'flex',
                justifyContent: 'center',
                marginTop: '6px', 
                backgroundColor: '#FFFFFFE5', 
                borderRadius: '40px', 
                padding: '3px', 
                boxShadow: '0 4px 15px rgba(55, 43, 43, 0.25)', 
            }}
        >
            <Input
                placeholder="Tìm Kiếm Phim ..."
                size="large"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onClick={showModal} // Mở modal khi nhấn vào input
                style={{
                    width: '200px',
                    border: 'none', 
                    borderRadius: '30px', 
                    color: '#FFFFFFFF', 
                    fontSize: '14px', 
                    backgroundColor: 'transparent', 
                }}
            />
            <button
                onClick={showModal} // Mở modal khi nhấn vào nút
                style={{
                    border: 'none',
                    backgroundColor: '#FF1E00FF', 
                    color: 'white',
                    padding: '0 20px',
                    borderRadius: '30px', 
                    cursor: 'pointer',
                    fontSize: '16px',
                    marginLeft: '10px', 
                }}
            >
                <FontAwesomeIcon icon={faSearch} /> 
            </button>

            <Modal
                visible={isModalVisible}
                onCancel={handleCancel}
                footer={null}
            >
                <Input
                    className='mt-2 px-6 py-2'
                    placeholder="Nhập từ khóa tìm kiếm..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onPressEnter={() => handleSearch(searchTerm)}
                />
                <button
                    onClick={() => handleSearch(searchTerm)}
                    className='text-white bg-red-600  px-6 py-2 rounded-full hover:bg-red-500 mt-3'
                >
                    Tìm kiếm
                </button>
            </Modal>
        </div>
    );
};

export default Search;