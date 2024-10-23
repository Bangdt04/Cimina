import { Tag } from 'antd';

export const baseColumns = [
    {
        title: 'Hình ảnh',
        dataIndex: 'image',
        key: 'image',
        render: (image) => <img src={image} alt="Food" className="w-16 h-16 object-cover rounded" />,
    },
    {
        title: 'Tên món',
        dataIndex: 'name',
        key: 'name',
        sorter: (a, b) => a.name.localeCompare(b.name),
    },
    {
        title: 'Danh mục',
        dataIndex: 'category',
        key: 'category',
    },
    {
        title: 'Giá',
        dataIndex: 'price',
        key: 'price',
        render: (price) => `${price.toLocaleString()} VND`,
    },
    {
        title: 'Trạng thái',
        dataIndex: 'status',
        key: 'status',
        render: (status) => (
            <Tag color={status === 'Còn hàng' ? 'green' : 'red'}>
                {status}
            </Tag>
        ),
    },
];

export function generateFoodData() {
    return [
        {
            id: '1',
            image: "https://picsum.photos/seed/pho/200/200",
            name: 'Phở bò',
            category: 'Món chính',
            price: 50000,
            status: 'Còn hàng',
            description: 'Phở bò truyền thống Hà Nội',
        },
        {
            id: '2',
            image: "https://picsum.photos/seed/banhmi/200/200",
            name: 'Bánh mì thịt',
            category: 'Món phụ',
            price: 25000,
            status: 'Còn hàng',
            description: 'Bánh mì thịt nguội kèm rau và sốt',
        },
        {
            id: '3',
            image: "https://picsum.photos/seed/comtam/200/200",
            name: 'Cơm tấm',
            category: 'Món chính',
            price: 40000,
            status: 'Còn hàng',
            description: 'Cơm tấm sườn bì chả trứng',
        },
        {
            id: '4',
            image: "https://picsum.photos/seed/buncha/200/200",
            name: 'Bún chả',
            category: 'Món chính',
            price: 45000,
            status: 'Hết hàng',
            description: 'Bún chả Hà Nội với nước chấm đặc biệt',
        },
        {
            id: '5',
            image: "https://picsum.photos/seed/goicuon/200/200",
            name: 'Gỏi cuốn',
            category: 'Món phụ',
            price: 30000,
            status: 'Còn hàng',
            description: 'Gỏi cuốn tôm thịt',
        },
        {
            id: '6',
            image: "https://picsum.photos/seed/banhxeo/200/200",
            name: 'Bánh xèo',
            category: 'Món chính',
            price: 55000,
            status: 'Hết hàng',
            description: 'Bánh xèo miền Trung',
        },
        {
            id: '7',
            image: "https://picsum.photos/seed/cakhoto/200/200",
            name: 'Cá kho tộ',
            category: 'Món chính',
            price: 60000,
            status: 'Còn hàng',
            description: 'Cá kho tộ đậm đà hương vị',
        },
        {
            id: '8',
            image: "https://picsum.photos/seed/chebamau/200/200",
            name: 'Chè ba màu',
            category: 'Tráng miệng',
            price: 20000,
            status: 'Hết hàng',
            description: 'Chè ba màu mát lạnh',
        },
        {
            id: '9',
            image: "https://picsum.photos/seed/nemran/200/200",
            name: 'Nem rán',
            category: 'Món phụ',
            price: 35000,
            status: 'Còn hàng',
            description: 'Nem rán giòn rụm',
        },
        {
            id: '10',
            image: "https://picsum.photos/seed/trasua/200/200",
            name: 'Trà sữa trân châu',
            category: 'Đồ uống',
            price: 28000,
            status: 'Hết hàng',
            description: 'Trà sữa trân châu đường đen',
        },
    ];
}