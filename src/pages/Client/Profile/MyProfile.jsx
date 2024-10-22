import { Form, Input } from "antd";

const MyProfile = () => {
    const onFinish = (values) => {
        console.log('Received values:', values);
    };
    return (
        <>
            <Form
                className="grid grid-cols-2 gap-4 w-1/2"
                initialValues={{
                    lastName: 'Dương',
                    firstName: 'Văn Hòa',
                    phone: '0123456789',
                    address: 'Hoan Kiem',
                    gender: 'Nam',
                    email: 'abcdef@gmail.com',
                }}
            >
                <Form.Item
                    className="mb-16"
                    label={<label style={{ color: "white" }}>Họ</label>}
                    layout="vertical"
                    name="lastName"
                    rules={[{ required: true, message: 'Vui lòng nhập họ!' }]}
                >
                    <Input className=" text-black rounded-full" />
                </Form.Item>
                <Form.Item
                    className="mb-16"
                    label={<label style={{ color: "white" }}>Tên</label>}
                    layout="vertical"
                    name="firstName"
                    rules={[{ required: true, message: 'Vui lòng nhập tên!' }]}
                >
                    <Input className=" text-black rounded-full" />
                </Form.Item>
                <Form.Item
                    className="mb-16"
                    label={<label style={{ color: "white" }}>Số điện thoại</label>}
                    layout="vertical"
                    name="phone"
                    rules={[{ required: true, message: 'Vui lòng nhập số điện thoại!' }]}
                >
                    <Input className=" text-black rounded-full" />
                </Form.Item>
                <Form.Item
                    className="mb-16"
                    label={<label style={{ color: "white" }}>Địa chỉ</label>}
                    layout="vertical"
                    name="address"
                >
                    <Input className=" text-black rounded-full" />
                </Form.Item>
                <Form.Item
                    className="mb-16"
                    label={<label style={{ color: "white" }}>Giới tính</label>}
                    layout="vertical"
                    name="gender"
                >
                    <Input className=" text-black rounded-full" />
                </Form.Item>
                <Form.Item
                    className="mb-16"
                    label={<label style={{ color: "white" }}>Email</label>}
                    layout="vertical"
                    name="email"
                >
                    <Input className=" w-full p-2 bg-black text-white rounded-full" disabled />
                </Form.Item>
            </Form>
            <div className="flex justify-end space-x-4 mt-6 w-1/2">
                <button class="bg-gray-800 text-white py-2 px-4 rounded-full">
                    Đổi mật khẩu
                </button>
                <button class="bg-red-600 text-white py-2 px-4 rounded-full" onFinish={onFinish}>
                    Lưu thông tin
                </button>
            </div>
        </>
    );
}

export default MyProfile;