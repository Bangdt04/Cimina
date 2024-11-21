import React, { useState } from 'react';
import { Input } from 'antd';
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
        <div
            className="search-container"
            style={{
                display: 'flex',
                justifyContent: 'center',
                marginTop: '7px', 
                backgroundColor: '#5d5d5d', 
                borderRadius: '40px', 
                padding: '2px', 
                boxShadow: '0 4px 15px rgba(55, 43, 43, 0.25)', 
            }}
        >
            <Input
                placeholder="Tìm Kiếm Phim ..."
                size="large"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onPressEnter={() => handleSearch(searchTerm)}
                style={{
                    width: '500px',
                    border: 'none', 
                    borderRadius: '30px', 
                    color: '#ffffff', 
                    fontSize: '14px', 
                    backgroundColor: 'transparent', 
                }}
            />
            <button
                onClick={() => handleSearch(searchTerm)}
                style={{
                    border: 'none',
                    backgroundColor: '#007bff', 
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
        </div>
    );
};

export default Search;