import React, { useState, useEffect } from "react";
import { Modal, Form, Input, Button } from "antd";
import Swal from "sweetalert2";
import axios from "axios";
import '../../index.css';

const ModalModifCorpsGradeIndice = ({ open, onClose, corpsgradeindice, onSuccess }) => {
    const [corps, setCorps] = useState("");
    const [grade, setGrade] = useState("");
    const [indice, setIndice] = useState("");

    useEffect(() => {
        if (open && corpsgradeindice) {
            setCorps(corpsgradeindice.corps || "");
            setGrade(corpsgradeindice.grade || "");
            setIndice(corpsgradeindice.indice || "");
        }
    }, [open, corpsgradeindice]);

    const handleSubmit = async () => {
        const updatedCorpsData = { corps, grade, indice };

        try {
            const response = await axios.put(
                `http://192.168.88.53:8087/CorpsGradeIndice/modifier/${corpsgradeindice.id}`,
                updatedCorpsData,
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
            title="Modifier Code Corps Grade Indice"
            centered
            open={open}
            onCancel={onClose}
            width={500}
            footer={null}
            className="custom-modal"
        >
            <Form layout="vertical" onFinish={handleSubmit}>
                <Form.Item label="Corps" rules={[{ required: true, message: "Veuillez entrer le code." }]}>
                    <Input value={corps} onChange={(e) => setCorps(e.target.value)} />
                </Form.Item>

                <Form.Item label="Grade">
                    <Input value={grade} onChange={(e) => setGrade(e.target.value)} />
                </Form.Item>

                <Form.Item label="Indice">
                    <Input value={indice} onChange={(e) => setIndice(e.target.value)} />
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

export default ModalModifCorpsGradeIndice;
