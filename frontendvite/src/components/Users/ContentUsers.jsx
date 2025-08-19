import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Layout,
  Typography,
  Input,
  Button,
  Spin,
  Card,
  Table,
  Select,
  Tooltip,
} from "antd";
import { FaCheck } from "react-icons/fa";
import { MdOutlineBlock } from "react-icons/md";
import { TbUserEdit } from "react-icons/tb";
import Swal from "sweetalert2";

import userIcon from "../image/user.jpg";
import ModalUser from "../Users/ModalUsers";

const { Content } = Layout;
const { Title } = Typography;

export default function ContentUsers({ status, setStatus }) {
  // États
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [nonValideCount, setNonValideCount] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedInfo, setEditedInfo] = useState({});
  const [saving, setSaving] = useState(false);

  // Configuration de base pour SweetAlert
  const swalBaseConfig = {
    background: "#ffffff",
    backdrop: "rgba(0, 0, 0, 0.05) center top no-repeat",
    customClass: {
      container: "swal-container",
      popup: "swal-popup",
      header: "swal-header",
      title: "swal-title",
      confirmButton: "swal-confirm-btn",
      cancelButton: "swal-cancel-btn",
      actions: "swal-actions",
    },
    showClass: {
      popup: "animate__animated animate__fadeInDown animate__faster",
    },
    hideClass: {
      popup: "animate__animated animate__fadeOutUp animate__faster",
    },
  };

  // Effets
  useEffect(() => {
    fetchUsers();
    updateNonValideCount();
  }, [status]);

  // Fonctions API
  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `http://192.168.88.28:8087/utilisateur?status=${status}`
      );
      setUsers(response.data);
    } catch (error) {
      console.error("Erreur lors de la récupération des utilisateurs :", error);
      showErrorAlert("Impossible de récupérer les utilisateurs");
    } finally {
      setLoading(false);
    }
  };

  const updateNonValideCount = async () => {
    try {
      const response = await axios.get(
        "http://192.168.88.28:8087/utilisateur/non-valide/count"
      );
      setNonValideCount(response.data);
    } catch (error) {
      console.error(
        "Erreur lors de la récupération du nombre d'utilisateurs non validés :",
        error
      );
    }
  };

  // Fonctions d'action
  const validateUser = async (matricule) => {
    try {
      await axios.post(`http://192.168.88.28:8087/utilisateur/valide/${matricule}`);
      showSuccessAlert("Utilisateur validé avec succès !");
      refreshData();
    } catch (error) {
      console.error("Erreur lors de la validation :", error);
      showErrorAlert("Impossible de valider l'utilisateur");
    }
  };

  const blockUser = async (matricule) => {
    try {
      await axios.post(`http://192.168.88.28:8087/utilisateur/blocke/${matricule}`);
      showSuccessAlert("Utilisateur bloqué avec succès !");
      refreshData();
    } catch (error) {
      console.error("Erreur lors du blocage :", error);
      showErrorAlert("Impossible de bloquer l'utilisateur");
    }
  };

  // Fonctions utilitaires
  const refreshData = () => {
    setStatus("valid");
    fetchUsers();
    updateNonValideCount();
  };

  const showSuccessAlert = (message) => {
    Swal.fire("Succès", message, "success");
  };

  const showErrorAlert = (message) => {
    Swal.fire("Erreur", message, "error");
  };

  // Fonctions de confirmation stylisées
  const showConfirm = (config) => {
    return Swal.fire({ ...swalBaseConfig, ...config });
  };

  const confirmAction = async (user, actionType) => {
    const configs = {
      validate: {
        title: `<span style="color: #52c41a;">Validation Utilisateur</span>`,
        html: getUserCardHtml(user, "valider", "#52c41a"),
        icon: "success",
        iconColor: "#52c41a",
        confirmButtonText: "Confirmer la validation",
        action: () => validateUser(user.matricule),
      },
      block: {
        title: `<span style="color: #f5222d;">Blocage Utilisateur</span>`,
        html: getUserCardHtml(
          user,
          "bloquer",
          "#f5222d",
          "⚠️ Ne pourra plus se connecter"
        ),
        icon: "warning",
        iconColor: "#f5222d",
        confirmButtonText: "Confirmer le blocage",
        confirmButtonColor: "#f5222d",
        action: () => blockUser(user.matricule),
      },
      edit: {
        title: `<span style="color: #1890ff;">Modification Utilisateur</span>`,
        html: getUserCardHtml(user, "modifier", "#1890ff"),
        icon: "info",
        iconColor: "#1890ff",
        confirmButtonText: "Continuer",
        action: () => {
          setSelectedUser(user);
          setIsEditing(true); // Activer directement le mode édition
          setIsModalOpen(true);
          // Pré-remplir les données éditées
          setEditedInfo({
            ...user,
            password: "", // Réinitialiser le mot de passe
          });
        },
      },
    };

    const config = configs[actionType];
    const { isConfirmed } = await showConfirm({
      title: config.title,
      html: config.html,
      icon: config.icon,
      iconColor: config.iconColor,
      showCancelButton: true,
      confirmButtonText: config.confirmButtonText,
      cancelButtonText: "Annuler",
      reverseButtons: true,
      confirmButtonColor: config.confirmButtonColor,
    });

    if (isConfirmed) {
      config.action();
    }
  };

  const getUserCardHtml = (user, action, color, warningText = "") => {
    return `
      <div class="swal-user-info">
        <p>Vous allez <strong style="color: ${color};">${action}</strong> l'accès de :</p>
        <div class="user-card ${action === "bloquer" ? "warning" : ""}">
          <div class="user-avatar" style="background-color: ${getAvatarBgColor(
            action
          )};">
            ${user.nom.charAt(0)}${user.prenom.charAt(0)}
          </div>
          <div class="user-details">
            <h4>${user.nom} ${user.prenom}</h4>
            <p>${user.division}</p>
            ${warningText ? `<p class="warning-text">${warningText}</p>` : ""}
          </div>
        </div>
      </div>
    `;
  };

  const getAvatarBgColor = (action) => {
    switch (action) {
      case "valider":
        return "#f6ffed";
      case "bloquer":
        return "#fff1f0";
      default:
        return "#e6f7ff";
    }
  };

  // Composants
  const UserImage = ({ imageName }) => {
    const isDefaultImage =
      !imageName || imageName.trim() === "" || imageName === "user.jpg";
    const imgSrc = isDefaultImage
      ? userIcon
      : `http://192.168.88.28:8087/uploads/${imageName}`;

    return (
      <img
        src={imgSrc}
        alt="User"
        style={{
          width: 50,
          height: 50,
          borderRadius: "50%",
          objectFit: "cover",
          boxShadow: "0 0 5px rgba(0,0,0,0.1)",
        }}
        onError={(e) => {
          e.currentTarget.src = userIcon;
        }}
      />
    );
  };

  // Gestion des données
  const handleStatusChange = (value) => setStatus(value);
  const handleSearch = (event) =>
    setSearchQuery(event.target.value.toLowerCase());
  const handleSaveChanges = async () => {
    setSaving(true);
    try {
      const formData = new FormData();
      formData.append("matricule", selectedUser.matricule);
      formData.append("nom", editedInfo.nom || selectedUser.nom);
      formData.append("prenom", editedInfo.prenom || selectedUser.prenom);
      formData.append("email", editedInfo.email || selectedUser.email);
      formData.append("division", editedInfo.division || selectedUser.division);
      formData.append("username", editedInfo.username || selectedUser.username);

      if (editedInfo.password) {
        formData.append("password", editedInfo.password);
      }

      if (editedInfo.imageFile) {
        formData.append("image", editedInfo.imageFile);
      }

      const response = await axios.put(
        "http://192.168.88.28:8087/utilisateur/update-profile",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      // Mettre à jour la liste des utilisateurs
      fetchUsers();
      setIsEditing(false);
      setIsModalOpen(false);

      Swal.fire("Succès", "Utilisateur mis à jour avec succès", "success");
    } catch (error) {
      console.error("Erreur lors de la mise à jour:", error);
      Swal.fire("Erreur", "Échec de la mise à jour de l'utilisateur", "error");
    } finally {
      setSaving(false);
    }
  };

  const filteredUsers = users.filter((user) => {
    const query = searchQuery.toLowerCase();
    return (
      user.matricule.toLowerCase().includes(query) ||
      user.nom.toLowerCase().includes(query) ||
      user.prenom.toLowerCase().includes(query) ||
      user.username.toLowerCase().includes(query) ||
      user.division.toLowerCase().includes(query) ||
      user.email.toLowerCase().includes(query)
    );
  });

  const columns = [
    {
      title: "Photo",
      dataIndex: "image",
      key: "image",
      render: (image) => <UserImage imageName={image} />,
      width: 70,
      fixed: "left",
    },
    {
      title: "Matricule",
      dataIndex: "matricule",
      key: "matricule",
      sorter: (a, b) => a.matricule.localeCompare(b.matricule),
    },
    {
      title: "Nom",
      dataIndex: "nom",
      key: "nom",
      sorter: (a, b) => a.nom.localeCompare(b.nom),
    },
    {
      title: "Prénom",
      dataIndex: "prenom",
      key: "prenom",
      sorter: (a, b) => a.prenom.localeCompare(b.prenom),
    },
    {
      title: "Division",
      dataIndex: "division",
      key: "division",
      sorter: (a, b) => a.division.localeCompare(b.division),
    },
    {
      title: "Nom d'utilisateur",
      dataIndex: "username",
      key: "username",
      sorter: (a, b) => a.username.localeCompare(b.username),
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      sorter: (a, b) => a.email.localeCompare(b.email),
    },
    {
      title: "Actions",
      key: "actions",
      fixed: "right",
      width: 120,
      align: "center",
      render: (_, record) => (
        <div style={{ display: "flex", justifyContent: "center", gap: "8px" }}>
          {record.status === "invalid" ? (
            <Tooltip title="Valider cet utilisateur">
              <Button
                type="primary"
                style={{ background: "#52c41a", borderColor: "#52c41a" }}
                onClick={() => confirmAction(record, "validate")}
              >
                <FaCheck size={15} />
              </Button>
            </Tooltip>
          ) : (
            <>
              <Tooltip title="Bloquer cet utilisateur">
                <Button
                  type="primary"
                  danger
                  onClick={() => confirmAction(record, "block")}
                >
                  <MdOutlineBlock size={15} />
                </Button>
              </Tooltip>
              <Tooltip title="Modifier cet utilisateur">
                <Button
                  type="primary"
                  onClick={() => confirmAction(record, "edit")}
                >
                  <TbUserEdit size={15} />
                </Button>
              </Tooltip>
            </>
          )}
        </div>
      ),
    },
  ];

  const tableData = filteredUsers.map((user) => ({
    key: user.matricule,
    ...user,
    status: user.valide ? "valid" : "invalid",
    image: user.image || "user.jpg",
  }));

  return (
    <Content className="content">
      <Title level={2} style={{ color: "#1e88e5", marginBottom: "20px" }}>
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
                width: "220px",
                borderRadius: "6px",
                borderColor: "#cfd8dc",
              }}
            />
            <Select
              value={status}
              onChange={handleStatusChange}
              style={{ width: "150px", borderRadius: "6px" }}
            >
              <Select.Option value="valid">Validé</Select.Option>
              <Select.Option value="invalid">Non Validé</Select.Option>
            </Select>
          </div>

          {tableData.length === 0 ? (
            <div style={{ textAlign: "center", padding: "20px" }}>
              <p>Aucun utilisateur trouvé.</p>
            </div>
          ) : (
            <div className="tableau">
              <Table
                bordered
                size="middle"
                dataSource={tableData}
                columns={columns}
                pagination={{
                  pageSize: 20,
                  position: ["bottomRight"],
                  showSizeChanger: false,
                }}
                scroll={{ x: "max-content" }}
                rowClassName="table-row-hover"
                className="styled-table"
              />
            </div>
          )}
        </Card>
      )}

      <ModalUser
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        isEditing={isEditing}
        setIsEditing={setIsEditing}
        editedInfo={editedInfo}
        setEditedInfo={setEditedInfo}
        userInfo={selectedUser}
        saving={saving}
        handleSaveChanges={handleSaveChanges}
        userIcon={userIcon}
      />
    </Content>
  );
}
