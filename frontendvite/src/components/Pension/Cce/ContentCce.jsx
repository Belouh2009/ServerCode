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
  Select,
} from "antd";
import { RiFileEditFill } from "react-icons/ri";
import { IoCreate } from "react-icons/io5";
import Swal from "sweetalert2";
import ModalCreationCce from "./ModalCreationCce";
import ModalModifCce from "./ModalModifCce";
import OpenPDFButtonCce from "./PdfCce";

const { Content } = Layout;
const { Title } = Typography;
const { Option } = Select;

export default function ContentSection() {
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showModalModif, setShowModalModif] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedAgent, setSelectedAgent] = useState(null);
  const [pageSize, setPageSize] = useState(5);

  const [selectedRowKeys, setSelectedRowKeys] = useState([]);

  const [formData, setFormData] = useState({
    civilite: "",
    num_pension: "",
    nom: "",
    prenom: "",
    caisse: "",
    assignation: "",
    additionalInfo: "",
    dateAnnulation: "",
    dateDece: "",
  });
  const [formFields, setFormFields] = useState([]);
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchAgents = async () => {
    try {
      setLoading(true);
      const response = await axios.get("http://localhost:8087/agentsCce/all");
      console.log(response.data); // Vérifie la structure des données renvoyées
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
      civilite: "",
      num_pension: "",
      nom: "",
      prenom: "",
      caisse: "",
      assignation: "",
      additionalInfo: "",
      dateAnnulation: "",
      dateDece: "",
    });
    setFormFields([]);
    setShowModal(false);
    setShowModalModif(false);
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
        setIsEditing(true);
        setShowModalModif(true);
      }
    });
  };

  const formatTableData = () => {
    return users.map((user) => ({
      key: user.idAgent,
      civilite: user.civilite || "-",
      id_certificat: user.certificat.id_certificat || "-",
      nom: user.nom || "-",
      prenom: user.prenom || "-",
      num_pension: user.num_pension || "-",
      date_creation: user.certificat.date_creation || "-",
      caisse: user.caisse || "N/A",
      assignation: user.assignation || "-",
      additionalInfo: user.additionalInfo || "-",
      dateAnnulation: user.dateAnnulation || "-",
      dateDece: user.dateDece || "-",
      ajout_par: user.certificat.ajout_par || "N/A",
      modif_par: user.certificat.modif_par || "N/A",
      sesituer: user.sesituer || [],
    }));
  };

  const filteredData = formatTableData().filter(
    (user) =>
      searchTerm === "" ||
      user.civilite.toLowerCase().includes(searchTerm) ||
      user.id_certificat.toString().includes(searchTerm) ||
      user.nom.toLowerCase().includes(searchTerm) ||
      user.prenom.toLowerCase().includes(searchTerm) ||
      user.num_pension.toLowerCase().includes(searchTerm) ||
      user.assignation.toLowerCase().includes(searchTerm) ||
      user.additionalInfo.toLowerCase().includes(searchTerm) ||
      user.dateAnnulation.toLowerCase().includes(searchTerm) ||
      user.dateDece.toLowerCase().includes(searchTerm) ||
      user.ajout_par.toLowerCase().includes(searchTerm) ||
      user.modif_par.toLowerCase().includes(searchTerm) ||
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

  const columns = [
    {
      title: "ID Certificat",
      dataIndex: "id_certificat",
      sorter: (a, b) => a.id_certificat.localeCompare(b.id_certificat),
      defaultSortOrder: "ascend", // Tri croissant par défaut
    },
    {
      title: "Date de Création",
      dataIndex: "date_creation",
      render: (text) => text || "Non spécifié",
      sorter: (a, b) => a.date_creation.localeCompare(b.date_creation),
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
      title: "N° Pension",
      dataIndex: "num_pension",
      sorter: (a, b) => a.num_pension.localeCompare(b.num_pension),
    },

    {
      title: "Caisse",
      dataIndex: "caisse",
      render: (text) => text || "N/A",
      sorter: (a, b) => a.caisse.localeCompare(b.caisse),
    },
    {
      title: "Date d'annulation",
      dataIndex: "dateAnnulation",
      sorter: (a, b) => a.dateAnnulation.localeCompare(b.dateAnnulation),
    },
    {
      title: "Assignation",
      dataIndex: "assignation",
      sorter: (a, b) => a.assignation.localeCompare(b.assignation),
    },
    {
      title: "AdditionalInfo",
      dataIndex: "additionalInfo",
      sorter: (a, b) => a.additionalInfo.localeCompare(b.additionalInfo),
    },
    {
      title: "Ajouté par",
      dataIndex: "ajout_par",
      render: (text) => text || "N/A",
      sorter: (a, b) => a.ajout_par.localeCompare(b.ajout_par),
    },
    {
      title: "Modifié par",
      dataIndex: "modif_par",
      render: (text) => text || "N/A",
      sorter: (a, b) => a.modif_par.localeCompare(b.modif_par),
    },
    /*         {
                    title: "Rubriques et Montants",
                    render: (_, record) => (
                        <div>
                            {record.sesituer && record.sesituer.length > 0 ? (
                                record.sesituer.map((item, index) => (
                                    <div key={index}>
                                        <span>
                                            <strong>({item.rubrique.id_rubrique})</strong>: {item.montant.toLocaleString()} Ar
                                        </span>
                                    </div>
                                ))
                            ) : (
                                <span>Aucune rubrique</span>
                            )}
                        </div>
                    ),
                }, */
    {
      title: "Actions",
      fixed: "right",
      width: 100,
      render: (_, record) => {
        return (
          <div style={{ display: "flex", justifyContent: "center" }}>
            <Button type="primary" onClick={() => handleShowEditModal(record)}>
              <RiFileEditFill size={15} />
            </Button>

            <OpenPDFButtonCce data={record} />
          </div>
        );
      },
    },
  ];

  return (
    <Content
      style={{
        marginLeft: "10px",
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
        Certificat de Cessation d'Emission
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
              flexWrap: "wrap",
              gap: "12px",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "16px",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
              }}
            >
              <Select
                defaultValue={10}
                onChange={(value) => setPageSize(value)}
                style={{ width: 120 }}
              >
                <Option value={10}>10</Option>
                <Option value={20}>20</Option>
                <Option value={30}>30</Option>
                <Option value={50}>50</Option>
              </Select>

              <Input
                type="search"
                placeholder="🔍 Rechercher..."
                onChange={handleSearch}
                style={{
                  width: "220px",
                  borderRadius: "6px",
                  borderColor: "#cfd8dc",
                }}
              />
            </div>

            <Button
              type="primary"
              onClick={handleShowCreateModal}
              style={{ whiteSpace: "nowrap" }}
            >
              <IoCreate size={20} style={{ marginRight: 6 }} />
              Créer un nouveau certificat
            </Button>
          </div>

          {filteredData.length === 0 ? (
            <div style={{ textAlign: "center", padding: "20px" }}>
              <p>Aucun certificat trouvé</p>
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
                pagination={{ pageSize, position: ["bottomRight"] }}
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
                <OpenPDFButtonCce
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

      {
        <ModalCreationCce
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
      }

      <ModalModifCce
        open={showModalModif}
        onClose={handleCloseModal}
        isEditing={isEditing}
        agent={selectedAgent}
        onSuccess={() => {
          fetchAgents();
          handleCloseModal();
        }}
      />
    </Content>
  );
}
