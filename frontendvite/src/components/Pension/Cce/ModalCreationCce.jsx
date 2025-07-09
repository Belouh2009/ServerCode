import React, { useState, useEffect } from "react";
import { Modal, Form, Input, Button, Row, Col, Select, message } from "antd";
import ReactSelect from "react-select";
import { IoMdClose, IoMdAdd } from "react-icons/io";
import Swal from "sweetalert2";
import '../../../index.css';

const ModalCreationCce = ({ open, onClose, formData, setFormData, formFields, setFormFields, onSuccess }) => {

    const [rubriques, setRubriques] = useState([]);

    useEffect(() => {
        fetch("http://192.168.88.53:8088/rubriques/ids")
            .then(response => response.json())
            .then(data => {
                if (Array.isArray(data)) {
                    setRubriques(data);
                }
            })
            .catch(error => console.error("Erreur lors du chargement des rubriques :", error));
    }, []);

    // Générer un nouvel ID de certificat (basé sur le dernier ID récupéré)
    const generateCertificatId = (lastId) => {
        const currentYear = new Date().getFullYear();
        let newIdNumber = 1;

        if (lastId && lastId.includes("-")) {
            const lastNumber = parseInt(lastId.split("-")[0], 10); // Extraire le numéro de l'ID
            newIdNumber = lastNumber + 1; // Incrémenter pour générer un nouvel ID
        }

        return `${String(newIdNumber).padStart(4, "0")}-${currentYear}`; // Exemple : "0002-2025"
    };

    const handleChangeMain = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleChangeField = (index, name, value) => {
        const updatedFields = [...formFields];
        updatedFields[index][name] = value;
        setFormFields(updatedFields);
    };

    const handleAddField = () => {
        setFormFields([...formFields, { rubrique: "", montant: "" }]);
    };

    const handleRemoveField = (index) => {
        const updatedFields = [...formFields];
        updatedFields.splice(index, 1);
        setFormFields(updatedFields);
    };

    const handleSubmit = async () => {
        // Validation des champs obligatoires
        if (!formData.nom || !formData.prenom || !formData.num_pension || !formData.civilite || !formData.caisse || !formData.assignation) {
            message.error("Veuillez remplir tous les champs obligatoires !");
            return;
        }

        // Validation des rubriques et montants
        if (formFields.some(field => !field.rubrique || !field.montant || isNaN(field.montant))) {
            message.error("Veuillez remplir toutes les rubriques et montants correctement !");
            return;
        }

        try {
            // Obtenir le dernier ID du certificat depuis l'API
            const lastIdResponse = await fetch("http://192.168.88.53:8088/certificatsCce/lastId");
            const lastId = await lastIdResponse.text();

            let id_certificat = generateCertificatId(lastId); // Générer un nouvel ID basé sur le dernier ID
            const username = localStorage.getItem("username") || "Utilisateur";
            const date_creation = new Date().toLocaleDateString("fr-CA");

            // Préparer les données à envoyer
            const dataToSend = {
                nom: formData.nom,
                prenom: formData.prenom,
                num_pension: formData.num_pension,
                civilite: formData.civilite,
                caisse: formData.caisse,
                assignation: formData.assignation,
                additionalInfo: formData.additionalInfo,
                dateDece: formData.dateDece,
                dateAnnulation: formData.dateAnnulation,
                certificat: {
                    id_certificat: id_certificat,
                    date_creation: date_creation,
                    ajout_par: username,
                    modif_par: "Aucun",
                },
                sesituer: formFields.map(field => ({
                    rubrique: { id_rubrique: field.rubrique },
                    montant: isNaN(parseFloat(field.montant)) ? 0 : parseFloat(field.montant),
                })),
            };

            // Envoyer les données à l'API
            const response = await fetch("http://192.168.88.53:8088/agentsCce/enregistre", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(dataToSend),
            });

            const responseText = await response.text();

            if (response.status === 201) {
                Swal.fire({
                    icon: "success",
                    title: "Succès !",
                    text: responseText,
                    confirmButtonText: "OK",
                });

                // Réinitialiser les champs après succès
                setFormData({
                    civilite: "",
                    num_pension: "",
                    nom: "",
                    prenom: "",
                    caisse: "",
                    assignation: "",
                    additionalInfo: "",
                    dateDece: "",
                    dateAnnulation: "",
                });
                setFormFields([]);
                onClose();
                onSuccess();
            } else {
                Swal.fire({
                    icon: "error",
                    title: "Erreur !",
                    text: responseText,
                    confirmButtonText: "OK",
                });
            }
        } catch (error) {
            Swal.fire({
                icon: "error",
                title: "Erreur réseau",
                text: "Impossible de contacter le serveur.",
                confirmButtonText: "OK",
            });
        }
    };

    return (
        <Modal
            title={<div style={{ textAlign: "center" }}>Création de Certificat de Cessation d'Emission</div>}
            centered
            open={open}
            onOk={onClose}
            onCancel={onClose}
            width={700}
            className="custom-modal"
            footer={null}
        >
            <Row gutter={16}>
                <Col span={12} className="form-container">
                    <h5>Informations de l'agent</h5>
                    <Form layout="vertical">
                        <Form.Item label="Civilité">
                            <Select
                                name="civilite"
                                value={formData.civilite || ""}
                                onChange={(value) => setFormData((prev) => ({ ...prev, civilite: value }))}
                            >
                                <Option value="Monsieur">Monsieur</Option>
                                <Option value="Madame">Madame</Option>
                            </Select>
                        </Form.Item>

<Form.Item
  label="Numéro de Pension"
  name="num_pension"
  rules={[
    {
      required: true,
      message: "Le numéro de pension est requis",
    },
    {
      len: 6,
      message: "Le numéro de pension doit contenir exactement 6 caractères",
    },
  ]}
>
  <Input
    type="text"
    name="num_pension"
    value={formData.num_pension || ""}
    onChange={handleChangeMain}
    placeholder="Entrer le numéro de pension"
  />
</Form.Item>


                        <Form.Item label="Nom">
                            <Input
                                type="text"
                                name="nom"
                                value={formData.nom || ""}
                                onChange={handleChangeMain}
                                placeholder="Entrer le nom"
                            />
                        </Form.Item>

                        <Form.Item label="Prénom">
                            <Input
                                type="text"
                                name="prenom"
                                value={formData.prenom || ""}
                                onChange={handleChangeMain}
                                placeholder="Entrer le prénom"
                            />
                        </Form.Item>

                        <Form.Item label="Caisse">
                            <Select
                                name="caisse"
                                value={formData.caisse || ""}
                                onChange={(value) => setFormData((prev) => ({ ...prev, caisse: value }))}
                            >
                                <Option value="Caisse de Retraite Civiles et Militaires">Caisse de Retraite Civiles et Militaires</Option>
                                <Option value="Caisse de Prévoyance de la Retraite">Caisse de Prévoyance de la Retraite</Option>
                            </Select>
                        </Form.Item>

                        <Form.Item label="Assignation">
                            <Select
                                name="assignation"
                                value={formData.assignation || ""}
                                onChange={(value) => setFormData((prev) => ({ ...prev, assignation: value }))}
                            >
                                <Option value="TRESORERIE GENERALE D'AMBATONDRAZAKA">TRESORERIE GENERALE D'AMBATONDRAZAKA</Option>
                                <Option value="PERCEPTION PRINCIPALE ANDILAMENA">PERCEPTION PRINCIPALE ANDILAMENA</Option>
                                <Option value="PERCEPTION PRINCIPALE ANOSIBE ANALA">PERCEPTION PRINCIPALE ANOSIBE ANALA</Option>
                                <Option value="PERCEPTION PRINCIPALE NOSY-VARIKA">PERCEPTION PRINCIPALE NOSY-VARIKA</Option>
                                <Option value="BANQUE CENTRALE ANTANANARIVO">BANQUE CENTRALE ANTANANARIVO</Option>
                                <Option value="BANQUE DE DEVELOPPEMENT MAHAJANGA">BANQUE DE DEVELOPPEMENT MAHAJANGA</Option>
                            </Select>
                        </Form.Item>

                        <Row gutter={16}>
                            <Col span={12}>
                                <Form.Item label="Date de Décès">
                                    <Input
                                        type="date"
                                        name="dateDece"
                                        value={formData.dateDece || ""}
                                        onChange={handleChangeMain}
                                        required
                                    />
                                </Form.Item>
                            </Col>

                            <Col span={12}>
                                <Form.Item label="Date d'Annulation">
                                    <Input
                                        type="date"
                                        name="dateAnnulation"
                                        value={formData.dateAnnulation || ""}
                                        onChange={handleChangeMain}
                                        required
                                    />
                                </Form.Item>
                            </Col>
                        </Row>
                    </Form>
                </Col>

                <Col span={11} className="form-container">
                    <h5>Informations Rubrique</h5>

                    <Button type="primary" block onClick={handleAddField}>
                        Ajouter <IoMdAdd />
                    </Button>

                    {formFields.map((field, index) => (
                        <Row key={index} gutter={8} style={{ marginTop: "10px" }}>
                            <Col span={9}>
                                <Form.Item label="Rubrique">
                                    <ReactSelect
                                        name="rubrique"
                                        value={field.rubrique ? { value: field.rubrique, label: field.rubrique } : null}
                                        onChange={(selectedOption) => handleChangeField(index, "rubrique", selectedOption ? selectedOption.value : "")}
                                        options={rubriques.map(rubrique => ({ value: rubrique, label: rubrique }))}
                                    />
                                </Form.Item>
                            </Col>

                            <Col span={11}>
                                <Form.Item label="Montant">
                                    <Input
                                        type="text"
                                        style={{ height: "39px" }}
                                        value={field.montant || ""}
                                        onChange={(e) => handleChangeField(index, "montant", e.target.value)}
                                        placeholder="Entrer un montant"
                                    />
                                </Form.Item>
                            </Col>

                            <Col span={4} style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                                <Button type="primary" style={{ height: "37px" }} danger onClick={() => handleRemoveField(index)} className="btn">
                                    <IoMdClose />
                                </Button>
                            </Col>
                        </Row>
                    ))}
                </Col>
            </Row>

            <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                <Button type="primary" onClick={handleSubmit}>
                    Enregistrer
                </Button>
            </div>
        </Modal>
    );
};

export default ModalCreationCce;
