import React, { useState, useEffect } from "react";
import { Modal, Form, Input, Button } from "antd";
import Swal from "sweetalert2";
import axios from "axios";
import '../../index.css';

const ModalModifCorps = ({ open, onClose, corps, onSuccess }) => {
    const [id_corps, setId_corps] = useState("");
    const [libelleCorps, setLibelleCorps] = useState("");
    const [categorie, setCategorie] = useState("");

    useEffect(() => {
        if (open && corps) {
            setId_corps(corps.idCorps || "");  
            setLibelleCorps(corps.libelleCorps || "");  
            setCategorie(corps.categorie || "");
        }
    }, [open, corps]);

    const handleSubmit = async () => {
        const updatedCorpsData = { id_corps, libelleCorps, categorie };

        try {
            const response = await axios.put(
                `http://192.168.88.28:8087/corps/modifier/${id_corps}`,
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
            title="Modifier Code Corps"
            centered
            open={open}
            onCancel={onClose}
            width={500}
            footer={null}
            className="custom-modal"
        >
            <Form layout="vertical" onFinish={handleSubmit}>
                <Form.Item label="Code" rules={[{ required: true, message: "Veuillez entrer le code." }]}>
                    <Input value={id_corps} onChange={(e) => setId_corps(e.target.value)} />
                </Form.Item>

                <Form.Item label="Libelle">
                    <Input value={libelleCorps} onChange={(e) => setLibelleCorps(e.target.value)} />
                </Form.Item>

                <Form.Item label="Categorie">
                    <Input value={categorie} onChange={(e) => setCategorie(e.target.value)} />
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

export default ModalModifCorps;
