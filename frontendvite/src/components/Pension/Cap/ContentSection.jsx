import React, { useState, useEffect } from "react";
import axios from "axios";
import { Layout, Typography, Table, Input, Button, Spin, Card } from "antd";
import { RiFileEditFill } from "react-icons/ri";
import { IoCreate } from "react-icons/io5";
import Swal from "sweetalert2";
import ModalCreation from "./ModalCreation";
import ModalModifCap from "./ModalModifCap";
import OpenPDFButton from "./Pdf";

const { Content } = Layout;
const { Title } = Typography;

export default function ContentSection({ darkTheme }) {
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
  });
  const [formFields, setFormFields] = useState([]);
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchAgents = async () => {
    try {
      setLoading(true);
      const response = await axios.get("http://192.168.88.53:8088/agents/all");
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
      defaultSortOrder: 'ascend',  // Tri croissant par défaut
    },
    {
      title: "Date de Création",
      dataIndex: "date_creation",
      sorter: (a, b) => new Date(a.date_creation) - new Date(b.date_creation),
      render: (text) => text || "Non spécifié",
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
      title: "Assignation",
      dataIndex: "assignation",
      sorter: (a, b) => a.assignation.localeCompare(b.assignation),
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
      title: "Actions",
      fixed: 'right',
      width: 100,
      render: (_, record) => {
        return (
          <div style={{ display: "flex", justifyContent: "center" }}>
            <Button type="primary" onClick={() => handleShowEditModal(record)}>
              <RiFileEditFill size={15} />
            </Button>

            <OpenPDFButton data={record} />
          </div>
        );
      },
    },
  ];


  return (
    <Content style={{ marginLeft: "10px", marginTop: "10px", padding: "24px", background: darkTheme ? "#001529" : "#fff", color: darkTheme ? "#ffffff" : "#000000", borderRadius: "10px 0 0 0", minHeight: "280px" }}>
      <Title level={2} style={{ color: darkTheme ? "#ffffff" : "#000000" }}>
        Certificat Administratif de la Pension
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
                rowKey="key"
                pagination={{ pageSize: 4, position: ["bottomRight"] }}
                scroll={{ x: "max-content" }}
              />

              <div style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                gap: "10px"
              }}>
                <OpenPDFButton
                  data={filteredData.filter((item) => selectedRowKeys.includes(item.key))}
                  label="Imprimer"
                />
                {hasSelected && (
                  <span>{selectedRowKeys.length} certificat(s) sélectionné(s)</span>
                )}
              </div>
              
            </>
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
