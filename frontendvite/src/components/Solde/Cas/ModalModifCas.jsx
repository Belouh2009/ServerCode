import React, { useState, useEffect } from "react";
import {
  Select,
  Modal,
  Form,
  Input,
  Button,
  Row,
  Col,
  message,
  Spin,
} from "antd";
import axios from "axios";
import Swal from "sweetalert2";

const ModalModification = ({
  open,
  onClose,
  formData,
  setFormData,
  onSuccess,
}) => {
  const [corpsList, setCorpsList] = useState([]);
  const [gradesWithIndices, setGradesWithIndices] = useState([]);
  const [chapitreList, setChapitreList] = useState([]);
  const [localites, setLocalites] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [corpsRes, chapitreRes, localitesRes] = await Promise.all([
          axios.get("http://192.168.88.28:8087/corps/distinct"),
          axios.get("http://192.168.88.28:8087/chapitres"),
          axios.get("http://192.168.88.28:8087/localites/noms"),
        ]);

        setCorpsList(corpsRes.data);
        setChapitreList(chapitreRes.data);
        setLocalites(localitesRes.data);
      } catch (error) {
        console.error("Erreur lors du chargement des données :", error);
        message.error("Impossible de charger les données.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleCorpsChange = async (value) => {
    setFormData((prev) => ({ ...prev, corps: value, grade: "", indice: "" }));

    try {
      const response = await axios.get(
        `http://192.168.88.28:8087/corps/grades?corps=${value}`
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

  const handleLocaliteChange = (value) => {
    setFormData((prev) => ({
      ...prev,
      localite: value,
    }));
  };

  const handleChangeMain = (value, name) => {
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    if (
      !formData ||
      !formData.nom ||
      !formData.prenom ||
      !formData.matricule ||
      !formData.corps ||
      !formData.grade ||
      !formData.indice
    ) {
      message.error("Veuillez remplir tous les champs obligatoires !");
      return;
    }

    try {
      const username = localStorage.getItem("username") || "Utilisateur";
      const updatedData = {
        ...formData,
        certificat: {
          ...(formData.certificat || {}),
          modif_par: username,
        },
      };

      const response = await fetch(
        `http://192.168.88.28:8087/agentsCas/modifier/${formData.matricule}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updatedData),
        }
      );

      const responseText = await response.text();
      if (response.ok) {
        Swal.fire({
          icon: "success",
          title: "Succès !",
          text: "Certificat modifié avec succès.",
          confirmButtonText: "OK",
        });
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
        text: error.message || "Impossible de contacter le serveur.",
        confirmButtonText: "OK",
      });
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
          Modification de la Certificat Administratif du Solde
        </div>
      }
      centered
      open={open}
      onCancel={onClose}
      width={750}
      className="custom-modal"
      footer={null}
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
          <Col span={12} className="form-container">
            <h5>Informations de l'agent</h5>
            <Form layout="vertical">
              <Form.Item label="Matricule">
                <Input
                  name="matricule"
                  value={formData.matricule || ""}
                  disabled
                  style={{ color: "black" }}
                />
              </Form.Item>
              <Form.Item label="Nom">
                <Input
                  name="nom"
                  value={formData.nom || ""}
                  onChange={(e) => handleChangeMain(e.target.value, "nom")}
                />
              </Form.Item>
              <Form.Item label="Prénom">
                <Input
                  name="prenom"
                  value={formData.prenom || ""}
                  onChange={(e) => handleChangeMain(e.target.value, "prenom")}
                />
              </Form.Item>
              <Row gutter={16}>
                <Col span={8}>
                  <Form.Item label="Corps">
                    <Select
                      value={formData.corps || ""}
                      onChange={handleCorpsChange}
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
                  <Form.Item label="Grade">
                    <Select
                      value={formData.grade || ""}
                      onChange={handleGradeChange}
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
                  <Form.Item label="Indice">
                    <Input
                      name="indice"
                      value={formData.indice || ""}
                      disabled
                      style={{ color: "black" }}
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
                      onChange={(value) => handleChangeMain(value, "chapitre")}
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
                      value={formData.localite || ""}
                      onChange={handleLocaliteChange}
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
                <Col span={12}>
                  <Form.Item label="Date de début">
                    <Input
                      type="date"
                      name="dateDebut"
                      value={formData.dateDebut || ""}
                      onChange={(e) =>
                        handleChangeMain(e.target.value, "dateDebut")
                      }
                    />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label="Date de fin">
                    <Input
                      type="date"
                      name="dateFin"
                      value={formData.dateFin || ""}
                      onChange={(e) =>
                        handleChangeMain(e.target.value, "dateFin")
                      }
                    />
                  </Form.Item>
                </Col>
              </Row>
              <Form.Item label="Date de prise">
                <Input
                  type="date"
                  name="datePrise"
                  value={formData.datePrise || ""}
                  onChange={(e) =>
                    handleChangeMain(e.target.value, "datePrise")
                  }
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
                  onChange={(e) =>
                    handleChangeMain(e.target.value, "referenceActe")
                  }
                />
              </Form.Item>
              <Form.Item label="Date de l'acte">
                <Input
                  type="date"
                  name="dateActe"
                  value={formData.dateActe || ""}
                  onChange={(e) => handleChangeMain(e.target.value, "dateActe")}
                />
              </Form.Item>
              <Form.Item label="Acte">
                <Select
                  name="acte"
                  value={formData.acte || ""}
                  onChange={(value) => handleChangeMain(value, "acte")}
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
      )}

      <div style={{ display: "flex", justifyContent: "center" }}>
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

export default ModalModification;
