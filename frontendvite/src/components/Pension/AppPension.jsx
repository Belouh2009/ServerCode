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
  message,
} from "antd";
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  SmileOutlined,
} from "@ant-design/icons";
import { MdOutlineManageAccounts } from "react-icons/md";
import { FaPowerOff, FaAngleDown } from "react-icons/fa";
import Logo from "../Logo";
import MenuList from "./MenuList";
import ContentSection from "./Cap/ContentSection";
import ContentCce from "./Cce/ContentCce";
import ContentDashboard from "../Pension/ContentDashboard";
import CodeRubrique from "../Code/ContentCodeRubrique";
import CodeZone from "../Code/ContentCodeZone";
import CodeCorps from "../Code/ContentCodeCorps";
import "../../index.css";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import axios from "axios";
import userIcon from "../image/user.jpg";
import ModalUser from "../Users/ModalUsers";
import { useWelcomeMessage } from "../../useWelcomeMessage";

const { Header, Sider } = Layout;

const UserAvatar = ({ imageName, username }) => {
  const imageBaseURL = "http://192.168.88.47:8087/uploads/";
  const [avatarSrc, setAvatarSrc] = useState(userIcon);

  useEffect(() => {
    if (imageName) {
      const img = new Image();
      const src =
        imageName === "user.jpg" ? userIcon : `${imageBaseURL}${imageName}`;
      img.src = src;

      img.onload = () => setAvatarSrc(src);
      img.onerror = () => setAvatarSrc(userIcon);
    }
  }, [imageName]);

  return (
    <div className="user-avatar-container">
      <img
        src={avatarSrc}
        alt={`Avatar de ${username}`}
        className="user-avatar-image"
        onError={(e) => {
          e.target.src = userIcon;
        }}
      />
      <span className="user-avatar-username">{username}</span>
      <FaAngleDown className="dropdown-icon" />
    </div>
  );
};

export default function App() {
  const [messageApi, contextHolder] = message.useMessage();
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedInfo, setEditedInfo] = useState({});
  const [saving, setSaving] = useState(false);
  const [selectedPage, setSelectedPage] = useState("home");
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUserData = async () => {
      const token = localStorage.getItem("token");
      const username = localStorage.getItem("username");

      try {
        setLoading(true);
        const response = await axios.get(
          `http://192.168.88.47:8087/utilisateur/by-username/${username}`,
          {
            headers: { Authorization: `Bearer ${token}` },
            timeout: 5000,
          }
        );

        if (response.data) {
          setUserInfo(response.data);
        }
      } catch (error) {
        console.error("Erreur chargement utilisateur:", error);
        Swal.fire({
          title: "Erreur",
          text: "Impossible de charger les données utilisateur",
          icon: "error",
        });
      } finally {
        setLoading(false);
      }
    };

    loadUserData();
  }, [navigate]);

  const welcomeMessage = useWelcomeMessage(userInfo);


  const handleMenuClick = (key) => {
    if (key === "logout") {
      handleLogout();
    } else if (key === "account") {
      setIsModalOpen(true);
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
        navigate("/login", { replace: true });
      }
    });
  };

  const handleSaveChanges = async () => {
    setSaving(true);
    try {
      const token = localStorage.getItem("token");
      const formData = new FormData();

      formData.append("nom", editedInfo.nom || userInfo.nom);
      formData.append("prenom", editedInfo.prenom || userInfo.prenom);
      formData.append("email", editedInfo.email || userInfo.email);
      formData.append("division", editedInfo.division || userInfo.division);
      formData.append("matricule", editedInfo.matricule || userInfo.matricule);
      formData.append("username", editedInfo.username || userInfo.username);

      if (editedInfo.password) {
        formData.append("password", editedInfo.password);
      }

      if (editedInfo.imageFile) {
        formData.append("image", editedInfo.imageFile);
      }

      const response = await axios.put(
        "http://192.168.88.47:8087/utilisateur/update-profile",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setUserInfo((prev) => ({
        ...prev,
        ...response.data,
        image: response.data.image || prev.image,
      }));

      setIsEditing(false);

      await Swal.fire({
        title: "Succès",
        text: "Profil mis à jour avec succès",
        icon: "success",
      });
    } catch (error) {
      console.error("Erreur mise à jour:", error);
      Swal.fire({
        title: "Erreur",
        text: "Une erreur est survenue lors de la mise à jour du profil",
        icon: "error",
      });
    } finally {
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
      default:
        return <ContentDashboard />;
    }
  };

  return (
    <Layout>
      {contextHolder}
      {welcomeMessage}
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
        <Header className="headers">
          <Button
            type="text"
            className="toggle"
            onClick={() => setCollapsed(!collapsed)}
            icon={
              collapsed ? (
                <MenuUnfoldOutlined
                  style={{ fontSize: "20px", color: "#fff" }}
                />
              ) : (
                <MenuFoldOutlined style={{ fontSize: "20px", color: "#fff" }} />
              )
            }
          />
          <h1 className="header-title">Edition CA.P/CCE</h1>

          <div className="nav-action">
            <Dropdown
              overlay={
                <Menu onClick={({ key }) => handleMenuClick(key)}>
                  <Menu.Item key="account">
                    <div className="menu-item">
                      <MdOutlineManageAccounts className="menu-icon" />
                      Mon compte
                    </div>
                  </Menu.Item>
                  <Menu.Item key="logout" danger>
                    <div className="menu-item">
                      <FaPowerOff className="menu-icon" />
                      Se déconnecter
                    </div>
                  </Menu.Item>
                </Menu>
              }
              placement="bottomRight"
              trigger={["click"]}
            >
              <div className="dropdown-trigger">
                {userInfo ? (
                  <UserAvatar
                    imageName={userInfo.image}
                    username={userInfo.username}
                  />
                ) : (
                  <div className="user-fallback">
                    <div className="avatar-placeholder" />
                    <span className="username">
                      {localStorage.getItem("username")}
                    </span>
                    <FaAngleDown className="dropdown-icon" />
                  </div>
                )}
              </div>
            </Dropdown>
          </div>
        </Header>

        {renderContent()}

        <ModalUser
          isModalOpen={isModalOpen}
          setIsModalOpen={setIsModalOpen}
          isEditing={isEditing}
          setIsEditing={setIsEditing}
          editedInfo={editedInfo}
          setEditedInfo={setEditedInfo}
          loading={loading}
          userInfo={userInfo}
          saving={saving}
          handleSaveChanges={handleSaveChanges}
          userIcon={userIcon}
        />
      </Layout>
    </Layout>
  );
}
