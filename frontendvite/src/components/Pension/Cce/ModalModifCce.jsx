import React, { useState, useEffect } from "react";
import { Modal, Form, Input, Button, Row, Col, Select } from "antd";
import ReactSelect from "react-select";
import { IoMdClose, IoMdAdd } from "react-icons/io";
import Swal from "sweetalert2";
import axios from "axios";
import '../../../index.css';

const { Option } = Select;

const ModalModifCap = ({ open, onClose, agent, onSuccess, rubriques = [] }) => {
    const [nom, setNom] = useState("");
    const [prenom, setPrenom] = useState("");
    const [num_pension, setNum_pension] = useState("");
    const [civilite, setCivilite] = useState("");
    const [caisse, setCaisse] = useState("");
    const [assignation, setAssignation] = useState("");
    const [dateDece, setDateDece] = useState("");
    const [dateAnnulation, setDateAnnulation] = useState("");

    const [formFields, setFormFields] = useState([]);

    const [localRubriques, setLocalRubriques] = useState([]);

    // Lorsque l'agent est ouvert, récupérer ses informations et remplir les champs
    useEffect(() => {
        if (open && agent) {
            console.log("Agent", agent); // Vérifie la structure ici
            setNom(agent.nom || "");
            setPrenom(agent.prenom || "");
            setNum_pension(agent.num_pension || "");
            setCivilite(agent.civilite || "");
            setCaisse(agent.caisse || "");
            setAssignation(agent.assignation || "");
            setDateDece(agent.dateDece || "");
            setDateAnnulation(agent.dateAnnulation || "");

            const newFields = agent.sesituer?.map((s) => ({
                rubrique: s.rubrique?.id_rubrique || "",
                montant: s.montant || "",
            })) || [];

            setFormFields(newFields);
        } else {
            setNom("");
            setPrenom("");
            setNum_pension("");
            setCivilite("");
            setCaisse("");
            setAssignation("");
            setDateDece("");
            setDateAnnulation("");
            setFormFields([]);
        }
    }, [open, agent]);


    // Si les rubriques ne sont pas passées en prop, on effectue un appel API pour les récupérer
    useEffect(() => {
        if (rubriques.length === 0 && localRubriques.length === 0) {  // Ajouter la condition pour vérifier si rubriques sont déjà présentes
            fetch("http://192.168.88.53:8088/rubriques/ids")
                .then((response) => response.json())
                .then((data) => {
                    if (Array.isArray(data)) {
                        setLocalRubriques(data);
                    }
                })
                .catch((error) => {
                    console.error("Erreur lors du chargement des rubriques :", error);
                });
        }
    }, [rubriques.length, localRubriques.length]);  // On vérifie uniquement la longueur, ce qui évite de redemander si déjà présents

    // Utiliser soit les rubriques passées en props, soit celles récupérées localement
    const availableRubriques = rubriques.length > 0 ? rubriques : localRubriques;

    const handleChangeField = (index, name, value) => {
        const updatedFields = [...formFields];
        updatedFields[index][name] = value;
        setFormFields(updatedFields);
    };

    const handleAddField = () => {
        setFormFields([...formFields, { rubrique: "", montant: "" }]);
    };

    const handleRemoveField = (index) => {
        setFormFields(formFields.filter((_, i) => i !== index));
    };

    const handleSubmit = async () => {
        const username = localStorage.getItem("username") || "Utilisateur";

        // Vérification de la présence de l'ID (qui est dans `key`)
        if (!agent || !agent.key) {
            Swal.fire("Erreur", "L'ID de l'agent est manquant. Impossible de mettre à jour.", "error");
            console.log("Agent manquant ou ID manquant", agent);  // Vérifie si l'agent est bien passé
            return;  // Arrête l'exécution si l'ID est manquant
        }

        const updatedAgentData = {
            idAgent: agent.key,  // Utilise 'key' comme l'ID de l'agent
            nom,
            prenom,
            civilite,
            num_pension,
            caisse,
            assignation,
            dateDece,
            dateAnnulation,
            certificat:
            {
                date_creation: agent?.date_creation || new Date().toISOString(),
                modif_par: username,
            },
            sesituer: formFields.map((f) => ({
                rubrique: { id_rubrique: f.rubrique },
                montant: parseFloat(f.montant) || 0,
            })),
        };

        try {
            // Assurez-vous que l'URL est correcte
            const response = await axios.put(
                `http://192.168.88.53:8088/agentsCce/modifier/${agent.key}`,  // Utilise 'key' dans l'URL
                updatedAgentData,
                { headers: { "Content-Type": "application/json" } }
            );

            // Si la réponse est un succès, afficher le message
            if (response.status === 200) {
                Swal.fire("Succès", "Agent mis à jour avec succès !", "success");
                onClose();
                onSuccess();
            } else {
                // Gérer les autres statuts HTTP si nécessaire
                Swal.fire("Erreur", "La mise à jour a échoué.", "error");
            }
        } catch (error) {
            // Gestion des erreurs
            if (error.response) {
                // Si l'erreur vient du serveur, essayer d'accéder à un message d'erreur détaillé
                const errorMessage = error.response.data?.message || "Erreur inconnue";
                Swal.fire("Erreur", `Impossible de mettre à jour l'agent : ${errorMessage}`, "error");
            } else {
                // Si l'erreur vient du côté du client (réseau, timeout, etc.)
                Swal.fire("Erreur", "Erreur de connexion ou problème avec le serveur.", "error");
            }
        }
    };




    return (
        <Modal
            title="Modification de Certificat Administratif de la Pension"
            centered
            open={open}
            onCancel={onClose}
            width={700}
            footer={null}
            className="custom-modal"
        >
            <Row gutter={16}>
                <Col span={12} className="form-container">
                    <h5>Informations de l'agent</h5>
                    <Form layout="vertical">
                        <Form.Item label="Civilité">
                            <Select value={civilite} onChange={(value) => setCivilite(value)}>
                                <Option value="Monsieur">Monsieur</Option>
                                <Option value="Madame">Madame</Option>
                            </Select>
                        </Form.Item>
<Form.Item
  label="Numéro de Pension"
  validateStatus={num_pension.length > 0 && num_pension.length !== 6 ? "error" : ""}
  help={num_pension.length > 0 && num_pension.length !== 6 ? "Le numéro doit contenir exactement 6 caractères" : ""}
>
  <Input
    value={num_pension}
    onChange={(e) => {
      const value = e.target.value;
      if (value.length <= 6) {
        setNum_pension(value);
      }
    }}
    placeholder="Entrer le numéro de pension"
  />
</Form.Item>


                        <Form.Item label="Nom">
                            <Input value={nom} onChange={(e) => setNom(e.target.value)} />
                        </Form.Item>

                        <Form.Item label="Prénom">
                            <Input value={prenom} onChange={(e) => setPrenom(e.target.value)} />
                        </Form.Item>

                        <Form.Item label="Caisse">
                            <Select value={caisse} onChange={(value) => setCaisse(value)}>
                                <Option value="Caisse de Retraite Civiles et Militaires">Caisse de Retraite Civiles et Militaires</Option>
                                <Option value="Caisse de Prévoyance de la Retraite">Caisse de Prévoyance de la Retraite</Option>
                            </Select>
                        </Form.Item>

                        <Form.Item label="Assignation">
                            <Select value={assignation} onChange={(value) => setAssignation(value)}>
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
                                        value={dateDece ? new Date(dateDece).toISOString().split("T")[0] : ""}
                                        onChange={(e) => setDateDece(e.target.value)}
                                        required
                                    />
                                </Form.Item>
                            </Col>

                            <Col span={12}>
                                <Form.Item label="Date d'Annulation">
                                    <Input
                                        type="date"
                                        name="dateAnnulation"
                                        value={dateAnnulation ? new Date(dateAnnulation).toISOString().split("T")[0] : ""}
                                        onChange={(e) => setDateAnnulation(e.target.value)}
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
                                        options={availableRubriques.map((rubrique) => ({
                                            value: rubrique,  // Utilisation de rubriqueCce comme value
                                            label: rubrique  // Affichage de rubriqueCce comme label
                                        }))}
                                        required
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
                                <Button type="primary" style={{ height: "38px" }} danger onClick={() => handleRemoveField(index)} className="btn">
                                    <IoMdClose />
                                </Button>
                            </Col>
                        </Row>
                    ))}
                </Col>
            </Row>

            <div style={{ textAlign: "center", marginTop: "20px" }}>
                <Button type="primary" onClick={handleSubmit} className="btn-enregistrer">
                    Mettre à jour
                </Button>
            </div>
        </Modal>
    );
};

export default ModalModifCap;
