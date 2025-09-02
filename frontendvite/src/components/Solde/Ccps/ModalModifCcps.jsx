import React, { useState, useEffect } from "react";
import {
  Modal,
  Form,
  Input,
  Button,
  Row,
  Col,
  Select,
  message,
  Spin,
} from "antd";
import Swal from "sweetalert2";
import axios from "axios";

const { Option } = Select;

const ModalModifCap = ({
  open,
  onClose,
  formData,
  setFormData,
  onSuccess,
  rubriques = [],
}) => {
  const [loading, setLoading] = useState(true);
  const [corpsList, setCorpsList] = useState([]);
  const [gradesWithIndices, setGradesWithIndices] = useState([]);
  const [chapitreList, setChapitreList] = useState([]);
  const [localites, setLocalites] = useState([]);
  const [articles, setArticles] = useState([]);
  const [localRubriques, setLocalRubriques] = useState([]);
  const [formFields, setFormFields] = useState([]);

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

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [corpsRes, chapitreRes, localitesRes, articlesRes, rubriquesRes] =
          await Promise.all([
            axios.get("http://192.168.88.58:8087/corps/distinct"),
            axios.get("http://192.168.88.58:8087/chapitres"),
            axios.get("http://192.168.88.58:8087/localites/noms"),
            axios.get("http://192.168.88.58:8087/articles"),
            rubriques.length === 0
              ? axios.get("http://192.168.88.58:8087/rubriquesolde/ids")
              : Promise.resolve({ data: rubriques }),
          ]);

        setCorpsList(corpsRes.data);
        setChapitreList(chapitreRes.data);
        setLocalites(localitesRes.data);
        setArticles(articlesRes.data);
        setLocalRubriques(rubriquesRes.data);
      } catch (error) {
        console.error("Erreur lors du chargement des données :", error);
        message.error("Impossible de charger les données.");
      } finally {
        setLoading(false);
      }
    };

    if (open) {
      fetchData();
    }
  }, [open, rubriques.length]);

  useEffect(() => {
    if (open && formData) {
      const newFields =
        formData.sesituer?.map((s) => ({
          rubrique: s.rubrique?.id_rubrique || "",
          montant: s.montant?.toString() || "", // Convertir en string pour l'affichage
        })) || [];
      setFormFields(newFields);
    } else {
      setFormFields([]);
    }
  }, [open, formData]);

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
    updatedFields.sort((a, b) => {
      const rubA = parseFloat(a.rubrique) || 0;
      const rubB = parseFloat(b.rubrique) || 0;
      return rubA - rubB;
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

  const handleCorpsChange = async (value) => {
    setFormData((prev) => ({ ...prev, corps: value, grade: "", indice: "" }));

    try {
      const response = await axios.get(
        `http://192.168.88.58:8087/corps/grades?corps=${value}`
      );
      setGradesWithIndices(response.data);
    } catch (error) {
      console.error("Erreur lors du chargement des grades :", error);
      message.error("Impossible de charger les grades.");
    }
  };

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

  const handleChangeMain = (value, name) => {
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    // Validation des champs obligatoires
    const requiredFields = {
      matricule: formData.matricule,
      nom: formData.nom,
      prenom: formData.prenom,
      civilite: formData.civilite,
      cessationService: formData.cessationService,
    };

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
    if (!validateTextOnly(formData.nom)) {
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

    if (!validateTextOnly(formData.prenom)) {
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

    if (!formData || !formData.matricule) {
      message.error(
        "L'ID de l'agent est manquant. Impossible de mettre à jour."
      );
      return;
    }

    try {
      const username = localStorage.getItem("username") || "Utilisateur";
      const updatedAgentData = {
        ...formData,
        certificat: {
          ...(formData.certificat || {}),
          modif_par: username,
        },
        sesituer: formFields.map((f) => ({
          rubrique: { id_rubrique: f.rubrique },
          montant: parseFloat(formatCurrencyForBackend(f.montant)) || 0,
        })),
      };

      const response = await axios.put(
        `http://192.168.88.58:8087/agentsCcps/modifier/${formData.matricule}`,
        updatedAgentData,
        { headers: { "Content-Type": "application/json" } }
      );

      if (response.status === 200) {
        Swal.fire("Succès", "Certificat mis à jour avec succès !", "success");
        onClose();
        onSuccess();
      } else {
        Swal.fire("Erreur", "La mise à jour a échoué.", "error");
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message;
      Swal.fire(
        "Erreur",
        `Impossible de mettre à jour l'agent : ${errorMessage}`,
        "error"
      );
    }
  };

  if (!formData) return null;

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
          Modification de la Certificat de Cessation de Paiement du Solde
        </div>
      }
      centered
      open={open}
      onCancel={onClose}
      width={1200}
      footer={null}
      className="custom-modal"
    >
      {loading ? (
        <Spin
          tip="Chargement..."
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100px",
          }}
        />
      ) : (
        <Row gutter={16}>
          <Col span={9} className="form-container">
            <h5>Informations de l'agent</h5>
            <Form layout="vertical">
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item label="Civilité" required>
                    <Select
                      value={formData.civilite || ""}
                      onChange={(value) => handleChangeMain(value, "civilite")}
                    >
                      <Option value="Monsieur">Monsieur</Option>
                      <Option value="Madame">Madame</Option>
                    </Select>
                  </Form.Item>
                </Col>

                <Col span={12}>
                  <Form.Item label="Matricule" required>
                    <Input
                      value={formData.matricule || ""}
                      onChange={(e) =>
                        handleChangeMain(e.target.value, "matricule")
                      }
                    />
                  </Form.Item>
                </Col>
              </Row>

              <Form.Item
                label="Nom"
                required
                validateStatus={
                  validateTextOnly(formData.nom) || !formData.nom ? "" : "error"
                }
                help={
                  validateTextOnly(formData.nom) || !formData.nom
                    ? ""
                    : "Le nom doit contenir uniquement des lettres"
                }
              >
                <Input
                  value={formData.nom || ""}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (value === "" || validateTextOnly(value)) {
                      handleChangeMain(value, "nom");
                    }
                  }}
                />
              </Form.Item>

              <Form.Item
                label="Prénom"
                required
                validateStatus={
                  validateTextOnly(formData.prenom) || !formData.prenom
                    ? ""
                    : "error"
                }
                help={
                  validateTextOnly(formData.prenom) || !formData.prenom
                    ? ""
                    : "Le prénom doit contenir uniquement des lettres"
                }
              >
                <Input
                  value={formData.prenom || ""}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (value === "" || validateTextOnly(value)) {
                      handleChangeMain(value, "prenom");
                    }
                  }}
                />
              </Form.Item>

              <Form.Item label="Cessation du Service" required>
                <Select
                  value={formData.cessationService || ""}
                  onChange={(value) =>
                    handleChangeMain(value, "cessationService")
                  }
                >
                  <Option value="Retraité pour limite d'âge">
                    Retraité pour limite d'âge
                  </Option>
                  <Option value="Décèdé">Décèdé</Option>
                </Select>
              </Form.Item>

              <Row gutter={16}>
                <Col span={6}>
                  <Form.Item label="Enfant">
                    <Input
                      type="number"
                      value={formData.enfant || ""}
                      onChange={(e) =>
                        handleChangeMain(e.target.value, "enfant")
                      }
                    />
                  </Form.Item>
                </Col>

                <Col span={6}>
                  <Form.Item label="Zone">
                    <Input
                      type="number"
                      value={formData.zone || ""}
                      onChange={(e) => handleChangeMain(e.target.value, "zone")}
                    />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label="Localité">
                    <Select
                      value={formData.localite || ""}
                      onChange={(value) => handleChangeMain(value, "localite")}
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
                  <Form.Item label="Corps">
                    <Select
                      value={formData.corps || ""}
                      onChange={handleCorpsChange}
                      showSearch
                    >
                      {corpsList.map((corps) => (
                        <Option key={corps} value={corps}>
                          {corps}
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item label="Grade">
                    <Select
                      value={formData.grade || ""}
                      onChange={handleGradeChange}
                      showSearch
                    >
                      {gradesWithIndices.map((item) => (
                        <Option key={item.grade} value={item.grade}>
                          {item.grade}
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item label="Indice">
                    <Input
                      value={formData.indice || ""}
                      style={{ color: "black" }}
                      disabled
                    />
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={16}>
                <Col span={10}>
                  <Form.Item label="Chapitre">
                    <Select
                      value={formData.chapitre || ""}
                      onChange={(value) => handleChangeMain(value, "chapitre")}
                      showSearch
                    >
                      {chapitreList.map((chapitre) => (
                        <Option key={chapitre} value={chapitre}>
                          {chapitre}
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={14}>
                  <Form.Item label="Article">
                    <Select
                      value={formData.article || ""}
                      onChange={(value) => handleChangeMain(value, "article")}
                      showSearch
                    >
                      {articles.map((article) => (
                        <Option
                          key={article.idArticle}
                          value={article.idArticle}
                        >
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
                      value={formData.acte || ""}
                      onChange={(e) => handleChangeMain(e.target.value, "acte")}
                    />
                  </Form.Item>
                </Col>

                <Col span={12}>
                  <Form.Item label="Référence">
                    <Input
                      value={formData.referenceActe || ""}
                      onChange={(e) =>
                        handleChangeMain(e.target.value, "referenceActe")
                      }
                    />
                  </Form.Item>
                </Col>
              </Row>

              <Form.Item label="Date Acte">
                <Input
                  type="date"
                  value={
                    formData.dateActe
                      ? new Date(formData.dateActe).toISOString().split("T")[0]
                      : ""
                  }
                  onChange={(e) => handleChangeMain(e.target.value, "dateActe")}
                />
              </Form.Item>

              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item label="Date de Cessation Service">
                    <Input
                      type="date"
                      value={formData.dateCessation || ""}
                      onChange={(e) =>
                        handleChangeMain(e.target.value, "dateCessation")
                      }
                    />
                  </Form.Item>
                </Col>

                <Col span={12}>
                  <Form.Item label="Date Fin de Paiement">
                    <Input
                      type="date"
                      value={formData.dateFinPai || ""}
                      onChange={(e) =>
                        handleChangeMain(e.target.value, "dateFinPai")
                      }
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
                  value={formData.montant || ""}
                  onChange={(e) => handleChangeMain(e.target.value, "montant")}
                />
              </Form.Item>

              <Form.Item label="Reference">
                <Input
                  type="text"
                  value={formData.referenceRecette || ""}
                  onChange={(e) =>
                    handleChangeMain(e.target.value, "referenceRecette")
                  }
                />
              </Form.Item>

              <Form.Item label="Date d'ordre de Recette">
                <Input
                  type="date"
                  value={formData.dateOrdreRecette || ""}
                  onChange={(e) =>
                    handleChangeMain(e.target.value, "dateOrdreRecette")
                  }
                />
              </Form.Item>

              <Form.Item label="Date debut paiement">
                <Input
                  type="date"
                  value={formData.dateDebut || ""}
                  onChange={(e) =>
                    handleChangeMain(e.target.value, "dateDebut")
                  }
                />
              </Form.Item>

              <Form.Item label="Date dernier paiement">
                <Input
                  type="date"
                  value={formData.dateDernierPai || ""}
                  onChange={(e) =>
                    handleChangeMain(e.target.value, "dateDernierPai")
                  }
                />
              </Form.Item>
            </Form>
          </Col>

          <Col span={7} className="form-container">
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
              Ajouter
            </Button>

            {formFields.map((field, index) => (
              <Row key={index} gutter={8}>
                <Col span={8}>
                  <Form.Item label="Rubrique">
                    <Select
                      value={field.rubrique || ""}
                      onChange={(value) =>
                        handleChangeField(index, "rubrique", value)
                      }
                      showSearch
                    >
                      {availableRubriques
                        .filter(
                          (rubrique) =>
                            !formFields.some(
                              (f, i) => i !== index && f.rubrique === rubrique
                            )
                        )
                        .map((rubrique) => (
                          <Option key={rubrique} value={rubrique}>
                            {rubrique}
                          </Option>
                        ))}
                    </Select>
                  </Form.Item>
                </Col>

                <Col span={12}>
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
                      value={field.montant || ""}
                      onChange={(e) =>
                        handleChangeField(index, "montant", e.target.value)
                      }
                      placeholder="Entrer un montant"
                    />
                  </Form.Item>
                </Col>

                <Col span={4} style={{ display: "flex", alignItems: "center" }}>
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
                    ×
                  </Button>
                </Col>
              </Row>
            ))}
          </Col>
        </Row>
      )}

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
          Enregistrer les modifications
        </Button>
      </div>
    </Modal>
  );
};

export default ModalModifCap;
