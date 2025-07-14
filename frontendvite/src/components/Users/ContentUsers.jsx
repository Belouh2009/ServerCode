import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Layout,
  Typography,
  Input,
  Button,
  Spin,
  Card,
  Form,
  Table,
  Select,
} from "antd";
import { FaCheck, FaTrash } from "react-icons/fa";
import Swal from "sweetalert2";

const { Content } = Layout;
const { Title } = Typography;

export default function ContentUsers({ status, setStatus }) {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [nonValideCount, setNonValideCount] = useState("");

  useEffect(() => {
    fetchUsers();
    updateNonValideCount();
  }, [status]);

  const updateNonValideCount = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8087/utilisateur/non-valide/count"
      );
      setNonValideCount(response.data);
    } catch (error) {
      console.error(
        "Erreur lors de la récupération du nombre d'utilisateurs non validés :",
        error
      );
    }
  };

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `http://localhost:8087/utilisateur?status=${status}`
      );
      setUsers(response.data);
    } catch (error) {
      console.error("Erreur lors de la récupération des utilisateurs :", error);
      Swal.fire("Erreur", "Impossible de récupérer les utilisateurs", "error");
    } finally {
      setLoading(false);
    }
  };

  const validateUtilisateur = async (matricule) => {
    Swal.fire({
      title: "Êtes-vous sûr ?",
      text: "Vous allez valider cet utilisateur.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Oui, valider",
      cancelButtonText: "Annuler",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const response = await axios.post(
            `http://localhost:8087/utilisateur/valide/${matricule}`
          );
          if (response.status === 200) {
            Swal.fire("Succès", "Utilisateur validé avec succès !", "success");
            setStatus("valid");
            fetchUsers();
            updateNonValideCount();
          }
        } catch (error) {
          console.error("Erreur lors de la validation :", error);
        }
      }
    });
  };

  const blockUtilisateur = async (matricule) => {
    Swal.fire({
      title: "Êtes-vous sûr ?",
      text: "Vous allez bloquer cet utilisateur. Il ne pourra plus se connecter.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Oui, bloquer",
      cancelButtonText: "Annuler",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const response = await axios.post(
            `http://localhost:8087/utilisateur/blocke/${matricule}`
          );
          if (response.status === 200) {
            Swal.fire("Bloqué", "Utilisateur bloqué avec succès !", "success");
            fetchUsers();
            updateNonValideCount();
          }
        } catch (error) {
          console.error("Erreur lors du blocage :", error);
          Swal.fire("Erreur", "Impossible de bloquer l'utilisateur", "error");
        }
      }
    });
  };

  const handleStatusChange = (value) => {
    setStatus(value);
  };

  const handleSearch = (event) => {
    setSearchQuery(event.target.value.toLowerCase());
  };

  const filteredUsers = users.filter(
    (user) =>
      user.matricule.toLowerCase().includes(searchQuery) ||
      user.nom.toLowerCase().includes(searchQuery) ||
      user.prenom.toLowerCase().includes(searchQuery) ||
      user.username.toLowerCase().includes(searchQuery) ||
      user.division.toLowerCase().includes(searchQuery) ||
      user.email.toLowerCase().includes(searchQuery)
  );

  const columns = [
    {
      title: "Matricule",
      dataIndex: "matricule",
      sorter: (a, b) => a.matricule.localeCompare(b.matricule),
      defaultSortOrder: "ascend",
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
      title: "Division",
      dataIndex: "division",
      sorter: (a, b) => a.division.localeCompare(b.division),
    },
    {
      title: "Nom d'utilisateur",
      dataIndex: "username",
      sorter: (a, b) => a.username.localeCompare(b.username),
    },
    {
      title: "Email",
      dataIndex: "email",
      sorter: (a, b) => a.email.localeCompare(b.email),
    },
    {
      title: "Actions",
      dataIndex: "actions",
      fixed: "right",
      width: 100,
      render: (_, record) => (
        <div>
          {status === "invalid" ? (
            <Button
              type="primary"
              onClick={() => validateUtilisateur(record.matricule)}
              title="Valider cet utilisateur"
            >
              <FaCheck size={15} />
            </Button>
          ) : (
            <Button
              type="primary"
              danger
              onClick={() => blockUtilisateur(record.matricule)}
            >
              <FaTrash size={15} />
            </Button>
          )}
        </div>
      ),
    },
  ];

  const formateTableData = filteredUsers.map((user) => ({
    key: user.matricule,
    matricule: user.matricule,
    nom: user.nom,
    prenom: user.prenom,
    username: user.username,
    email: user.email,
    division: user.division,
    actions: user.actions,
  }));

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
        Liste des Utilisateurs
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

            <Select
              onChange={handleStatusChange}
              value={status}
              style={{ width: "150px", borderRadius: "6px" }}
              className="select-filter"
            >
              <Select.Option value="valid">Validé</Select.Option>
              <Select.Option value="invalid">Non Validé</Select.Option>
            </Select>
          </div>

          {formateTableData.length === 0 ? (
            <div style={{ textAlign: "center", padding: "20px" }}>
              <p>Aucun utilisateur trouvé.</p>
            </div>
          ) : (
            <Table
              bordered
              size="middle"
              dataSource={formateTableData}
              columns={columns}
              rowKey="key"
              pagination={{
                pageSize: 8,
                position: ["bottomRight"],
              }}
              scroll={{ x: "max-content" }}
              rowClassName={() => "table-row-hover"}
              className="styled-table"
            />
          )}
        </Card>
      )}
    </Content>
  );
}
