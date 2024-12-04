import React, { useState } from 'react';
import { Input, Modal } from 'antd';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';

const Search: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const navigate = useNavigate();

    const handleSearch = (value: string) => {
        console.log("Searching for:", value);
        setSearchTerm(''); 
        navigate(`/search?query=${encodeURIComponent(searchTerm)}`);
    };

    return (
        <div className="flex justify-center mt-1 bg-transparent bg-opacity-90 rounded-3xl p-1 shadow-lg ">
            <input
                placeholder="Tìm Kiếm Phim ..."
                className="w-48 border-none rounded-2xl text-gray-900 text-sm bg-transparent focus:outline-none pl-5 text-white"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button
                onClick={handleSearch} // Mở modal khi nhấn vào nút
                className="ml-2 bg-red-600 text-white py-1 px-5 rounded-2xl cursor-pointer text-lg"
            >
                <FontAwesomeIcon icon={faSearch} />
            </button>
        </div>
    );
    
    
};

export default Search;