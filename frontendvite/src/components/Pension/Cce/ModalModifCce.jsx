import React, { useState, useEffect } from "react";
import { Modal, Form, Input, Button, Row, Col, Select, Checkbox } from "antd";
import ReactSelect from "react-select";
import { IoMdClose, IoMdAdd } from "react-icons/io";
import Swal from "sweetalert2";
import axios from "axios";
import "../../../index.css";

const { Option } = Select;

const ModalModifCap = ({ open, onClose, agent, onSuccess, rubriques = [] }) => {
  const [nom, setNom] = useState("");
  const [prenom, setPrenom] = useState("");
  const [num_pension, setNum_pension] = useState("");
  const [civilite, setCivilite] = useState("");
  const [caisse, setCaisse] = useState("");
  const [assignation, setAssignation] = useState("");
  const [additionalInfo, setAdditionalInfo] = useState("");
  const [dateDece, setDateDece] = useState("");
  const [dateAnnulation, setDateAnnulation] = useState("");

  const [formFields, setFormFields] = useState([]);

  const [localRubriques, setLocalRubriques] = useState([]);
  const [assignationType, setAssignationType] = useState(null);
  const [options, setOptions] = useState([]);

  // Fonction pour valider que le texte ne contient que des lettres
  const validateTextOnly = (value) => {
    const regex = /^[A-Za-zÀ-ÿ\s'-]+$/;
    return regex.test(value);
  };

  // Fonction pour valider le format monétaire (accepte virgules et points)
  const validateCurrency = (value) => {
    if (value === "") return true;
    const regex = /^\d+([,.]\d{0,2})?$/;
    return regex.test(value);
  };

  // Fonction pour convertir le format français (virgule) en format international (point)
  const formatCurrencyForBackend = (value) => {
    if (!value) return "0";
    return value
      .replace(/[^\d,.]/g, "") // Garder seulement chiffres, virgules et points
      .replace(/,/g, ".") // Remplacer les virgules par des points
      .replace(/(\..*)\./g, "$1"); // Empêcher plusieurs points décimaux
  };

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
      setAdditionalInfo(agent.additionalInfo || "");
      setDateDece(agent.dateDece || "");
      setDateAnnulation(agent.dateAnnulation || "");

      // Détecter le type assignation
      if (agent.assignation === "comptable") {
        setAssignationType("comptable");
        fetchComptables();
      } else if (agent.assignation === "banque") {
        setAssignationType("banque");
        fetchBanques();
      }

      const newFields =
        agent.sesituer?.map((s) => ({
          rubrique: s.rubrique?.id_rubrique || "",
          montant: s.montant?.toString() || "", // Convertir en string pour l'affichage
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
      setAssignationType(null);
      setOptions([]);
    }
  }, [open, agent]);

  // Si les rubriques ne sont pas passées en prop, on effectue un appel API pour les récupérer
  useEffect(() => {
    if (rubriques.length === 0 && localRubriques.length === 0) {
      // Ajouter la condition pour vérifier si rubriques sont déjà présentes
      fetch("http://192.168.88.47:8087/rubriques/ids")
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
  }, [rubriques.length, localRubriques.length]); // On vérifie uniquement la longueur, ce qui évite de redemander si déjà présents

  const fetchComptables = async () => {
    try {
      const response = await fetch("http://192.168.88.47:8087/comptables/liste");
      const data = await response.json();
      setOptions(data);
      return data;
    } catch (err) {
      console.error("Erreur lors du chargement des comptables :", err);
      return [];
    }
  };

  const fetchBanques = async () => {
    try {
      const response = await fetch("http://192.168.88.47:8087/comptables/banques");
      const data = await response.json();
      setOptions(data);
      return data;
    } catch (err) {
      console.error("Erreur lors du chargement des banques :", err);
      return [];
    }
  };

  // Utiliser soit les rubriques passées en props, soit celles récupérées localement
  const availableRubriques = rubriques.length > 0 ? rubriques : localRubriques;

  const handleChangeField = (index, name, value) => {
    const updatedFields = [...formFields];

    if (name === "montant") {
      // Valider le format avant de mettre à jour
      if (value === "" || validateCurrency(value)) {
        updatedFields[index][name] = value;
        setFormFields(updatedFields);
      }
    } else {
      updatedFields[index][name] = value;
      setFormFields(updatedFields);
    }
  };

  const handleAddField = () => {
    const updatedFields = [...formFields, { rubrique: "", montant: "" }];

    // Tri en ordre croissant par rubrique numérique
    updatedFields.sort((a, b) => {
      const rubA = parseFloat(a.rubrique) || 0;
      const rubB = parseFloat(b.rubrique) || 0;
      return rubA - rubB; // croissant
    });

    setFormFields(updatedFields);
  };

  const handleRemoveField = (index) => {
    if (formFields.length <= 1) {
      Swal.fire({
        icon: "warning",
        title: "Action impossible",
        text: "On doit enregistrer au moins un rubrique",
        timer: 2000, // disparaît automatiquement après 2 secondes
        showConfirmButton: false,
        toast: true, // affichage type toast en haut à droite
        position: "top-end",
      });
      return;
    }
    setFormFields(formFields.filter((_, i) => i !== index));
  };

  // Validation des champs obligatoires
  const requiredFields = {
    nom,
    prenom,
    num_pension,
    civilite,
    caisse,
    assignation,
    dateDece,
    dateAnnulation,
  };

  const handleSubmit = async () => {
    // Vérification des champs obligatoires
    if (Object.values(requiredFields).some((v) => !v)) {
      Swal.fire({
        icon: "warning",
        title: "Champs manquants",
        text: "Veuillez remplir tous les champs obligatoires !",
        timer: 2000,
        showConfirmButton: false,
        toast: true,
        position: "top-end",
      });
      return;
    }

    // Validation des noms et prénoms
    if (!validateTextOnly(nom)) {
      Swal.fire({
        icon: "warning",
        title: "Nom invalide",
        text: "Le nom doit contenir uniquement des lettres",
        timer: 2000,
        showConfirmButton: false,
        toast: true,
        position: "top-end",
      });
      return;
    }

    if (!validateTextOnly(prenom)) {
      Swal.fire({
        icon: "warning",
        title: "Prénom invalide",
        text: "Le prénom doit contenir uniquement des lettres",
        timer: 2000,
        showConfirmButton: false,
        toast: true,
        position: "top-end",
      });
      return;
    }

    // Validation des montants
    for (let i = 0; i < formFields.length; i++) {
      const field = formFields[i];
      const formattedValue = formatCurrencyForBackend(field.montant || "");
      if (
        !validateCurrency(field.montant || "") ||
        isNaN(parseFloat(formattedValue))
      ) {
        Swal.fire({
          icon: "warning",
          title: "Montant invalide",
          text: `Le montant à la ligne ${
            i + 1
          } est invalide. Format attendu: 123,45 ou 123.45`,
          timer: 2000,
          showConfirmButton: false,
          toast: true,
          position: "top-end",
        });
        return;
      }
    }

    const username = localStorage.getItem("username") || "Utilisateur";

    // Vérification de la présence de l'ID (qui est dans `key`)
    if (!agent || !agent.key) {
      Swal.fire(
        "Erreur",
        "L'ID de l'agent est manquant. Impossible de mettre à jour.",
        "error"
      );
      console.log("Agent manquant ou ID manquant", agent);
      return;
    }

    const updatedAgentData = {
      idAgent: agent.key,
      nom,
      prenom,
      civilite,
      num_pension,
      caisse,
      assignation,
      additionalInfo,
      dateDece,
      dateAnnulation,
      certificat: {
        date_creation: agent?.date_creation || new Date().toISOString(),
        modif_par: username,
      },
      sesituer: formFields.map((f) => ({
        rubrique: { id_rubrique: f.rubrique },
        montant: parseFloat(formatCurrencyForBackend(f.montant)) || 0,
      })),
    };

    try {
      const response = await axios.put(
        `http://192.168.88.47:8087/agentsCce/modifier/${agent.key}`,
        updatedAgentData,
        { headers: { "Content-Type": "application/json" } }
      );

      if (response.status === 200) {
        Swal.fire("Succès", "Cértificat mis à jour avec succès !", "success");
        onClose();
        onSuccess();
      } else {
        Swal.fire("Erreur", "La mise à jour a échoué.", "error");
      }
    } catch (error) {
      if (error.response) {
        const errorMessage = error.response.data?.message || "Erreur inconnue";
        Swal.fire(
          "Erreur",
          `Impossible de mettre à jour l'agent : ${errorMessage}`,
          "error"
        );
      } else {
        Swal.fire(
          "Erreur",
          "Erreur de connexion ou problème avec le serveur.",
          "error"
        );
      }
    }
  };

  return (
    <Modal
      title={
        <div
          style={{
            textAlign: "center",
            fontSize: 18,
            color: "#1268da",
            fontWeight: 600,
          }}
        >
          Modification de la Certificat de Cessation d'Emission
        </div>
      }
      centered
      open={open}
      onCancel={onClose}
      width={750}
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
              validateStatus={
                num_pension.length > 0 && num_pension.length !== 6
                  ? "error"
                  : ""
              }
              help={
                num_pension.length > 0 && num_pension.length !== 6
                  ? "Le numéro doit contenir exactement 6 caractères"
                  : ""
              }
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

            <Form.Item
              label="Nom"
              validateStatus={
                validateTextOnly(nom) || nom === "" ? "" : "error"
              }
              help={
                validateTextOnly(nom) || nom === ""
                  ? ""
                  : "Le nom doit contenir uniquement des lettres"
              }
            >
              <Input
                value={nom}
                onChange={(e) => {
                  const value = e.target.value;
                  if (value === "" || validateTextOnly(value)) {
                    setNom(value);
                  }
                }}
                placeholder="Entrer le nom"
              />
            </Form.Item>

            <Form.Item
              label="Prénom"
              validateStatus={
                validateTextOnly(prenom) || prenom === "" ? "" : "error"
              }
              help={
                validateTextOnly(prenom) || prenom === ""
                  ? ""
                  : "Le prénom doit contenir uniquement des lettres"
              }
            >
              <Input
                value={prenom}
                onChange={(e) => {
                  const value = e.target.value;
                  if (value === "" || validateTextOnly(value)) {
                    setPrenom(value);
                  }
                }}
                placeholder="Entrer le prénom"
              />
            </Form.Item>

            <Form.Item label="Caisse">
              <Select value={caisse} onChange={(value) => setCaisse(value)}>
                <Option value="Caisse de Retraite Civiles et Militaires">
                  Caisse de Retraite Civiles et Militaires
                </Option>
                <Option value="Caisse de Prévoyance de la Retraite">
                  Caisse de Prévoyance de la Retraite
                </Option>
              </Select>
            </Form.Item>

            <Form.Item label="Assignation">
              <Checkbox
                checked={assignationType === "comptable"}
                onChange={(e) => {
                  if (e.target.checked) {
                    setAssignationType("comptable");
                    fetchComptables();
                    setAssignation("comptable");
                  } else if (assignationType === "comptable") {
                    setAssignationType(null);
                    setOptions([]);
                    setAssignation("");
                    setAdditionalInfo("");
                  }
                }}
              >
                Comptable Payeur
              </Checkbox>

              <Checkbox
                checked={assignationType === "banque"}
                onChange={(e) => {
                  if (e.target.checked) {
                    setAssignationType("banque");
                    fetchBanques();
                    setAssignation("banque");
                  } else if (assignationType === "banque") {
                    setAssignationType(null);
                    setOptions([]);
                    setAssignation("");
                    setAdditionalInfo("");
                  }
                }}
              >
                Banques
              </Checkbox>

              <Select
                showSearch
                name="additional_info"
                value={
                  options.includes(additionalInfo) ? additionalInfo : undefined
                }
                onChange={(value) => setAdditionalInfo(value)}
                style={{ marginTop: 10 }}
                placeholder="Sélectionner une option"
              >
                {options.map((item) => (
                  <Select.Option key={item} value={item}>
                    {item}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>

            <Row gutter={16}>
              <Col span={12}>
                <Form.Item label="Date de Décès">
                  <Input
                    type="date"
                    name="dateDece"
                    value={
                      dateDece
                        ? new Date(dateDece).toISOString().split("T")[0]
                        : ""
                    }
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
                    value={
                      dateAnnulation
                        ? new Date(dateAnnulation).toISOString().split("T")[0]
                        : ""
                    }
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

          <Button
            type="primary"
            block
            onClick={handleAddField}
            style={{
              backgroundColor: "#1268da",
              borderColor: "#1268da",
              marginBottom: 12,
            }}
          >
            Ajouter <IoMdAdd />
          </Button>

          {formFields.map((field, index) => (
            <Row key={index} gutter={8} style={{ marginTop: "10px" }}>
              <Col span={9}>
                <Form.Item label="Rubrique">
                  <ReactSelect
                    name="rubrique"
                    value={
                      field.rubrique
                        ? { value: field.rubrique, label: field.rubrique }
                        : null
                    }
                    onChange={(selectedOption) =>
                      handleChangeField(
                        index,
                        "rubrique",
                        selectedOption ? selectedOption.value : ""
                      )
                    }
                    options={availableRubriques
                      .filter(
                        (rubrique) =>
                          !formFields.some(
                            (f, i) => i !== index && f.rubrique === rubrique
                          )
                      )
                      .map((rubrique) => ({
                        value: rubrique,
                        label: rubrique,
                      }))}
                    required
                  />
                </Form.Item>
              </Col>

              <Col span={11}>
                <Form.Item
                  label="Montant"
                  validateStatus={
                    validateCurrency(field.montant) || field.montant === ""
                      ? ""
                      : "error"
                  }
                  help={
                    validateCurrency(field.montant) || field.montant === ""
                      ? ""
                      : "Format monétaire invalide (ex: 123,45 ou 123.45)"
                  }
                >
                  <Input
                    type="text"
                    style={{ height: "39px" }}
                    value={field.montant || ""}
                    onChange={(e) =>
                      handleChangeField(index, "montant", e.target.value)
                    }
                    placeholder="Entrer un montant"
                  />
                </Form.Item>
              </Col>

              <Col
                span={4}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Button
                  type="primary"
                  style={{
                    marginTop: "10px",
                    height: "38px",
                    backgroundColor: "#ff4d4f",
                    borderColor: "#ff4d4f",
                  }}
                  danger
                  onClick={() => handleRemoveField(index)}
                  className="btn"
                >
                  <IoMdClose />
                </Button>
              </Col>
            </Row>
          ))}
        </Col>
      </Row>

      <div style={{ textAlign: "center", marginTop: "20px" }}>
        <Button
          type="primary"
          onClick={handleSubmit}
          style={{
            backgroundColor: "#1268da",
            borderRadius: "8px",
            padding: "6px 24px",
            fontWeight: "bold",
            marginTop: 16,
          }}
        >
          Enregistrer les modifications
        </Button>
      </div>
    </Modal>
  );
};

export default ModalModifCap;
