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
import Swal from "sweetalert2";
import ModalModifCcpsRect from "./ModalModifCcpsRectif";
import OpenPDFButton from "./PdfCcpsRect";

const { Content } = Layout;
const { Title } = Typography;

export default function ContentSection() {
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false); 
  const [selectedAgent, setSelectedAgent] = useState(null);

  const [selectedRowKeys, setSelectedRowKeys] = useState([]);

  const [formData, setFormData] = useState({
    matricule: "",
    idCertificatRect: "",
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
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchAgentsRect = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        "http://192.168.88.58:8087/agentsCcpsRect/all"
      );
      setUsers(response.data);
    } catch (error) {
      console.error("Erreur lors de la récupération des utilisateurs :", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAgentsRect();
  }, []);

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
        setSelectedAgent(agent);
        setIsModalOpen(true); // Ouvre le modal de modification
      }
    });
  };

  const formatTableData = () => {
    return users.map((user) => ({
      key: user.matricule,
      matricule: user.matricule || "",
      civilite: user.civilite || "",
      idCertificatRect: user.idCertificatRect || "",
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
      dateCessation: user.dateCessation || "-",
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
      user.idCertificatRect.toString().includes(searchTerm) ||
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
      title: "Date Fin",
      dataIndex: "dateFinPai",
      sorter: (a, b) => a.dateFinPai.localeCompare(b.dateFinPai),
      render: (date) => formatDate(date),
    },
    {
      title: "Réctifié par",
      dataIndex: "ajoutPar",
      sorter: (a, b) => a.ajoutPar.localeCompare(b.ajoutPar),
      render: (text) => text || "N/A",
    },
    {
      title: "ID Certificat Réctifier",
      dataIndex: "idCertificatRect",
      sorter: (a, b) => a.idCertificatRect.localeCompare(b.idCertificatRect),
    },
    {
      title: "Actions",
      fixed: "right",
      width: 100,
      render: (_, record) => (
        <div style={{ display: "flex", justifyContent: "center" }}>
          <Tooltip title="Modifier cette certificat">
            <Button type="primary" onClick={() => handleShowEditModal(record)}>
              <RiFileEditFill size={15} />
            </Button>
          </Tooltip>

          <OpenPDFButton data={record} label="Imprimer" />
        </div>
      ),
    },
  ];

  return (
    <Content
      style={{
        marginLeft: "10px",
        marginRight: "10px",
        marginTop: "10px",
        padding: "24px",
        background: "#f4f6fc",
        color: "#000",
        borderRadius: "12px",
        minHeight: "280px",
        boxShadow: "0 2px 8px rgba(0, 0, 0, 0.05)",
      }}
    >
      <Title
        level={2}
        style={{
          color: "#1e88e5",
          marginBottom: "20px",
        }}
      >
        Certificat de Cessation de Paiement de la Solde Réctificatif
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
          </div>

          {filteredData.length === 0 ? (
            <div style={{ textAlign: "center", padding: "20px" }}>
              <p>Aucun certificat trouvé.</p>
            </div>
          ) : (
            <>
              <Table
                bordered
                size="middle"
                dataSource={filteredData}
                rowSelection={rowSelection}
                columns={columns}
                rowKey="key"
                pagination={{
                  pageSize: 4,
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
            </>
          )}
        </Card>
      )}

      <ModalModifCcpsRect
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        formData={selectedAgent}
        setFormData={setSelectedAgent}
        onSuccess={() => {
          fetchAgentsRect();
          setIsModalOpen(false);
        }}
      />
    </Content>
  );
}
