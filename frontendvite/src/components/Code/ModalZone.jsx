import React, { useState, useEffect } from "react";
import { Modal, Form, Input, Button } from "antd";
import Swal from "sweetalert2";
import axios from "axios";
import '../../index.css';

const ModalModifZone = ({ open, onClose, zone, onSuccess }) => {
    const [district, setDistrict] = useState("");
    const [zone0, setZone0] = useState("");
    const [zone1, setZone1] = useState("");
    const [codeZone1, setCodeZone1] = useState("");
    const [zone2, setZone2] = useState("");
    const [codeZone2, setCodeZone2] = useState("");
    const [zone3, setZone3] = useState("");
    const [codeZone3, setCodeZone3] = useState("");

    useEffect(() => {
        if (open && zone) {
            setDistrict(zone.district || "");
            setZone0(zone.zone0 || "");
            setZone1(zone.zone1 || "");
            setCodeZone1(zone.codeZone1 || "");
            setZone2(zone.zone2 || "");
            setCodeZone2(zone.codeZone2 || "");
            setZone3(zone.zone3 || "");
            setCodeZone3(zone.codeZone3 || "");
        }
    }, [open, zone]);

    const handleSubmit = async () => {
        const updatedZoneData = { district, zone0, zone1, codeZone1, zone2, codeZone2, zone3, codeZone3 };

        try {
            const response = await axios.put(
                `http://192.168.88.28:8087/zones/modifier/${zone.id_zone}`,  // Utiliser zone.id_zone ici
                updatedZoneData,
                { headers: { "Content-Type": "application/json" } }
            );

            const message = response.data?.message || "Modification réussie !";

            if (response.status === 200) {
                Swal.fire("Succès", message, "success");
                onClose();
                if (onSuccess) onSuccess();
            } else {
                Swal.fire("Erreur", "Une erreur est survenue, veuillez réessayer.", "error");
            }
        } catch (error) {
            const errorMessage = error?.response?.data?.message || error.message || "Erreur inconnue";
            Swal.fire("Erreur", `Impossible de mettre à jour la rubrique : ${errorMessage}`, "error");
        }
    };

    return (
        <Modal
            title="Modifier Code Zone"
            centered
            open={open}
            onCancel={onClose}
            width={500}
            footer={null}
            className="custom-modal"
        >
            <Form layout="vertical" onFinish={handleSubmit}>
                <Form.Item label="District" rules={[{ required: true, message: "Veuillez entrer le district." }]}>
                    <Input value={district} onChange={(e) => setDistrict(e.target.value)} />
                </Form.Item>

                <Form.Item label="Zone 0">
                    <Input value={zone0} onChange={(e) => setZone0(e.target.value)} />
                </Form.Item>

                <Form.Item label="Zone 1">
                    <Input value={zone1} onChange={(e) => setZone1(e.target.value)} />
                </Form.Item>

                <Form.Item label="Code Zone 1">
                    <Input value={codeZone1} onChange={(e) => setCodeZone1(e.target.value)} />
                </Form.Item>

                <Form.Item label="Zone 2">
                    <Input value={zone2} onChange={(e) => setZone2(e.target.value)} />
                </Form.Item>

                <Form.Item label="Code Zone 2">
                    <Input value={codeZone2} onChange={(e) => setCodeZone2(e.target.value)} />
                </Form.Item>

                <Form.Item label="Zone 3">
                    <Input value={zone3} onChange={(e) => setZone3(e.target.value)} />
                </Form.Item>

                <Form.Item label="Code Zone 3">
                    <Input value={codeZone3} onChange={(e) => setCodeZone3(e.target.value)} />
                </Form.Item>

                <div style={{ textAlign: "center", marginTop: "20px" }}>
                    <Button type="primary" htmlType="submit" className="btn-enregistrer">
                        Enregistrer les modifications
                    </Button>
                </div>
            </Form>
        </Modal>
    );
};

export default ModalModifZone;
