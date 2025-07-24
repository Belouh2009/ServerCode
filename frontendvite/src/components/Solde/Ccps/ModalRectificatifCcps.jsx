import React, { useState, useEffect } from "react";
import { Modal, Form, Input, Button, Row, Col, Select } from "antd";
import ReactSelect from "react-select";
import { IoMdClose, IoMdAdd } from "react-icons/io";
import Swal from "sweetalert2";
import axios from "axios";
import "../../../index.css";

const { Option } = Select;

const ModalRectifCcps = ({
  open,
  onClose,
  agent,
  onSuccess,
  rubriques = [],
}) => {
  const [matricule, setMatricule] = useState("");
  const [idCertificatRect, setIdCertificatRect] = useState("");
  const [civilite, setCivilite] = useState("");
  const [nom, setNom] = useState("");
  const [prenom, setPrenom] = useState("");
  const [enfant, setEnfant] = useState("");
  const [localite, setLocalite] = useState("");
  const [cessationService, setCessationService] = useState("");
  const [corps, setCorps] = useState("");
  const [grade, setGrade] = useState("");
  const [indice, setIndice] = useState("");
  const [zone, setZone] = useState("");
  const [chapitre, setChapitre] = useState("");
  const [article, setArticle] = useState("");
  const [acte, setActe] = useState("");
  const [referenceActe, setReferenceActe] = useState("");
  const [dateActe, setDateActe] = useState("");
  const [dateCessation, setDateCessation] = useState("");
  const [dateFinPai, setDateFinPai] = useState("");
  const [montant, setMontant] = useState("");
  const [referenceRecette, setReferenceRecette] = useState("");
  const [dateOrdreRecette, setDateOrdreRecette] = useState("");
  const [dateDebut, setDateDebut] = useState("");
  const [dateDernierPai, setDateDernierPai] = useState("");

  const [corpsList, setCorpsList] = useState([]);
  const [gradesWithIndices, setGradesWithIndices] = useState([]);
  const [chapitreList, setChapitreList] = useState([]);
  const [localites, setLocalites] = useState([]);
  const [articles, setArticles] = useState([]);

  const [formFields, setFormFields] = useState([]);

  const [localRubriques, setLocalRubriques] = useState([]);

  // Lorsque l'agent est ouvert, récupérer ses informations et remplir les champs
  useEffect(() => {
    if (open && agent) {
      setMatricule(agent.matricule || "");
      setIdCertificatRect(agent.idCertificat || "");
      setCivilite(agent.civilite || "");
      setNom(agent.nom || "");
      setPrenom(agent.prenom || "");
      setEnfant(agent.enfant || "");
      setLocalite(agent.localite || "");
      setCessationService(agent.cessationService || "");
      setCorps(agent.corps || "");
      setGrade(agent.grade || "");
      setIndice(agent.indice || "");
      setZone(agent.zone || "");
      setChapitre(agent.chapitre || "");
      setArticle(agent.article || "");
      setActe(agent.acte || "");
      setReferenceActe(agent.referenceActe || "");
      setDateActe(agent.dateActe || "");
      setDateCessation(agent.dateCessation || "");
      setDateFinPai(agent.dateFinPai || "");
      setMontant(agent.montant || "");
      setReferenceRecette(agent.referenceRecette || "");
      setDateOrdreRecette(agent.dateOrdreRecette || "");
      setDateDebut(agent.dateDebut || "");
      setDateDernierPai(agent.dateDernierPai || "");

      const newFields =
        agent.sesituer?.map((s) => ({
          rubrique: s.rubrique?.id_rubrique || "",
          montant: s.montant || "",
        })) || [];

      setFormFields(newFields);
    } else {
      setMatricule("");
      setIdCertificatRect("");
      setCivilite("");
      setNom("");
      setPrenom("");
      setEnfant("");
      setLocalite("");
      setCessationService("");
      setCorps("");
      setGrade("");
      setIndice("");
      setZone("");
      setChapitre("");
      setArticle("");
      setActe("");
      setReferenceActe("");
      setDateActe("");
      setDateCessation("");
      setDateFinPai("");
      setMontant("");
      setReferenceRecette("");
      setDateOrdreRecette("");
      setDateDebut("");
      setDateDernierPai("");
      setFormFields([]);
    }
  }, [open, agent]);

  useEffect(() => {
    axios
      .get("http://localhost:8087/CorpsGradeIndice/corps")
      .then((response) => {
        setCorpsList(response.data);
        setLoadingCorps(false);
      })
      .catch((error) => {
        console.error("Erreur lors du chargement des corps :", error);
        setLoadingCorps(false);
      });

    axios
      .get("http://localhost:8087/chapitres")
      .then((response) => setChapitreList(response.data))
      .catch((error) =>
        console.error("Erreur lors du chargement des chapitres :", error)
      );

    axios
      .get("http://localhost:8087/articles")
      .then((response) => setArticles(response.data))
      .catch((error) =>
        console.error("Erreur lors du chargement des chapitres :", error)
      );

    axios
      .get("http://localhost:8087/localites/noms")
      .then((response) => {
        setLocalites(response.data);
      })
      .catch((error) => {
        console.error("Erreur lors du chargement des localités :", error);
      });
  }, []);

  // Si les rubriques ne sont pas passées en prop, on effectue un appel API pour les récupérer
  useEffect(() => {
    if (rubriques.length === 0 && localRubriques.length === 0) {
      // Ajouter la condition pour vérifier si rubriques sont déjà présentes
      fetch("http://localhost:8087/rubriquesolde/ids")
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

  // Utiliser soit les rubriques passées en props, soit celles récupérées localement
  const availableRubriques = rubriques.length > 0 ? rubriques : localRubriques;

  const handleChangeField = (index, name, value) => {
    const updatedFields = [...formFields];
    updatedFields[index][name] = value;
    setFormFields(updatedFields);
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
    setFormFields(formFields.filter((_, i) => i !== index));
  };

  const handleCorpsChange = async (value) => {
    setCorps(value);
    setGrade(""); // Réinitialiser la valeur de grade
    setIndice(""); // Réinitialiser l'indice
    try {
      const response = await axios.get(
        `http://localhost:8087/CorpsGradeIndice/grades?corps=${value}`
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
    setGrade(selectedGrade);
    setIndice(selectedGradeData ? String(selectedGradeData.indice) : "");
  };

  // Fonction pour gérer la sélection de la localité
  const handleLocaliteChange = (value) => {
    setLocalite(value);
  };

  const handleChapitreChange = (value) => {
    setChapitre(value);
  };

  const handleArticleChange = (value) => {
    setArticle(value);
  };

  const handleSubmit = async () => {
    const username = localStorage.getItem("username") || "Utilisateur";

    // Vérification des champs obligatoires
    if (!nom || !prenom || !matricule || !corps || !grade || !indice) {
      message.error("Veuillez remplir tous les champs obligatoires !");
      return;
    }

    try {
      // Récupération du dernier ID
      const lastIdResponse = await fetch(
        "http://localhost:8087/certificatsCcps/lastId"
      );
      if (!lastIdResponse.ok)
        throw new Error("Impossible de récupérer le dernier ID");

      const lastId = await lastIdResponse.text(); // exemple : "0003-2025"
      const currentYear = new Date().getFullYear();
      const newIdNum = parseInt(lastId.split("-")[0] || "0", 10) + 1;
      const newIdFormatted = `${String(newIdNum).padStart(
        4,
        "0"
      )}-${currentYear}`;

      const updatedAgentData = {
        matricule,
        civilite,
        nom,
        prenom,
        enfant,
        localite,
        cessationService,
        corps,
        grade,
        indice,
        zone,
        chapitre,
        article,
        acte,
        referenceActe,
        dateActe,
        dateCessation,
        dateFinPai,
        montant,
        referenceRecette,
        dateOrdreRecette,
        dateDebut,
        dateDernierPai,
        idCertificatRect,
        certificat: {
          id_certificat: newIdFormatted,
          date_creation: new Date().toISOString(),
          ajout_par: username,
        },
        sesituer: formFields.map((f) => ({
          rubrique: { id_rubrique: f.rubrique },
          montant: parseFloat(f.montant) || 0,
        })),
      };

      const response = await axios.post(
        `http://localhost:8087/agentsCcpsRect/enregistre`,
        updatedAgentData,
        { headers: { "Content-Type": "application/json" } }
      );

      if (response.status === 200 || response.status === 201) {
        Swal.fire("Succès", "Certificat rectifié avec succès !", "success");
        onClose();
        onSuccess();
      } else {
        Swal.fire("Erreur", "L'enregistrement a échoué.", "error");
      }
    } catch (error) {
      const msg =
        error.response?.data?.message || error.message || "Erreur inconnue";
      Swal.fire(
        "Erreur",
        `Impossible de rectifier le certificat : ${msg}`,
        "error"
      );
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
          Réctification de la Certificat de Cessation de Paiement du Solde
        </div>
      }
      centered
      open={open}
      onCancel={onClose}
      width={1200}
      footer={null}
      className="custom-modal"
    >
      <Row gutter={16}>
        <Col span={9} className="form-container">
          <h5>Informations de l'agent</h5>
          <Form layout="vertical">
            <Form.Item label="ID Cetificat Réctifié" required>
              <Input
                name="idCertificatRect"
                value={idCertificatRect}
                onChange={(e) => setIdCertificatRect(e.target.value)}
                style={{ color: "black" }}
                disabled
              />
            </Form.Item>

            <Row gutter={16}>
              <Col span={12}>
                <Form.Item label="Civilité">
                  <Select
                    value={civilite}
                    onChange={(value) => setCivilite(value)}
                  >
                    <Option value="Monsieur">Monsieur</Option>
                    <Option value="Madame">Madame</Option>
                  </Select>
                </Form.Item>
              </Col>

              <Col span={12}>
                <Form.Item label="Matricule" required>
                  <Input
                    name="matricule"
                    value={matricule}
                    onChange={(e) => setMatricule(e.target.value)}
                  />
                </Form.Item>
              </Col>
            </Row>

            <Form.Item label="Nom">
              <Input value={nom} onChange={(e) => setNom(e.target.value)} />
            </Form.Item>

            <Form.Item label="Prénom">
              <Input
                value={prenom}
                onChange={(e) => setPrenom(e.target.value)}
              />
            </Form.Item>

            <Form.Item label="Cessation du Service">
              <Select
                name="cessationService"
                value={cessationService}
                onChange={(value) => setCessationService(value)}
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
                    value={enfant}
                    onChange={(e) => setEnfant(e.target.value)}
                  />
                </Form.Item>
              </Col>

              <Col span={6}>
                <Form.Item label="Zone">
                  <Input
                    type="number"
                    name="zone"
                    value={zone}
                    onChange={(e) => setZone(e.target.value)}
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="Localité">
                  <Select
                    style={{ fontSize: 10 }}
                    value={localite}
                    onChange={handleLocaliteChange}
                    showSearch
                  >
                    {localites.map((localite) => (
                      <Select.Option key={localite} value={localite}>
                        {localite}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col span={8}>
                <Form.Item label="Corps">
                  <Select value={corps} onChange={handleCorpsChange} showSearch>
                    {corpsList.map((corps) => (
                      <Select.Option key={corps} value={corps}>
                        {corps}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item label="Grade">
                  <Select value={grade} onChange={handleGradeChange} showSearch>
                    {gradesWithIndices.map((item) => (
                      <Select.Option key={item.grade} value={item.grade}>
                        {item.grade}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item label="Indice">
                  <Input
                    name="indice"
                    value={indice}
                    onChange={(e) => setIndice(e.target.value)}
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
                    style={{ fontSize: 10 }}
                    value={chapitre}
                    onChange={handleChapitreChange}
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
                    value={article}
                    onChange={handleArticleChange}
                    showSearch
                  >
                    {articles.map((article) => (
                      <Select.Option
                        key={article.idArticle}
                        value={article.idArticle}
                      >
                        {article.idArticle}
                      </Select.Option>
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
                    value={acte}
                    onChange={(e) => handleChangeMain(e.target.value, "acte")}
                  />
                </Form.Item>
              </Col>

              <Col span={12}>
                <Form.Item label="Référence">
                  <Input
                    name="referenceActe"
                    value={referenceActe}
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
                name="dateActe"
                value={
                  dateActe ? new Date(dateActe).toISOString().split("T")[0] : ""
                }
                onChange={(e) => setDateActe(e.target.value)}
              />
            </Form.Item>

            <Row gutter={16}>
              <Col span={12}>
                <Form.Item label="Date de Cessation de Service">
                  <Input
                    type="date"
                    name="dateCessation"
                    value={
                      dateCessation
                        ? new Date(dateCessation).toISOString().split("T")[0]
                        : ""
                    }
                    onChange={(e) => setDateCessation(e.target.value)}
                  />
                </Form.Item>
              </Col>

              <Col span={12}>
                <Form.Item label="Date Fin de Paiement">
                  <Input
                    type="date"
                    name="dateFinPai"
                    value={
                      dateFinPai
                        ? new Date(dateFinPai).toISOString().split("T")[0]
                        : ""
                    }
                    onChange={(e) => setDateFinPai(e.target.value)}
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
                value={montant}
                onChange={(e) => setMontant(e.target.value)}
              />
            </Form.Item>

            <Form.Item label="Reference">
              <Input
                type="text"
                name="referenceRecette"
                value={referenceRecette}
                onChange={(e) => setReferenceRecette(e.target.value)}
              />
            </Form.Item>

            <Form.Item label="Date d'ordre de Recette">
              <Input
                type="date"
                name="dateOrdreRecette"
                value={
                  dateOrdreRecette
                    ? new Date(dateOrdreRecette).toISOString().split("T")[0]
                    : ""
                }
                onChange={(e) => setDateOrdreRecette(e.target.value)}
              />
            </Form.Item>

            <Form.Item label="Date debut paiement">
              <Input
                type="date"
                name="dateDebut"
                value={
                  dateDebut
                    ? new Date(dateDebut).toISOString().split("T")[0]
                    : ""
                }
                onChange={(e) => setDateDebut(e.target.value)}
              />
            </Form.Item>

            <Form.Item label="Date dernier paiement">
              <Input
                type="date"
                name="dateDernierPai"
                value={
                  dateDernierPai
                    ? new Date(dateDernierPai).toISOString().split("T")[0]
                    : ""
                }
                onChange={(e) => setDateDernierPai(e.target.value)}
              />
            </Form.Item>
          </Form>
        </Col>

        <Col span={7} className="form-container">
          <h5>Informations Rubrique</h5>

          <Button type="primary" block onClick={handleAddField}>
            Ajouter <IoMdAdd />
          </Button>

          {formFields.map((field, index) => (
            <Row key={index} gutter={8} style={{ marginTop: "10px" }}>
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
                    options={rubriques.map((rubrique) => ({
                      value: rubrique,
                      label: rubrique,
                    }))}
                    required
                  />
                </Form.Item>
              </Col>

              <Col span={12}>
                <Form.Item label="Montant">
                  <Input
                    style={{ height: "39px" }}
                    type="text"
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
          Enregistrer les Réctifications
        </Button>
      </div>
    </Modal>
  );
};

export default ModalRectifCcps;
