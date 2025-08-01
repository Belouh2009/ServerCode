import { useState, useEffect } from "react";
import {
  Button,
  Layout,
  Dropdown,
  Menu,
  Spin,
  Modal,
  Descriptions,
  Input,
} from "antd";
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  EditOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";
import { MdOutlineManageAccounts } from "react-icons/md";
import { FaUser, FaPowerOff } from "react-icons/fa";
import Logo from "../Logo";
import MenuList from "./MenuList";
import ContentSection from "./Cap/ContentSection";
import ContentCce from "./Cce/ContentCce";
import ContentDashboard from "../Pension/ContentDashboard";
import CodeRubrique from "../Code/ContentCodeRubrique";
import CodeZone from "../Code/ContentCodeZone";
import CodeCorps from "../Code/ContentCodeCorps";
import CodeCorpsGradeIndice from "../Code/ContentCorpsGradeIndice";
import "../../index.css";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import axios from "axios"; // Import d'axios pour les requêtes API

const { Header, Sider } = Layout;

export default function App() {
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedInfo, setEditedInfo] = useState({});
  const [saving, setSaving] = useState(false);
  const [selectedPage, setSelectedPage] = useState("home");
  const [username, setUsername] = useState(
    localStorage.getItem("username") || "Admin"
  );
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const username = localStorage.getItem("username");
    if (username) {
      setUsername(username);
    }
  }, []);

  const fetchUserInfo = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const username = localStorage.getItem("username");

      const response = await axios.get(
        `http://192.168.88.53:8087/utilisateur/by-username/${username}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setUserInfo(response.data);
    } catch (error) {
      console.error(
        "Erreur lors de la récupération des données utilisateur:",
        error
      );
      Swal.fire({
        title: "Erreur",
        text: "Impossible de récupérer les informations utilisateur",
        icon: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleMenuClick = (key) => {
    if (key === "logout") {
      handleLogout();
    } else if (key === "account") {
      setIsModalOpen(true);
      fetchUserInfo();
    }
  };

  const handleLogout = () => {
    Swal.fire({
      title: "Êtes-vous sûr ?",
      text: "Vous allez être déconnecté !",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Oui",
      cancelButtonText: "Annuler",
    }).then((result) => {
      if (result.isConfirmed) {
        localStorage.removeItem("username");
        localStorage.removeItem("token");
        localStorage.removeItem("role");
        setUsername("Admin");
        navigate("/login", { replace: true });

        window.history.pushState(null, null, window.location.href);
        window.addEventListener("popstate", () => {
          window.history.pushState(null, null, window.location.href);
        });
      }
    });
  };

  const handleSaveChanges = async () => {
    setSaving(true);
    try {
      // 1. Préparer les données à envoyer
      const dataToSend = {
        nom: editedInfo.nom,
        prenom: editedInfo.prenom,
        email: editedInfo.email,
        division: editedInfo.division,
        matricule: editedInfo.matricule,
        username: editedInfo.username,
        ...(editedInfo.password && { password: editedInfo.password }),
      };

      // 2. Envoyer la requête
      const response = await axios.put(
        "http://192.168.88.53:8087/utilisateur/update-profile",
        dataToSend
      );

      // 3. Mettre à jour l'état local
      setUserInfo((prev) => ({
        ...prev,
        ...dataToSend,
        password: undefined, // Ne pas stocker le mot de passe
      }));

      // 4. Fermer le mode édition et afficher un message avec SweetAlert
      setIsEditing(false);
      await Swal.fire({
        title: "Succès",
        text: "Profil mis à jour avec succès",
        icon: "success",
        confirmButtonText: "OK",
        confirmButtonColor: "#3085d6",
      });
    } catch (error) {
      // 5. Gestion des erreurs avec SweetAlert
      console.error("Erreur lors de la mise à jour:", error);

      if (error.response) {
        // Erreur venant du serveur
        if (error.response.status === 401) {
          await Swal.fire({
            title: "Session expirée",
            text: "Veuillez vous reconnecter",
            icon: "error",
            confirmButtonText: "Se reconnecter",
            confirmButtonColor: "#d33",
          });
          handleLogout();
        } else {
          await Swal.fire({
            title: "Erreur",
            text:
              error.response.data.message || "Erreur lors de la mise à jour",
            icon: "error",
            confirmButtonText: "OK",
            confirmButtonColor: "#d33",
          });
        }
      } else if (error.request) {
        // La requête a été faite mais aucune réponse n'a été reçue
        await Swal.fire({
          title: "Erreur de connexion",
          text: "Pas de réponse du serveur",
          icon: "error",
          confirmButtonText: "OK",
          confirmButtonColor: "#d33",
        });
      } else {
        // Erreur lors de la configuration de la requête
        await Swal.fire({
          title: "Erreur",
          text: "Erreur de configuration de la requête",
          icon: "error",
          confirmButtonText: "OK",
          confirmButtonColor: "#d33",
        });
      }
    } finally {
      // 6. Désactiver l'état de chargement dans tous les cas
      setSaving(false);
    }
  };

  const renderContent = () => {
    switch (selectedPage) {
      case "cap":
        return <ContentSection />;
      case "cce":
        return <ContentCce />;
      case "rubrique":
        return <CodeRubrique />;
      case "corps":
        return <CodeCorps />;
      case "zone":
        return <CodeZone />;
      case "corps-grade-indice":
        return <CodeCorpsGradeIndice />;
      default:
        return <ContentDashboard />;
    }
  };

  return (
    <Layout>
      <Sider
        collapsed={collapsed}
        collapsible
        trigger={null}
        className="custom-sider"
        theme="light"
        breakpoint="lg"
        width={"220px"}
        onBreakpoint={(broken) => setCollapsed(broken)}
      >
        <Logo />
        <MenuList
          selectedPage={selectedPage}
          setSelectedPage={setSelectedPage}
        />
      </Sider>

      <Layout>
        <Header
          style={{
            padding: 0,
            background: "linear-gradient(to right, #2196f3, #1e88e5)",
            color: "#fff",
            display: "flex",
            alignItems: "center",
            paddingLeft: "16px",
            marginLeft: "10px",
            marginTop: "10px",
            marginRight: "10px",
            height: "64px",
            boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
          }}
          className="headers"
        >
          <Button
            type="text"
            className="toggle"
            onClick={() => setCollapsed(!collapsed)}
            icon={
              collapsed ? (
                <MenuUnfoldOutlined
                  style={{ color: "#fff", fontSize: "20px" }}
                />
              ) : (
                <MenuFoldOutlined style={{ color: "#fff", fontSize: "20px" }} />
              )
            }
          />
          <h1>Edition CA.P/CCE</h1>

          <div className="nav-action">
            <Dropdown
              overlay={
                <Menu onClick={({ key }) => handleMenuClick(key)}>
                  <Menu.Item key="account">
                    <span style={{ display: "flex", alignItems: "center" }}>
                      <MdOutlineManageAccounts
                        style={{ marginRight: "8px", fontSize: "18px" }}
                      />
                      Mon compte
                    </span>
                  </Menu.Item>
                  <Menu.Item key="logout" danger>
                    <span style={{ display: "flex", alignItems: "center" }}>
                      <FaPowerOff
                        style={{ marginRight: "8px", fontSize: "15px" }}
                      />
                      Se déconnecter
                    </span>
                  </Menu.Item>
                </Menu>
              }
              placement="bottomRight"
              trigger={["click"]}
            >
              <div
                className="user-menu"
                style={{ cursor: "pointer", marginRight: "12px" }}
              >
                <FaUser className="icon" />
                <span style={{ marginLeft: "6px" }}>{username}</span>
              </div>
            </Dropdown>
          </div>
        </Header>

        {renderContent()}

        <Modal
          title={
            <div
              style={{
                textAlign: "center",
                fontSize: "18px",
                fontWeight: "500",
              }}
            >
              <MdOutlineManageAccounts
                style={{
                  marginRight: "8px",
                  fontSize: "20px",
                  color: "#1890ff",
                }}
              />
              {isEditing ? "Modifier mon compte" : "Informations du compte"}
            </div>
          }
          open={isModalOpen}
          onCancel={() => {
            setIsEditing(false);
            setIsModalOpen(false);
          }}
          footer={null}
          centered
          width={650}
          style={{ top: "5vh" }} // Contrôle la position verticale
          bodyStyle={{
            maxHeight: "70vh", // Limite la hauteur à 70% de l'écran
            overflowY: "auto", // Active le scroll si nécessaire
            padding: "24px",
            display: "flex",
            flexDirection: "column",
            gap: "16px", // Espacement vertical entre les éléments
          }}
        >
          {loading ? (
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "200px",
              }}
            >
              <Spin size="large" tip="Chargement des informations..." />
            </div>
          ) : userInfo ? (
            <div
              className="user-profile-container"
              style={{ display: "flex", flexDirection: "column", gap: "16px" }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  marginBottom: "8px", // Réduit l'espace sous l'avatar
                }}
              >
                <div
                  style={{
                    width: "80px",
                    height: "80px",
                    borderRadius: "50%",
                    backgroundColor: "#f0f2f5",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginRight: "16px",
                    flexShrink: 0, // Empêche le rétrécissement de l'avatar
                  }}
                >
                  <FaUser style={{ fontSize: "36px", color: "#666" }} />
                </div>
                <div style={{ flex: 1 }}>
                  <h3
                    style={{ margin: 0, fontSize: "20px", lineHeight: "1.4" }}
                  >
                    {userInfo.prenom} {userInfo.nom}
                  </h3>
                  <p style={{ margin: "4px 0 0", color: "#666" }}>
                    {userInfo.division}
                  </p>
                </div>
              </div>

              <div
                style={{
                  backgroundColor: "#f9f9f9",
                  borderRadius: "8px",
                  padding: "20px", // Augmente le padding interne
                  border: "1px solid #f0f0f0",
                }}
              >
                <Descriptions
                  column={1}
                  size="middle"
                  labelStyle={{
                    fontWeight: "500",
                    color: "#555",
                    width: "150px",
                    paddingBottom: "12px", // Espace sous les labels
                  }}
                  contentStyle={{
                    fontWeight: "400",
                    paddingBottom: "12px", // Espace sous les valeurs
                  }}
                >
                  <Descriptions.Item label="Nom">
                    {isEditing ? (
                      <Input
                        value={editedInfo.nom}
                        onChange={(e) =>
                          setEditedInfo({ ...editedInfo, nom: e.target.value })
                        }
                        style={{ marginBottom: "8px" }} // Espace sous l'input
                      />
                    ) : (
                      <div>{userInfo.nom}</div>
                    )}
                  </Descriptions.Item>

                  <Descriptions.Item label="Prénom">
                    {isEditing ? (
                      <Input
                        value={editedInfo.prenom}
                        onChange={(e) =>
                          setEditedInfo({
                            ...editedInfo,
                            prenom: e.target.value,
                          })
                        }
                        style={{ marginBottom: "8px" }}
                      />
                    ) : (
                      <div>{userInfo.prenom}</div>
                    )}
                  </Descriptions.Item>

                  <Descriptions.Item label="Nom d'utilisateur">
                    {isEditing ? (
                      <Input
                        value={editedInfo.username}
                        onChange={(e) =>
                          setEditedInfo({
                            ...editedInfo,
                            username: e.target.value,
                          })
                        }
                        style={{ marginBottom: "8px" }}
                      />
                    ) : (
                      <div>
                        {userInfo.username}
                      </div>
                    )}
                  </Descriptions.Item>

                  <Descriptions.Item label="Division" >
                    {isEditing ? (
                      <Input
                        value={editedInfo.division}
                        onChange={(e) =>
                          setEditedInfo({
                            ...editedInfo,
                            division: e.target.value,
                          })
                        }
                        style={{ marginBottom: "8px" }}
                        disabled={true}
                      />
                    ) : (
                      <div style={{color: "#000000" }}>
                        {" "}
                        {/* Texte noir */}
                        {userInfo.division}
                      </div>
                    )}
                  </Descriptions.Item>

                  <Descriptions.Item label="Email">
                    
                    {isEditing ? (
                      <Input
                        value={editedInfo.email}
                        onChange={(e) =>
                          setEditedInfo({
                            ...editedInfo,
                            email: e.target.value,
                          })
                        }
                        style={{ marginBottom: "8px" }}
                      />
                    ) : (
                      <div>
                        <a href={`mailto:${userInfo.email}`}>
                          {userInfo.email}
                        </a>
                      </div>
                    )}
                  </Descriptions.Item>

                  {isEditing && (
                    <Descriptions.Item label="Mot de passe">
                      <Input.Password
                        placeholder="Nouveau mot de passe"
                        value={editedInfo.password || ""}
                        onChange={(e) =>
                          setEditedInfo({
                            ...editedInfo,
                            password: e.target.value,
                          })
                        }
                      />
                      <div
                        style={{
                          fontSize: "12px",
                          color: "#888",
                          marginTop: "4px",
                        }}
                      >
                        Laissez vide pour ne pas modifier
                      </div>
                    </Descriptions.Item>
                  )}
                </Descriptions>
              </div>

              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginTop: "8px", // Réduit l'espace au-dessus des boutons
                  paddingTop: "12px",
                  borderTop: "1px solid #f0f0f0", // Ligne de séparation
                }}
              >
                <div
                  style={{
                    fontStyle: "italic",
                    color: "#888",
                    fontSize: "12px",
                  }}
                >
                  Dernière mise à jour: {new Date().toLocaleDateString()}
                </div>
                <div>
                  {isEditing ? (
                    <>
                      <Button
                        style={{ marginRight: "8px" }}
                        onClick={() => setIsEditing(false)}
                      >
                        Annuler
                      </Button>
                      <Button
                        type="primary"
                        onClick={handleSaveChanges}
                        loading={saving}
                      >
                        Enregistrer
                      </Button>
                    </>
                  ) : (
                    <Button
                      type="primary"
                      onClick={() => {
                        setEditedInfo({ ...userInfo, password: "" });
                        setIsEditing(true);
                      }}
                      icon={<EditOutlined />}
                    >
                      Modifier
                    </Button>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div
              style={{
                textAlign: "center",
                padding: "40px 0",
                color: "#999",
              }}
            >
              <ExclamationCircleOutlined
                style={{
                  fontSize: "48px",
                  color: "#ffec3d",
                  marginBottom: "16px",
                }}
              />
              <p style={{ fontSize: "16px" }}>
                Aucune information utilisateur disponible
              </p>
              <Button
                type="primary"
                onClick={() => setIsModalOpen(false)}
                style={{ marginTop: "16px" }}
              >
                Fermer
              </Button>
            </div>
          )}
        </Modal>
      </Layout>
    </Layout>
  );
}
