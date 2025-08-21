import React, { useState, useEffect } from "react";
import { Select, Modal, Form, Input, Button, Row, Col, message } from "antd";
import ReactSelect from "react-select";
import { IoMdClose, IoMdAdd } from "react-icons/io";
import axios from "axios";
import Swal from "sweetalert2";
import "../../../index.css";

const ModalCreation = ({
  open,
  onClose,
  formData,
  setFormData,
  formFields,
  setFormFields,
  onSuccess,
}) => {
  const [corpsList, setCorpsList] = useState([]);
  const [gradesWithIndices, setGradesWithIndices] = useState([]);
  const [chapitreList, setChapitreList] = useState([]);
  const [localites, setLocalites] = useState([]);
  const [articles, setArticles] = useState([]);
  const [rubriques, setRubriques] = useState([]);
  const [loadingCorps, setLoadingCorps] = useState(true);

  useEffect(() => {
    axios
      .get("http://192.168.88.28:8087/corps/distinct")
      .then((response) => {
        setCorpsList(response.data);
        setLoadingCorps(false);
      })
      .catch((error) => {
        console.error("Erreur lors du chargement des corps :", error);
        setLoadingCorps(false);
      });

    axios
      .get("http://192.168.88.28:8087/chapitres")
      .then((response) => setChapitreList(response.data))
      .catch((error) =>
        console.error("Erreur lors du chargement des chapitres :", error)
      );

    axios
      .get("http://192.168.88.28:8087/articles")
      .then((response) => setArticles(response.data))
      .catch((error) =>
        console.error("Erreur lors du chargement des chapitres :", error)
      );

    axios
      .get("http://192.168.88.28:8087/localites/noms")
      .then((response) => {
        setLocalites(response.data);
      })
      .catch((error) => {
        console.error("Erreur lors du chargement des localités :", error);
      });

    axios
      .get("http://192.168.88.28:8087/rubriquesolde/ids")
      .then((response) => {
        const data = response.data;
        if (Array.isArray(data)) setRubriques(data);
      })
      .catch((error) =>
        console.error("Erreur lors du chargement des rubriques :", error)
      );
  }, []);

  // Charger la liste des grades avec indices lorsqu'un corps est sélectionné
  const handleCorpsChange = (value) => {
    setFormData((prev) => ({ ...prev, corps: value, grade: "", indice: "" })); // Réinitialiser grade et indice
    axios
      .get(`http://192.168.88.28:8087/corps/grades?corps=${value}`)
      .then((response) => setGradesWithIndices(response.data))
      .catch((error) =>
        console.error("Erreur lors du chargement des grades :", error)
      );
  };

  // Mettre à jour le grade sélectionné et l'indice correspondant
  const handleGradeChange = (selectedGrade) => {
    const selectedGradeData = gradesWithIndices.find(
      (item) => item.grade === selectedGrade
    );
    setFormData((prev) => ({
      ...prev,
      grade: selectedGrade,
      indice: selectedGradeData ? String(selectedGradeData.indice) : "",
    }));
  };

  const handleLocaliteChange = (value) => {
    setFormData((prev) => ({
      ...prev,
      localite: value,
    }));
  };

  // Gérer le changement de rubrique ou montant
  const handleChangeField = (index, key, value) => {
    const updatedFields = [...formFields];
    updatedFields[index][key] = value;
    setFormFields(updatedFields);
  };

  const handleArticleChange = (value) => {
    setFormData({ ...formData, article: value });
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
    const updatedFields = [...formFields];
    updatedFields.splice(index, 1);
    setFormFields(updatedFields);
  };

  // Gestion des entrées générales
  const handleChangeMain = (value, name) => {
    if (typeof value === "object" && value.target) {
      // Cas d'un champ Input
      const { name, value: inputValue } = value.target;
      setFormData((prevData) => ({
        ...prevData,
        [name]: inputValue,
      }));
    } else {
      // Cas d'un Select ou d'une valeur passée directement
      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
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

      if (
        !field.montant ||
        isNaN(parseFloat(field.montant)) ||
        parseFloat(field.montant) <= 0
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

  // Vérification et envoi des données
  const handleSubmit = async () => {
    if (!validateRubriques()) return;

    if (
      !formData.nom ||
      !formData.prenom ||
      !formData.matricule ||
      !formData.corps ||
      !formData.grade ||
      !formData.indice
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
      // Récupérer le dernier ID
      const lastIdResponse = await fetch(
        "http://192.168.88.28:8087/certificatsCcps/lastId"
      );
      if (!lastIdResponse.ok) {
        throw new Error("Impossible de récupérer le dernier ID");
      }
      const lastId = await lastIdResponse.text();

      // Préparation des données
      const date_creation = new Date().toLocaleDateString("fr-CA");
      const username = localStorage.getItem("username") || "Utilisateur";

      const dataToSend = {
        ...formData,
        certificat: {
          id_certificat: `${String(
            parseInt(lastId.split("-")[0], 10) + 1
          ).padStart(4, "0")}-${new Date().getFullYear()}`,
          date_creation,
          ajout_par: username,
          modif_par: "Aucun",
        },
        sesituer: formFields.map((field) => ({
          rubrique: { id_rubrique: field.rubrique },
          montant: isNaN(parseFloat(field.montant))
            ? 0
            : parseFloat(field.montant),
        })),
      };

      // Envoi de la requête pour enregistrer l'agent
      const response = await fetch(
        "http://192.168.88.28:8087/agentsCcps/enregistre",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(dataToSend),
        }
      );

      // Vérification de la réponse du serveur
      const responseText = await response.text();
      if (response.ok) {
        // Succès
        Swal.fire({
          icon: "success",
          title: "Succès !",
          text: "Certificat enregistré avec succès.",
          confirmButtonText: "OK",
        });
        setFormData({});
        setFormFields([]);
        onClose();
        onSuccess();
      } else {
        // Erreur avec réponse du serveur
        Swal.fire({
          icon: "error",
          title: "Erreur !",
          text: responseText,
          confirmButtonText: "OK",
        });
      }
    } catch (error) {
      // Erreur de connexion au serveur
      Swal.fire({
        icon: "error",
        title: "Erreur réseau",
        text: error.message || "Impossible de contacter le serveur.",
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
          Création de la Certificat de Cessation de Paiement du Solde
        </div>
      }
      centered
      open={open}
      onCancel={onClose}
      width={1200}
      className="custom-modal"
      footer={null}
    >
      <Row gutter={16}>
        <Col span={10} className="form-container">
          <h5>Informations de l'agent</h5>
          <Form layout="vertical">
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item label="Civilité">
                  <Select
                    name="civilite"
                    value={formData.civilite || ""}
                    onChange={(value) => handleChangeMain(value, "civilite")}
                  >
                    <Select.Option value="Monsieur">Monsieur</Select.Option>
                    <Select.Option value="Madame">Madame</Select.Option>
                  </Select>
                </Form.Item>
              </Col>

              <Col span={12}>
                <Form.Item label="Matricule" required>
                  <Input
                    name="matricule"
                    value={formData.matricule || ""}
                    onChange={handleChangeMain}
                    placeholder="Entrer le matricule"
                  />
                </Form.Item>
              </Col>
            </Row>

            <Form.Item label="Nom" required>
              <Input
                name="nom"
                value={formData.nom || ""}
                onChange={handleChangeMain}
                placeholder="Entrer le nom"
              />
            </Form.Item>
            <Form.Item label="Prénom" required>
              <Input
                name="prenom"
                value={formData.prenom || ""}
                onChange={handleChangeMain}
                placeholder="Entrer le prénom"
              />
            </Form.Item>

            <Form.Item label="Cessation du Service">
              <Select
                name="cessationService"
                value={formData.cessationService || ""}
                onChange={(value) =>
                  handleChangeMain(value, "cessationService")
                }
              >
                <Select.Option value="Retraité pour limite d'âge">
                  Retraité pour limite d'âge
                </Select.Option>
                <Select.Option value="Décèdé">Décèdé</Select.Option>
              </Select>
            </Form.Item>

            <Row gutter={16}>
              <Col span={6}>
                <Form.Item label="Enfant">
                  <Input
                    type="number"
                    name="enfant"
                    value={formData.enfant || ""}
                    onChange={handleChangeMain}
                    placeholder="00"
                    min={0}
                    onKeyPress={(e) => {
                      if (e.key === "-" || e.key === "e" || e.key === "E") {
                        e.preventDefault();
                      }
                    }}
                  />
                </Form.Item>
              </Col>

              <Col span={6}>
                <Form.Item label="Zone">
                  <Input
                    type="number"
                    name="zone"
                    value={formData.zone || ""}
                    onChange={handleChangeMain}
                    placeholder="00"
                    min={0}
                    onKeyPress={(e) => {
                      if (e.key === "-" || e.key === "e" || e.key === "E") {
                        e.preventDefault();
                      }
                    }}
                  />
                </Form.Item>
              </Col>

              <Col span={12}>
                <Form.Item label="Localité">
                  <Select
                    style={{ fontSize: 10 }}
                    value={formData.localite || ""}
                    onChange={handleLocaliteChange}
                    placeholder="Sélectionner une localité"
                    showSearch
                  >
                    {localites.map((localite) => (
                      <Option key={localite} value={localite}>
                        {localite}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col span={8}>
                <Form.Item label="Corps" required>
                  <Select
                    value={formData.corps || ""}
                    onChange={handleCorpsChange}
                    placeholder="Sélectionner le corps"
                    showSearch
                  >
                    {corpsList.map((corps) => (
                      <Select.Option key={corps} value={corps}>
                        {corps}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item label="Grade" required>
                  <Select
                    value={formData.grade || ""}
                    onChange={handleGradeChange}
                    placeholder="Sélectionner le grade"
                    showSearch
                  >
                    {gradesWithIndices.map((item) => (
                      <Select.Option key={item.grade} value={item.grade}>
                        {item.grade}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item label="Indice" required>
                  <Input
                    style={{ color: "black" }}
                    name="indice"
                    value={formData.indice || ""}
                    disabled
                  />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col span={10}>
                <Form.Item label="Chapitre">
                  <Select
                    name="chapitre"
                    value={formData.chapitre || ""}
                    onChange={(value) =>
                      setFormData((prev) => ({ ...prev, chapitre: value }))
                    }
                    placeholder="Sélectionner un chapitre"
                    showSearch
                  >
                    {chapitreList.map((chapitre) => (
                      <Select.Option key={chapitre} value={chapitre}>
                        {chapitre}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>

              <Col span={14}>
                <Form.Item label="Article">
                  <Select
                    style={{ fontSize: 10 }}
                    value={formData.article || ""}
                    onChange={handleArticleChange}
                    placeholder="Sélectionner une article"
                    showSearch
                  >
                    {articles.map((article) => (
                      <Option key={article.idArticle} value={article.idArticle}>
                        {article.idArticle}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col span={12}>
                <Form.Item label="Acte">
                  <Input
                    name="acte"
                    value={formData.acte || ""}
                    onChange={handleChangeMain}
                    placeholder="Entrer l'acte"
                  />
                </Form.Item>
              </Col>

              <Col span={12}>
                <Form.Item label="Référence">
                  <Input
                    name="referenceActe"
                    value={formData.referenceActe || ""}
                    onChange={handleChangeMain}
                    placeholder="Entrer le reference"
                  />
                </Form.Item>
              </Col>
            </Row>

            <Form.Item label="Date Acte">
              <Input
                type="date"
                name="dateActe"
                value={formData.dateActe || ""}
                onChange={handleChangeMain}
              />
            </Form.Item>

            <Row gutter={16}>
              <Col span={12}>
                <Form.Item label="Date de Cessation de Service">
                  <Input
                    type="date"
                    name="dateCessation"
                    value={formData.dateCessation || ""}
                    onChange={handleChangeMain}
                  />
                </Form.Item>
              </Col>

              <Col span={12}>
                <Form.Item label="Date Fin de Paiement">
                  <Input
                    type="date"
                    name="dateFinPai"
                    value={formData.dateFinPai || ""}
                    onChange={handleChangeMain}
                  />
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </Col>

        <Col span={7} className="form-container">
          <h5>Ordre de Recette</h5>
          <Form layout="vertical">
            <Form.Item label="Montants">
              <Input
                name="montant"
                value={formData.montant || ""}
                onChange={handleChangeMain}
                placeholder="0000"
              />
            </Form.Item>

            <Form.Item label="Reference">
              <Input
                type="text"
                name="referenceRecette"
                value={formData.referenceRecette || ""}
                onChange={handleChangeMain}
                placeholder="Entrer le reference"
              />
            </Form.Item>

            <Form.Item label="Date d'ordre de Recette">
              <Input
                type="date"
                name="dateOrdreRecette"
                value={formData.dateOrdreRecette || ""}
                onChange={handleChangeMain}
              />
            </Form.Item>

            <Form.Item label="Date debut paiement">
              <Input
                type="date"
                name="dateDebut"
                value={formData.dateDebut || ""}
                onChange={handleChangeMain}
              />
            </Form.Item>

            <Form.Item label="Date dernier paiement">
              <Input
                type="date"
                name="dateDernierPai"
                value={formData.dateDernierPai || ""}
                onChange={handleChangeMain}
              />
            </Form.Item>
          </Form>
        </Col>

        <Col span={6} className="form-container">
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
            <Row gutter={8} key={index}>
              <Col span={8}>
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
                <Form.Item label="Montant">
                  <Input
                    style={{ height: "39px" }}
                    value={field.montant}
                    onChange={(e) =>
                      handleChangeField(index, "montant", e.target.value)
                    }
                    placeholder="Montant"
                  />
                </Form.Item>
              </Col>

              <Col
                span={4}
                style={{
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <Button
                  type="primary"
                  danger
                  style={{
                    marginTop: "10px",
                    height: "35px",
                    backgroundColor: "#ff4d4f",
                    borderColor: "#ff4d4f",
                  }}
                  onClick={() => handleRemoveField(index)}
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

export default ModalCreation;
