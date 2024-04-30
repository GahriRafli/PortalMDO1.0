import React, { useState } from "react";
import { Modal, Form, Input, Button } from "antd";

const UpdateServiceModal = ({
  visible,
  onCancel,
  serviceId,
  serviceName,
  onUpdate,
}) => {
  const [newServiceId, setNewServiceId] = useState(serviceId);

  const handleUpdate = () => {
    // Lakukan validasi atau operasi lainnya sebelum memperbarui Service ID
    onUpdate(newServiceId);
    onCancel(); // Tutup modal setelah memperbarui
  };

  return (
    <Modal
      title="Edit Service ID and Name"
      visible={visible}
      onCancel={onCancel}
      footer={[
        <Button key="cancel" onClick={onCancel}>
          Cancel
        </Button>,
        <Button key="update" type="primary" onClick={handleUpdate}>
          Update
        </Button>,
      ]}
    >
      <Form>
        <Form.Item label="Service ID">
          <Input
            value={newServiceId}
            onChange={(e) => setNewServiceId(e.target.value)}
          />
        </Form.Item>
        <Form.Item label="Service Name">
          <Input value={serviceName} disabled />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default UpdateServiceModal;
