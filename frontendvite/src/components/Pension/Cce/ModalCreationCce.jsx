import React, { useState, useEffect } from "react";
import { Modal, Form, Input, Button, Row, Col, Select, Checkbox } from "antd";
import ReactSelect from "react-select";
import { IoMdClose, IoMdAdd } from "react-icons/io";
import Swal from "sweetalert2";
import "../../../index.css";

const { Option } = Select;

const ModalCreationCce = ({
  open,
  onClose,
  formData,
  setFormData,
  formFields,
  setFormFields,
  onSuccess,
}) => {
  const [rubriques, setRubriques] = useState([]);
  const [assignationType, setAssignationType] = useState(null);
  const [options, setOptions] = useState([]);

  useEffect(() => {
    fetch("http://192.168.88.47:8087/rubriques/ids")
      .then((response) => response.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setRubriques(data);
        }
      })
      .catch((error) =>
        console.error("Erreur lors du chargement des rubriques :", error)
      );
  }, []);

  const fetchComptables = async () => {
    try {
      const response = await fetch("http://192.168.88.47:8087/comptables/liste");
      const data = await response.json();
      setOptions(data);
    } catch (err) {
      console.error("Erreur lors du chargement des comptables :", err);
    }
  };

  const fetchBanques = async () => {
    try {
      const response = await fetch("http://192.168.88.47:8087/comptables/banques");
      const data = await response.json();
      setOptions(data);
    } catch (err) {
      console.error("Erreur lors du chargement des banques :", err);
    }
  };

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
      .replace(/[^\d,.]/g, "")
      .replace(/,/g, ".")
      .replace(/(\..*)\./g, "$1");
  };

  // Générer un nouvel ID de certificat (basé sur le dernier ID récupéré)
  const generateCertificatId = (lastId) => {
    const currentYear = new Date().getFullYear();
    let newIdNumber = 1;

    if (lastId && lastId.includes("-")) {
      const lastNumber = parseInt(lastId.split("-")[0], 10);
      newIdNumber = lastNumber + 1;
    }

    return `${String(newIdNumber).padStart(4, "0")}-${currentYear}`;
  };

  // Gestion du changement des champs principaux du formulaire AVEC VALIDATION
  const handleChangeMain = (e) => {
    const { name, value } = e.target;

    // Validation spécifique pour le nom et prénom
    if (name === "nom" || name === "prenom") {
      if (value === "" || validateTextOnly(value)) {
        setFormData((prev) => ({ ...prev, [name]: value }));
      }
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  // Gestion du changement des champs dynamiques (rubriques et montants)
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

    updatedFields.sort((a, b) => {
      const rubA = parseFloat(a.rubrique) || 0;
      const rubB = parseFloat(b.rubrique) || 0;
      return rubA - rubB;
    });

    setFormFields(updatedFields);
  };

  const handleRemoveField = (index) => {
    const updatedFields = [...formFields];
    updatedFields.splice(index, 1);
    setFormFields(updatedFields);
  };

  const validateRubriques = () => {
    if (!formFields || formFields.length === 0) {
      Swal.fire({
        icon: "warning",
        title: "Action impossible",
        text: "Veuillez ajouter au moins une rubrique.",
        timer: 2000,
        showConfirmButton: false,
        toast: true,
        position: "top-end",
      });
      return false;
    }

    for (let i = 0; i < formFields.length; i++) {
      const field = formFields[i];

      if (!field.rubrique || field.rubrique.trim() === "") {
        Swal.fire({
          icon: "warning",
          title: "Rubrique manquante",
          text: `La rubrique à la ligne ${i + 1} est vide.`,
          timer: 2000,
          showConfirmButton: false,
          toast: true,
          position: "top-end",
        });
        return false;
      }

      // Convertir pour la validation (accepter virgule et point)
      const montantValue = formatCurrencyForBackend(field.montant);
      if (
        !field.montant ||
        isNaN(parseFloat(montantValue)) ||
        parseFloat(montantValue) <= 0
      ) {
        Swal.fire({
          icon: "warning",
          title: "Montant invalide",
          text: `Le montant à la ligne ${i + 1} est invalide.`,
          timer: 2000,
          showConfirmButton: false,
          toast: true,
          position: "top-end",
        });
        return false;
      }
    }

    return true;
  };

  const handleSubmit = async () => {
    // Déterminer l'assignation (depuis assignationType ou formData)
    const assignationValue = assignationType || formData.assignation;

    if (!validateRubriques()) return;

    // Validation des champs obligatoires
    if (
      !formData.nom ||
      !formData.prenom ||
      !formData.num_pension ||
      !formData.civilite ||
      !formData.caisse ||
      !assignationValue ||
      !formData.additional_info ||
      !formData.dateDece ||
      !formData.dateAnnulation
    ) {
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

    try {
      // Obtenir le dernier ID du certificat depuis l'API
      const lastIdResponse = await fetch(
        "http://192.168.88.47:8087/certificatsCce/lastId"
      );
      const lastId = await lastIdResponse.text();

      let id_certificat = generateCertificatId(lastId);
      const username = localStorage.getItem("username") || "Utilisateur";
      const date_creation = new Date().toLocaleDateString("fr-CA");

      // Préparer les données à envoyer
      const dataToSend = {
        nom: formData.nom,
        prenom: formData.prenom,
        num_pension: formData.num_pension,
        civilite: formData.civilite,
        caisse: formData.caisse,
        assignation: assignationValue,
        additionalInfo: formData.additional_info,
        dateDece: formData.dateDece,
        dateAnnulation: formData.dateAnnulation,
        certificat: {
          id_certificat: id_certificat,
          date_creation: date_creation,
          ajout_par: username,
          modif_par: "Aucun",
        },
        sesituer: formFields.map((field) => ({
          rubrique: { id_rubrique: field.rubrique },
          montant: parseFloat(formatCurrencyForBackend(field.montant)) || 0,
        })),
      };

      // Envoyer les données à l'API
      const response = await fetch(
        "http://192.168.88.47:8087/agentsCce/enregistre",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(dataToSend),
        }
      );

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
          additional_info: "",
          dateDece: "",
          dateAnnulation: "",
        });
        setFormFields([]);
        setAssignationType(null);
        setOptions([]);
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
      title={
        <div
          style={{
            textAlign: "center",
            fontSize: 18,
            color: "#1268da",
            fontWeight: 600,
          }}
        >
          Création de la Certificat de Cessation d'Emission
        </div>
      }
      centered
      open={open}
      onOk={onClose}
      onCancel={onClose}
      width={750}
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
                onChange={(value) =>
                  setFormData((prev) => ({ ...prev, civilite: value }))
                }
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
                  message:
                    "Le numéro de pension doit contenir exactement 6 caractères",
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

            <Form.Item
              label="Nom"
              rules={[
                {
                  validator: (_, value) =>
                    !value || validateTextOnly(value)
                      ? Promise.resolve()
                      : Promise.reject(
                          new Error("Le nom ne doit contenir que des lettres")
                        ),
                },
              ]}
            >
              <Input
                type="text"
                name="nom"
                value={formData.nom || ""}
                onChange={handleChangeMain}
                placeholder="Entrer le nom"
              />
            </Form.Item>

            <Form.Item
              label="Prénom"
              rules={[
                {
                  validator: (_, value) =>
                    !value || validateTextOnly(value)
                      ? Promise.resolve()
                      : Promise.reject(
                          new Error(
                            "Le prénom ne doit contenir que des lettres"
                          )
                        ),
                },
              ]}
            >
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
                onChange={(value) =>
                  setFormData((prev) => ({ ...prev, caisse: value }))
                }
              >
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
                    setFormData((prev) => ({
                      ...prev,
                      assignation: "comptable",
                      additional_info: "", // Réinitialiser la sélection précédente
                    }));
                  } else if (assignationType === "comptable") {
                    setAssignationType(null);
                    setOptions([]);
                    setFormData((prev) => ({
                      ...prev,
                      assignation: "",
                      additional_info: "",
                    }));
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
                    setFormData((prev) => ({
                      ...prev,
                      assignation: "banque",
                      additional_info: "", // Réinitialiser la sélection précédente
                    }));
                  } else if (assignationType === "banque") {
                    setAssignationType(null);
                    setOptions([]);
                    setFormData((prev) => ({
                      ...prev,
                      assignation: "",
                      additional_info: "",
                    }));
                  }
                }}
              >
                Banques
              </Checkbox>

              <Select
                showSearch
                optionFilterProp="children"
                name="additional_info"
                value={formData.additional_info || undefined}
                onChange={(value) =>
                  setFormData((prev) => ({ ...prev, additional_info: value }))
                }
                style={{ marginTop: 10, width: "100%" }}
                placeholder="Sélectionner une option"
                disabled={!assignationType} // Désactiver si aucun type n'est sélectionné
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
                <Form.Item label="Date de Décès" required>
                  <Input
                    type="date"
                    name="dateDece"
                    value={formData.dateDece || ""}
                    onChange={handleChangeMain}
                  />
                </Form.Item>
              </Col>

              <Col span={12}>
                <Form.Item label="Date d'Annulation" required>
                  <Input
                    type="date"
                    name="dateAnnulation"
                    value={formData.dateAnnulation || ""}
                    onChange={handleChangeMain}
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
                    options={rubriques
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
                  rules={[
                    {
                      validator: (_, value) =>
                        !value || validateCurrency(value)
                          ? Promise.resolve()
                          : Promise.reject(
                              new Error(
                                "Format monétaire invalide (ex: 123,45 ou 123.45)"
                              )
                            ),
                    },
                  ]}
                >
                  <Input
                    type="text"
                    style={{ height: "39px" }}
                    value={field.montant || ""}
                    onChange={(e) =>
                      handleChangeField(index, "montant", e.target.value)
                    }
                    placeholder="Ex: 5000,41"
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

      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
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
          Enregistrer
        </Button>
      </div>
    </Modal>
  );
};

export default ModalCreationCce;
