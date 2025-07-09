import React, { useState, useEffect } from "react";
import axios from "axios";
import { Layout, Typography, Table, Input, Button, Spin, Card } from "antd";
import { RiFileEditFill } from "react-icons/ri";
import { IoCreate } from "react-icons/io5";
import Swal from "sweetalert2";
/* import OpenPDFButton from "./Pdf"; */
import ModalCreationCas from "./ModalCreationCas";
import ModalModifCas from "./ModalModifCas";
import OpenPDFButton from "./PdfCas"

const { Content } = Layout;
const { Title } = Typography;

export default function ContentSection({ darkTheme }) {
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAgent, setSelectedAgent] = useState(null);

  const [selectedRowKeys, setSelectedRowKeys] = useState([]);

  const [formData, setFormData] = useState({
    matricule: "",
    nom: "",
    prenom: "",
    corps: "",
    grade: "",
    indice: "",
    chapitre: "",
    localite: "",
    dateDebut: "",
    dateFin: "",
    datePrise: "",
    reference_acte: "",
    date_acte: "",
    acte: "",
  });
  const [formFields, setFormFields] = useState([]);
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchAgents = async () => {
    try {
      setLoading(true);
      const response = await axios.get("http://192.168.88.53:8088/agentsCas/all");
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

  const handleShowCreateModal = () => setShowModal(true);
  const handleCloseModal = () => {
    setFormData({
      matricule: "",
      nom: "",
      prenom: "",
      corps: "",
      grade: "",
      indice: "",
      chapitre: "",
      localite: "",
      dateDebut: "",
      dateFin: "",
      datePrise: "",
      referenceActe: "",
      dateActe: "",
      acte: "",
    });
    setFormFields([]);
    setShowModal(false);
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
        setSelectedAgent(agent);
        setIsModalOpen(true); // Ouvre le modal de modification
      }
    });
  };

  const formatTableData = () => {
    return users.map((user) => ({
      key: user.idAgent,
      matricule: user.matricule || "-",
      nom: user.nom || "-",
      prenom: user.prenom || "-",
      corps: user.corps || "-",
      grade: user.grade || "-",
      indice: user.indice || "-",
      chapitre: user.chapitre || "-",
      localite: user.localite || "-",
      dateDebut: user.dateDebut || "-",
      dateFin: user.dateFin || "-",
      datePrise: user.datePrise || "-",
      referenceActe: user.referenceActe || "-",
      dateActe: user.dateActe || "-",
      acte: user.acte || "-",
      idCertificat: user.certificat.idCertificat || "-",
      ajoutPar: user.certificat.ajoutPar || "N/A",
      modifPar: user.certificat.modifPar || "N/A",
    }));
  };

  const filteredData = formatTableData().filter(
    (user) =>
      searchTerm === "" ||
      user.matricule.toLowerCase().includes(searchTerm) ||
      user.idCertificat.toLowerCase().includes(searchTerm) ||
      user.nom.toLowerCase().includes(searchTerm) ||
      user.prenom.toLowerCase().includes(searchTerm) ||
      user.corps.toLowerCase().includes(searchTerm) ||
      user.grade.toLowerCase().includes(searchTerm) ||
      user.indice.toLowerCase().includes(searchTerm) ||
      user.chapitre.toLowerCase().includes(searchTerm) ||
      user.localite.toLowerCase().includes(searchTerm) ||
      user.dateDebut.toLowerCase().includes(searchTerm) ||
      user.dateFin.toLowerCase().includes(searchTerm) ||
      user.datePrise.toLowerCase().includes(searchTerm) ||
      user.referenceActe.toLowerCase().includes(searchTerm) ||
      user.dateActe.toLowerCase().includes(searchTerm) ||
      user.acte.toLowerCase().includes(searchTerm) ||
      user.ajoutPar.toLowerCase().includes(searchTerm) ||
      user.modifPar.toLowerCase().includes(searchTerm)
  );


  const rowSelection = {
    selectedRowKeys,
    onChange: (selectedKeys) => {
      setSelectedRowKeys(selectedKeys);
    },
    preserveSelectedRowKeys: true,
  };


  const hasSelected = selectedRowKeys.length > 0;

  const columns = [
    {
      title: "N°Certificat",
      dataIndex: "idCertificat",
      sorter: (a, b) => a.idCertificat.localeCompare(b.idCertificat),
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
      title: "Localité",
      dataIndex: "localite",
      sorter: (a, b) => a.localite.localeCompare(b.localite),
    },
    {
      title: "Acte",
      dataIndex: "acte",
      sorter: (a, b) => a.acte.localeCompare(b.acte),
    },
    {
      title: "Date de prise en Charge",
      dataIndex: "datePrise",
      sorter: (a, b) => a.datePrise.localeCompare(b.datePrise),
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
          <Button type="primary" onClick={() => handleShowEditModal(record)}>
            <RiFileEditFill size={15} />
          </Button>
          <OpenPDFButton data={record} />
        </div>
      ),
    },
  ];

  return (
    <Content
      style={{
        marginLeft: "10px",
        marginTop: "10px",
        padding: "24px",
        background: darkTheme ? "#001529" : "#fff",
        color: darkTheme ? "#ffffff" : "#000000",
        borderRadius: "10px 0 0 0",
        minHeight: "280px",
      }}
    >
      <Title level={2} style={{ color: darkTheme ? "#ffffff" : "#000000" }}>
        Certificat Administratif de la Solde
      </Title>

      {loading ? (
        <div style={{ textAlign: "center", padding: "20px" }}>
          <Spin size="large" />
          <p>Chargement des données...</p>
        </div>
      ) : (
        <Card>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "10px" }}>
            <Input
              type="search"
              placeholder="Rechercher..."
              onChange={handleSearch}
              style={{ width: "200px" }}
            />
            <Button type="primary" onClick={handleShowCreateModal}>
              <IoCreate size={20} />
              Créer un nouveau certificat
            </Button>
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
                rowKey="idCertificat"
                pagination={{
                  pageSize: 4,
                  position: ["bottomRight"],
                }}
                scroll={{ x: "max-content" }}
              />

              <div style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                gap: "10px"
              }}>
                <OpenPDFButton
                  data={filteredData.filter((item) => selectedRowKeys.includes(item.idCertificat))}
                  label="Imprimer"
                  disabled={selectedRowKeys.length === 0}
                />

                {hasSelected && (
                  <span>{selectedRowKeys.length} certificat(s) sélectionné(s)</span>
                )}
              </div>
            </>
          )}
        </Card>
      )}

      {/* Modal de création */}
      <ModalCreationCas
        open={showModal}
        onClose={handleCloseModal}
        formData={formData}
        setFormData={setFormData}
        formFields={formFields}
        setFormFields={setFormFields}
        onSuccess={() => {
          fetchAgents();
          handleCloseModal();
        }}
      />

      {/* Modal de modification */}
      <ModalModifCas
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        formData={selectedAgent} // Passer selectedAgent ici
        setFormData={setSelectedAgent}
        onSuccess={() => {
          fetchAgents();
          setIsModalOpen(false); // Fermer le modal après une modification réussie
        }}
      />
    </Content>
  );
}
