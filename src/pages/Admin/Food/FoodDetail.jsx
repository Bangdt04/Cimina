import { Modal, Table, Tag } from 'antd';
import { useState, useEffect } from 'react';
import { generateFoodData } from './FoodData';

function FoodDetail({ isDetailOpen, setIsDetailOpen }) {
    const [foodData, setFoodData] = useState({});

    useEffect(() => {
        if (isDetailOpen.isOpen) {
            const allFoods = generateFoodData();
            const selectedFood = allFoods.find(food => food.id === isDetailOpen.id);
            setFoodData(selectedFood || {});
        }
    }, [isDetailOpen]);

    const columns = [
        { title: 'Thuộc tính', dataIndex: 'property', key: 'property' },
        { title: 'Giá trị', dataIndex: 'value', key: 'value' },
    ];

    const data = Object.entries(foodData).map(([key, value], index) => ({
        key: index,
        property: key.charAt(0).toUpperCase() + key.slice(1),
        value: key === 'image' ? <img src={value} alt="Food" className="w-32 h-32 object-cover rounded" /> :
               key === 'status' ? <Tag color={value === 'Còn hàng' ? 'green' : 'red'}>{value}</Tag> :
               key === 'price' ? `${value.toLocaleString()} VND` :
               value,
    }));

    return (
        <Modal
            title={<h2 className="text-2xl font-bold text-gray-800 bg-white">Chi tiết món ăn</h2>}
            open={isDetailOpen.isOpen}
            onCancel={() => setIsDetailOpen({ id: 0, isOpen: false })}
            footer={null}
            width={600}
            className="food-detail-modal bg-white"
        >
            <Table 
                columns={columns} 
                dataSource={data} 
                pagination={false}
                className="food-detail-table"
            />
        </Modal>
    );
}

export default FoodDetail;