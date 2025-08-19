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
  Tooltip,
  message,
  Tag,
} from "antd";
import { RiFileEditFill } from "react-icons/ri";
import { IoCreate } from "react-icons/io5";
import Swal from "sweetalert2";
import ModalCreation from "./ModalCreation";
import ModalModifCap from "./ModalModifCap";
import OpenPDFButton from "./Pdf";

const { Content } = Layout;
const { Title } = Typography;
const { Option } = Select;

export default function ContentSection() {
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showModalModif, setShowModalModif] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedAgent, setSelectedAgent] = useState(null);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [formData, setFormData] = useState({
    civilite: "",
    num_pension: "",
    nom: "",
    prenom: "",
    caisse: "",
    assignation: "",
    additionalInfo: "",
  });
  const [formFields, setFormFields] = useState([]);
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [messageApi, contextHolder] = message.useMessage();

  const fetchAgents = async () => {
    try {
      setLoading(true);
      const response = await axios.get("http://localhost:8087/agents/all");
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

  const handlePrint = async (certificatId) => {
    try {
      const username = localStorage.getItem("username");
      const token = localStorage.getItem("token");

      // Mettre à jour la date d'impression
      await axios.put(
        `http://localhost:8087/certificats/${certificatId}/imprimer`,
        null,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "X-User": username,
          },
        }
      );

      // Rafraîchir les données
      await fetchAgents();
      messageApi.success("Certificat imprimé avec succès");
    } catch (error) {
      console.error("Erreur d'impression:", error);
      messageApi.error(
        error.response?.data?.message || "Erreur lors de l'impression"
      );
    }
  };

  const formatTableData = () => {
    return users.map((user) => ({
      key: user.idAgent,
      civilite: user.civilite || "-",
      id_certificat: user.certificat?.id_certificat || "-",
      nom: user.nom || "-",
      prenom: user.prenom || "-",
      num_pension: user.num_pension || "-",
      date_creation: user.certificat?.date_creation || "-",
      date_impression: user.certificat?.dateImpression || "-",
      caisse: user.caisse || "N/A",
      assignation: user.assignation || "-",
      additionalInfo: user.additionalInfo || "-",
      ajout_par: user.certificat?.ajout_par || "N/A",
      modif_par: user.certificat?.modif_par || "N/A",
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
      user.civilite?.toLowerCase().includes(searchTerm) ||
      user.id_certificat?.toString().includes(searchTerm) ||
      searchInDate(user.date_creation, searchTerm) ||
      searchInDate(user.date_impression, searchTerm) ||
      user.nom?.toLowerCase().includes(searchTerm) ||
      user.prenom?.toLowerCase().includes(searchTerm) ||
      user.num_pension?.toLowerCase().includes(searchTerm) ||
      user.assignation?.toLowerCase().includes(searchTerm) ||
      user.additionalInfo?.toLowerCase().includes(searchTerm) ||
      user.ajout_par?.toLowerCase().includes(searchTerm) ||
      user.modif_par?.toLowerCase().includes(searchTerm) ||
      user.sesituer?.some((item) =>
        item?.rubrique?.id_rubrique?.toString().includes(searchTerm)
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
      defaultSortOrder: "ascend",
    },
    {
      title: "Date de Création",
      dataIndex: "date_creation",
      sorter: (a, b) => new Date(a.date_creation) - new Date(b.date_creation),
      render: (date) =>
        date ? new Date(date).toLocaleDateString("fr-FR") : "Non spécifié",
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
      sorter: (a, b) => a.caisse.localeCompare(b.caisse),
      render: (text) => text || "N/A",
    },
    {
      title: "AdditionalInfo",
      dataIndex: "additionalInfo",
      sorter: (a, b) => a.additionalInfo.localeCompare(b.additionalInfo),
    },
    {
      title: "Ajouté par",
      dataIndex: "ajout_par",
      sorter: (a, b) => a.ajout_par.localeCompare(b.ajout_par),
      render: (text) => text || "N/A",
    },
    {
      title: "Modifié par",
      dataIndex: "modif_par",
      sorter: (a, b) => a.modif_par.localeCompare(b.modif_par),
      render: (text) => text || "N/A",
    },
    {
      title: "Statut Impression",
      dataIndex: "date_impression",
      render: (date) => (
        <Tag color={date && date !== "-" ? "green" : "orange"}>
          {date && date !== "-"
            ? `Imprimé le ${new Date(date).toLocaleDateString()}`
            : "Non Imprimé"}
        </Tag>
      ),
    },
    {
      title: "Actions",
      fixed: "right",
      width: 120,
      render: (_, record) => {
        return (
          <div
            style={{ display: "flex", justifyContent: "center", gap: "8px" }}
          >
            <Tooltip title="Modifier ce certificat">
              <Button
                type="primary"
                onClick={() => handleShowEditModal(record)}
              >
                <RiFileEditFill size={15} />
              </Button>
            </Tooltip>

            <OpenPDFButton
              data={record}
              onBeforePrint={() => handlePrint(record.id_certificat)}
              label="Imprimer"
            />
          </div>
        );
      },
    },
  ];

  return (
    <Content className="content">
      {contextHolder}
      <Title
        level={2}
        style={{
          color: "#1e88e5",
          marginBottom: "20px",
        }}
      >
        Certificat Administratif de la Pension
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
              <Input
                type="search"
                placeholder="🔍 Rechercher... "
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
                  showSizeChanger: false,
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
                  onBeforePrint={() => {
                    const certificatIds = filteredData
                      .filter((item) => selectedRowKeys.includes(item.key))
                      .map((item) => item.id_certificat);

                    Promise.all(certificatIds.map((id) => handlePrint(id)));
                  }}
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

      <ModalCreation
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

      <ModalModifCap
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
