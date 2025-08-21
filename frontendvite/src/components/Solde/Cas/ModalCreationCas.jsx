import React, { useState, useEffect } from "react";
import { Select, Modal, Form, Input, Button, Row, Col, message } from "antd";
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
  const [loadingCorps, setLoadingCorps] = useState(true); // Ajout de loadingCorps pour éviter une erreur

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
      .get("http://192.168.88.28:8087/localites/noms")
      .then((response) => {
        setLocalites(response.data);
      })
      .catch((error) => {
        console.error("Erreur lors du chargement des localités :", error);
      });
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

  // Vérification et envoi des données
  const handleSubmit = async () => {
    // Vérification des champs obligatoires
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
        "http://192.168.88.28:8087/certificatsCas/lastId"
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
      };

      // Envoi de la requête pour enregistrer l'agent
      const response = await fetch(
        "http://192.168.88.28:8087/agentsCas/enregistre",
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
          Création de la Certificat Administratif du Solde
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
            <Form.Item label="Matricule" required>
              <Input
                name="matricule"
                value={formData.matricule || ""}
                onChange={handleChangeMain}
                placeholder="Entrer le matricule"
              />
            </Form.Item>
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
              <Col span={12}>
                <Form.Item label="Date de début">
                  <Input
                    type="date"
                    name="dateDebut"
                    value={formData.dateDebut || ""}
                    onChange={handleChangeMain}
                  />
                </Form.Item>
              </Col>

              <Col span={12}>
                <Form.Item label="Date de fin">
                  <Input
                    type="date"
                    name="dateFin"
                    value={formData.dateFin || ""}
                    onChange={handleChangeMain}
                  />
                </Form.Item>
              </Col>
            </Row>

            <Form.Item label="Date prise de Service">
              <Input
                type="date"
                name="datePrise"
                value={formData.datePrise || ""}
                onChange={handleChangeMain}
              />
            </Form.Item>
          </Form>
        </Col>

        <Col span={11} className="form-container">
          <h5>Informations des Actes</h5>
          <Form layout="vertical">
            <Form.Item label="Référence Acte">
              <Input
                name="referenceActe"
                value={formData.referenceActe || ""}
                onChange={handleChangeMain}
                placeholder="Entrer la référence de l'acte"
              />
            </Form.Item>
            <Form.Item label="Date de l'acte">
              <Input
                type="date"
                name="dateActe"
                value={formData.dateActe || ""}
                onChange={handleChangeMain}
              />
            </Form.Item>
            <Form.Item label="Acte">
              <Select
                name="acte"
                value={formData.acte || ""}
                onChange={(value) => handleChangeMain(value, "acte")}
                placeholder="Sélectionner l'acte"
              >
                <Select.Option value="Contract">Contract</Select.Option>
                <Select.Option value="Arrêté">Arrêté</Select.Option>
                <Select.Option value="Décision">Décision</Select.Option>
                <Select.Option value="Décret">Décret</Select.Option>
                <Select.Option value="Autre">Autre</Select.Option>
              </Select>
            </Form.Item>
          </Form>
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
