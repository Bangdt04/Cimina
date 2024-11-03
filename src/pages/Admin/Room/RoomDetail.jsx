import React from 'react';
import { Modal, Typography, Row, Col } from 'antd';

const { Title, Text } = Typography;

const RoomDetail = ({ visible, onClose, room }) => {
    return (
        <Modal
            title="Chi tiết phòng"
            visible={visible}
            onCancel={onClose}
            footer={null}
            width={800}
        >
            {room ? (
                <div>
                    <Row gutter={16}>
                        <Col span={12}>
                            <Title level={4}>{room.ten_phong_chieu}</Title>
                            <Text strong>Tổng ghế:</Text> <Text>{room.tong_ghe_phong}</Text>
                            <br />
                            <Text strong>Ngày tạo:</Text> <Text>{room.created_at}</Text>
                            <br />
                            <Text strong>Ngày cập nhật:</Text> <Text>{room.updated_at}</Text>
                        </Col>
                    </Row>
                </div>
            ) : (
                <Text>Không có thông tin phòng.</Text>
            )}
        </Modal>
    );
};

export default RoomDetail;