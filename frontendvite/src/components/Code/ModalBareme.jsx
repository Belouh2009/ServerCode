import React, { useState, useEffect } from "react";
import { Modal, Form, InputNumber, Button, DatePicker } from "antd";
import Swal from "sweetalert2";
import axios from "axios";
import dayjs from "dayjs";

const ModalBareme = ({ open, onClose, bareme, onSuccess }) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (bareme) {
      form.setFieldsValue({
        ...bareme,
        datebareme: bareme.datebareme ? dayjs(bareme.datebareme) : null,
      });
    }
  }, [bareme, form]);

  const handleSubmit = async (values) => {
    const formattedValues = {
      ...values,
      datebareme: values.datebareme
        ? values.datebareme.format("DD/MM/YYYY")
        : null,
    };

    try {
      const response = await axios.put(
        `http://192.168.88.51:8087/bareme/modifier/${bareme.id}`,
        formattedValues,
        { headers: { "Content-Type": "application/json" } }
      );

      if (response.status === 200) {
        Swal.fire(
          "Succès",
          response.data.message || "Modification réussie !",
          "success"
        );
        onClose();
        if (onSuccess) onSuccess();
      } else {
        Swal.fire("Erreur", "Une erreur est survenue.", "error");
      }
    } catch (error) {
      Swal.fire(
        "Erreur",
        error?.response?.data?.message || error.message,
        "error"
      );
    }
  };

  return (
    <Modal
      title="Modifier un barème"
      centered
      open={open}
      onCancel={onClose}
      width={500}
      footer={null}
      className="custom-modal"
    >
      <Form layout="vertical" form={form} onFinish={handleSubmit}>
        <Form.Item label="Date BAREME" name="datebareme">
          <DatePicker format="DD/MM/YYYY" style={{ width: "100%" }} />
        </Form.Item>

        <Form.Item label="Catégorie" name="categorie">
          <InputNumber style={{ width: "100%" }} />
        </Form.Item>

        <Form.Item label="Indice" name="indice">
          <InputNumber style={{ width: "100%" }} />
        </Form.Item>

        <Form.Item label="V500" name="v500">
          <InputNumber style={{ width: "100%" }} />
        </Form.Item>

        <Form.Item label="V501" name="v501">
          <InputNumber style={{ width: "100%" }} />
        </Form.Item>

        <Form.Item label="V502" name="v502">
          <InputNumber style={{ width: "100%" }} />
        </Form.Item>

        <Form.Item label="V503" name="v503">
          <InputNumber style={{ width: "100%" }} />
        </Form.Item>

        <Form.Item label="V506" name="v506">
          <InputNumber style={{ width: "100%" }} />
        </Form.Item>

        <Form.Item label="Solde" name="solde">
          <InputNumber style={{ width: "100%" }} />
        </Form.Item>

        <div style={{ textAlign: "center", marginTop: 20 }}>
          <Button type="primary" htmlType="submit">
            Enregistrer les modifications
          </Button>
        </div>
      </Form>
    </Modal>
  );
};

export default ModalBareme;
