import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Layout,
  Typography,
  Table,
  Input,
  Button,
  Spin,
  Card,
  Tooltip,
} from "antd";
import { RiFileEditFill } from "react-icons/ri";
import { IoCreate } from "react-icons/io5";
import { FaFilePen } from "react-icons/fa6";
import Swal from "sweetalert2";
import ModalCreationCcps from "./ModalCreationCcps";
import ModalModifCcps from "./ModalModifCcps";
import ModalRectificatif from "./ModalRectificatifCcps";
import OpenPDFButton from "./PdfCcps";

const { Content } = Layout;
const { Title } = Typography;

export default function ContentSection() {
  const [loading, setLoading] = useState(true);
  const [showModalCreation, setShowModalCreation] = useState(false);
  const [showModalModif, setShowModalModif] = useState(false);
  const [showModalRectificatif, setShowModalRectificatif] = useState(false);
  const [selectedAgent, setSelectedAgent] = useState(null);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);

  const [formData, setFormData] = useState({
    matricule: "",
    civilite: "",
    nom: "",
    prenom: "",
    enfant: "",
    localite: "",
    cessationService: "",
    corps: "",
    grade: "",
    indice: "",
    zone: "",
    chapitre: "",
    article: "",
    acte: "",
    referenceActe: "",
    dateActe: "",
    dateCessation: "",
    dateFinPai: "",
    montant: "",
    referenceRecette: "",
    dateOrdreRecette: "",
    dateDebut: "",
    dateDernierPai: "",
  });
  const [formFields, setFormFields] = useState([]);
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchAgents = async () => {
    try {
      setLoading(true);
      const response = await axios.get("http://192.168.88.47:8087/agentsCcps/all");
      setUsers(response.data);
    } catch (error) {
      console.error("Erreur lors de la récupération des utilisateurs :", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAgents();
  }, []);

  // Fonctions d'ouverture spécifiques
  const handleOpenModalCreation = () => setShowModalCreation(true);

  const handleOpenModalModif = (agent) => {
    setSelectedAgent(agent);
    setShowModalModif(true);
  };

  const handleOpenModalRectificatif = (agent) => {
    setSelectedAgent(agent);
    setShowModalRectificatif(true);
  };

  // Fonctions de fermeture spécifiques
  const handleCloseModalCreation = () => {
    setFormData({
      matricule: "",
      civilite: "",
      nom: "",
      prenom: "",
      enfant: "",
      localite: "",
      cessationService: "",
      corps: "",
      grade: "",
      indice: "",
      zone: "",
      chapitre: "",
      article: "",
      acte: "",
      referenceActe: "",
      dateActe: "",
      dateCessation: "",
      dateFinPai: "",
      montant: "",
      referenceRecette: "",
      dateOrdreRecette: "",
      dateDebut: "",
      dateDernierPai: "",
    });
    setFormFields([]);
    setShowModalCreation(false);
  };

  const handleCloseModalModif = () => {
    setShowModalModif(false);
    setSelectedAgent(null);
  };

  const handleCloseModalRectificatif = () => {
    setShowModalRectificatif(false);
    setSelectedAgent(null);
  };

  const handleSearch = (event) => {
    setSearchTerm(event.target.value.toLowerCase());
  };

  const handleShowEditModal = (agent) => {
    Swal.fire({
      title: "Êtes-vous sûr?",
      text: "Vous allez modifier ce certificat !",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Oui",
      cancelButtonText: "Annuler",
    }).then((result) => {
      if (result.isConfirmed) {
        handleOpenModalModif(agent);
      }
    });
  };

  const handleShowRectificatifModal = (agent) => {
    Swal.fire({
      title: "Êtes-vous sûr?",
      text: "Vous allez rectifier ce certificat !",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Oui",
      cancelButtonText: "Annuler",
    }).then((result) => {
      if (result.isConfirmed) {
        handleOpenModalRectificatif(agent);
      }
    });
  };

  const formatTableData = () => {
    return users.map((user) => ({
      key: user.matricule,
      matricule: user.matricule || "",
      civilite: user.civilite || "",
      nom: user.nom || "",
      prenom: user.prenom || "",
      enfant: user.enfant || "",
      localite: user.localite || "",
      cessationService: user.cessationService || "",
      corps: user.corps || "",
      grade: user.grade || "",
      indice: user.indice || "",
      zone: user.zone || "",
      chapitre: user.chapitre || "",
      article: user.article || "",
      acte: user.acte || "",
      referenceActe: user.referenceActe || "",
      dateActe: user.dateActe || "",
      dateCessation: user.dateCessation || "",
      dateFinPai: user.dateFinPai || "",
      montant: user.montant || "",
      referenceRecette: user.referenceRecette || "",
      dateOrdreRecette: user.dateOrdreRecette || "",
      dateDebut: user.dateDebut || "",
      dateDernierPai: user.dateDernierPai || "",
      idCertificat: user.certificat.id_certificat || "",
      dateCreation: user.certificat.date_creation || "",
      ajoutPar: user.certificat.ajout_par || "N/A",
      modifPar: user.certificat.modif_par || "N/A",
      sesituer: user.sesituer || [],
    }));
  };

  const searchInDate = (dateString, searchTerm) => {
    if (!dateString) return false;
    try {
      return new Date(dateString).toLocaleDateString().includes(searchTerm);
    } catch {
      return false;
    }
  };

  const filteredData = formatTableData().filter(
    (user) =>
      searchTerm === "" ||
      user.matricule.toLowerCase().includes(searchTerm) ||
      user.idCertificat.toString().includes(searchTerm) ||
      user.civilite.toLowerCase().includes(searchTerm) ||
      user.nom.toLowerCase().includes(searchTerm) ||
      user.prenom.toLowerCase().includes(searchTerm) ||
      user.enfant.toLowerCase().includes(searchTerm) ||
      user.localite.toLowerCase().includes(searchTerm) ||
      user.cessationService.toLowerCase().includes(searchTerm) ||
      user.corps.toLowerCase().includes(searchTerm) ||
      user.grade.toLowerCase().includes(searchTerm) ||
      user.indice.toLowerCase().includes(searchTerm) ||
      user.zone.toString().toLowerCase().includes(searchTerm) ||
      user.chapitre.toLowerCase().includes(searchTerm) ||
      user.article.toLowerCase().includes(searchTerm) ||
      user.acte.toLowerCase().includes(searchTerm) ||
      user.referenceActe.toLowerCase().includes(searchTerm) ||
      searchInDate(user.dateActe, searchTerm) ||
      searchInDate(user.dateCessation, searchTerm) ||
      searchInDate(user.dateFinPai, searchTerm) ||
      searchInDate(user.dateOrdreRecette, searchTerm) ||
      searchInDate(user.dateDebut, searchTerm) ||
      searchInDate(user.dateDernierPai, searchTerm) ||
      searchInDate(user.dateCreation, searchTerm) ||
      user.montant.toString().toLowerCase().includes(searchTerm) ||
      user.referenceRecette.toLowerCase().includes(searchTerm) ||
      user.ajoutPar.toLowerCase().includes(searchTerm) ||
      user.modifPar.toLowerCase().includes(searchTerm) ||
      user.sesituer.some((item) =>
        item.rubrique?.id_rubrique.toString().includes(searchTerm)
      )
  );

  const rowSelection = {
    selectedRowKeys,
    onChange: (selectedKeys) => {
      setSelectedRowKeys(selectedKeys);
    },
    preserveSelectedRowKeys: true,
  };

  const hasSelected = selectedRowKeys.length > 0;

  const formatDate = (date) => {
    return date ? new Date(date).toLocaleDateString("fr-FR") : "Aucun";
  };

  const columns = [
    {
      title: "N°Certificat",
      dataIndex: "idCertificat",
      sorter: (a, b) => a.idCertificat.localeCompare(b.idCertificat),
      defaultSortOrder: "ascend",
    },
    {
      title: "Date de Création",
      dataIndex: "dateCreation",
      sorter: (a, b) => a.dateCreation.localeCompare(b.dateCreation),
      render: (date) => formatDate(date),
    },
    {
      title: "Matricule",
      dataIndex: "matricule",
      sorter: (a, b) => a.matricule.localeCompare(b.matricule),
    },
    {
      title: "Nom",
      dataIndex: "nom",
      sorter: (a, b) => a.nom.localeCompare(b.nom),
    },
    {
      title: "Prénom",
      dataIndex: "prenom",
      sorter: (a, b) => a.prenom.localeCompare(b.prenom),
    },
    {
      title: "Date Début",
      dataIndex: "dateDebut",
      sorter: (a, b) => a.dateDebut.localeCompare(b.dateDebut),
      render: (date) => formatDate(date),
    },
    {
      title: "Date Acte",
      dataIndex: "dateActe",
      sorter: (a, b) => a.dateActe.localeCompare(b.dateActe),
      render: (date) => formatDate(date),
    },
    {
      title: "Date Fin",
      dataIndex: "dateFinPai",
      sorter: (a, b) => a.dateFinPai.localeCompare(b.dateFinPai),
      render: (date) => formatDate(date),
    },
    {
      title: "Ajouté par",
      dataIndex: "ajoutPar",
      sorter: (a, b) => a.ajoutPar.localeCompare(b.ajoutPar),
      render: (text) => text || "N/A",
    },
    {
      title: "Modifié par",
      dataIndex: "modifPar",
      sorter: (a, b) => a.modifPar.localeCompare(b.modifPar),
      render: (text) => text || "N/A",
    },
    {
      title: "Actions",
      fixed: "right",
      width: 100,
      render: (_, record) => (
        <div style={{ display: "flex", justifyContent: "center" }}>
          <Tooltip title="Modifier ce certificat">
            <Button type="primary" onClick={() => handleShowEditModal(record)}>
              <RiFileEditFill size={15} />
            </Button>
          </Tooltip>
          <Tooltip title="Rectifier ce certificat">
            <Button
              style={{ marginLeft: "10px", backgroundColor: "#00bcd4", borderColor: "#00bcd4" }}
              type="primary"
              onClick={() => handleShowRectificatifModal(record)}
            >
              <FaFilePen size={15} />
            </Button>
          </Tooltip>

          <OpenPDFButton data={record} label="Imprimer" />
        </div>
      ),
    },
  ];

  return (
    <Content className="content">
      <Title
        level={2}
        style={{
          color: "#1e88e5",
          marginBottom: "20px",
        }}
      >
        Certificat de Cessation de Paiement de la Solde
      </Title>

      {loading ? (
        <div style={{ textAlign: "center", padding: "20px" }}>
          <Spin size="large" />
          <p>Chargement des données...</p>
        </div>
      ) : (
        <Card>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: "10px",
            }}
          >
            <Input
              type="search"
              placeholder="🔍 Rechercher..."
              onChange={handleSearch}
              style={{
                width: "200px",
                borderRadius: "6px",
                borderColor: "#cfd8dc",
              }}
            />
            <Button type="primary" onClick={handleOpenModalCreation}>
              <IoCreate size={20} />
              Nouveau certificat
            </Button>
          </div>

          {filteredData.length === 0 ? (
            <div style={{ textAlign: "center", padding: "20px" }}>
              <p>Aucun certificat trouvé.</p>
            </div>
          ) : (
            <div className="tableau">
              <Table
                bordered
                size="middle"
                dataSource={filteredData}
                rowSelection={rowSelection}
                columns={columns}
                rowKey="key"
                pagination={{
                  pageSize: 20,
                  position: ["bottomRight"],
                }}
                scroll={{ x: "max-content" }}
                rowClassName={() => "table-row-hover"}
                className="styled-table"
              />

              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  gap: "10px",
                }}
              >
                <OpenPDFButton
                  data={filteredData.filter((item) =>
                    selectedRowKeys.includes(item.key)
                  )}
                  label="Imprimer"
                />
                {hasSelected && (
                  <span>
                    {selectedRowKeys.length} certificat(s) sélectionné(s)
                  </span>
                )}
              </div>
            </div>
          )}
        </Card>
      )}

      <ModalCreationCcps
        open={showModalCreation}
        onClose={handleCloseModalCreation}
        formData={formData}
        setFormData={setFormData}
        formFields={formFields}
        setFormFields={setFormFields}
        onSuccess={() => {
          fetchAgents();
          handleCloseModalCreation();
        }}
      />

      <ModalModifCcps
        open={showModalModif}
        onClose={handleCloseModalModif}
        formData={selectedAgent}
        setFormData={setSelectedAgent}
        onSuccess={() => {
          fetchAgents();
          handleCloseModalModif();
        }}
      />

      <ModalRectificatif
        open={showModalRectificatif}
        onClose={handleCloseModalRectificatif}
        formData={selectedAgent}
        setFormData={setSelectedAgent}
        onSuccess={() => {
          fetchAgents();
          handleCloseModalRectificatif();
        }}
      />
    </Content>
  );
}