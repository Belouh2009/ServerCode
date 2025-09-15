import React, { useState, useEffect } from "react";
import { Modal, Form, Input, Button, Col } from "antd";
import Swal from "sweetalert2";
import axios from "axios";
import '../../index.css';


const ModalModifRubrique = ({ open, onClose, rubrique, onSuccess }) => {
    const [id_rubrique, setId_rubrique] = useState("");
    const [libelle, setLibelle] = useState("");

    // Lorsque l'agent est ouvert, récupérer ses informations et remplir les champs
    useEffect(() => {
        if (open && rubrique) {
            setId_rubrique(rubrique.idRubrique || "");  // Vérifiez que c'est le bon champ `idRubrique`
            setLibelle(rubrique.libelle || "");  // Assurez-vous que c'est le bon champ `libelle`
        } else {
            setId_rubrique("");  // Réinitialiser si le modal est fermé
            setLibelle("");  // Réinitialiser si le modal est fermé
        }
    }, [open, rubrique]);  // Revenir si `rubrique` change ou si `open` change

    const handleSubmit = async () => {
        const updatedRubriqueData = {
            id_rubrique: id_rubrique,
            libelle: libelle,
        };

        try {
            const response = await axios.put(
                `http://192.168.88.47:8087/rubriques/modifier/${id_rubrique}`,
                updatedRubriqueData,
                { headers: { "Content-Type": "application/json" } }
            );

            console.log("Réponse API :", response); // Log supplémentaire pour vérifier la réponse complète

            const message = response.data?.message || "Modification réussie !";

            if (response.status === 200) {
                Swal.fire("Succès", message, "success");
                onClose();
                if (onSuccess) onSuccess();
            } else {
                Swal.fire("Erreur", "Une erreur est survenue, veuillez réessayer.", "error");
            }
        } catch (error) {
            console.error("Erreur Axios :", error); // Log complet de l’erreur Axios
            const errorMessage = error.response?.data?.message || "Erreur inconnue";
            Swal.fire("Erreur", `Impossible de mettre à jour la rubrique : ${errorMessage}`, "error");
        }

    };

    return (
        <Modal
            title="Modifier Code Rubrique"
            centered
            open={open}
            onCancel={onClose}
            width={500}
            footer={null}
            className="custom-modal"
        >

            <Form.Item label="Code">
                <Input value={id_rubrique} onChange={(e) => setId_rubrique(e.target.value)} />
            </Form.Item>

            <Form.Item label="Libelle">
                <Input value={libelle} onChange={(e) => setLibelle(e.target.value)} />
            </Form.Item>


            <div style={{ textAlign: "center", marginTop: "20px" }}>
                <Button type="primary" onClick={handleSubmit} className="btn-enregistrer">
                    Enregistrer les modifications
                </Button>
            </div>
        </Modal>
    );
};
// Assurez-vous d'utiliser export default
export default ModalModifRubrique;
