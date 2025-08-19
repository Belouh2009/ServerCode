import { useState, useEffect, useRef } from "react";
import { Button, Layout, Dropdown, Menu, message } from "antd";
import Logo from "../Logo";
import MenuListUser from "./MenuListUser";
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  MoreOutlined,
} from "@ant-design/icons";
import { FaBell, FaPowerOff, FaUser, FaAngleDown } from "react-icons/fa";
import axios from "axios";
import ContentUsers from "./ContentUsers";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { SmileOutlined } from "@ant-design/icons";

import CodeRubrique from "../Code/CodeRubrique";
import CodeRubriqueSolde from "../Code/CodeRubriqueSolde";
import CodeZone from "../Code/CodeZone";
import CodeCorps from "../Code/CodeCorps";
import CorpsGradeIndice from "../Code/CodeCorpsGradeIndice";
import Bareme from "../Code/Bareme";
import "../../index.css";

const { Header, Sider } = Layout;

export default function AppUsers() {
  const [collapsed, setCollapsed] = useState(false);
  const [status, setStatus] = useState("valid");
  const [selectedPage, setSelectedPage] = useState("users");
  const [nonValideCount, setNonValideCount] = useState(0);
  const navigate = useNavigate();
  const [messageApi, contextHolder] = message.useMessage();
  const welcomeShown = useRef(false);

  useEffect(() => {
    if (!welcomeShown.current) {
      welcomeShown.current = true;
      messageApi.success({
        content: (
          <div className="welcome-message-content">
            <SmileOutlined className="welcome-icon" />
            <span>Bienvenue, Administrateur !</span>
          </div>
        ),
        duration: 5,
        className: "custom-welcome-message",
        style: {
          marginTop: "60px",
          maxWidth: "400px",
          animation: "slideInDown 0.5s ease-out",
        },
      });
    }

    updateNonValideCount();
    const interval = setInterval(updateNonValideCount, 10000);
    return () => clearInterval(interval);
  });

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
        localStorage.removeItem("role");
        navigate("/login", { replace: true });

        window.history.pushState(null, null, window.location.href);
        window.addEventListener("popstate", () => {
          window.history.pushState(null, null, window.location.href);
        });
      }
    });
  };

  const updateNonValideCount = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8087/utilisateur/non-valide/count"
      );
      setNonValideCount(response.data);
    } catch (error) {
      console.error("Erreur lors du comptage des comptes non validés :", error);
    }
  };

  const handleMenuClick = (key) => {
    if (key === "logout") {
      handleLogout();
    }
  };

  const renderContent = () => {
    switch (selectedPage) {
      case "users":
        return <ContentUsers status={status} setStatus={setStatus} />;
      case "bareme":
        return <Bareme status={status} setStatus={setStatus} />;
      case "corps":
        return <CodeCorps status={status} setStatus={setStatus} />;
      case "zone":
        return <CodeZone status={status} setStatus={setStatus} />;
      case "pension":
        return <CodeRubrique status={status} setStatus={setStatus} />;
      case "solde":
        return <CodeRubriqueSolde status={status} setStatus={setStatus} />;
      case "corpsGradeIndice":
        return <CorpsGradeIndice status={status} setStatus={setStatus} />;
      default:
        return <ContentUsers status={status} setStatus={setStatus} />;
    }
  };

  const handleNotificationClick = () => {
    setStatus("invalid");
    setSelectedPage("users");

    // Ajout d'un feedback visuel
    messageApi.info({
      content: "Affichage des comptes en attente de validation",
      duration: 3,
    });
  };

  return (
    <Layout>
      {contextHolder}
      <Sider
        collapsed={collapsed}
        collapsible
        trigger={null}
        className="custom-sider"
        theme="light"
        breakpoint="lg"
        width={"220px"}
        onBreakpoint={(broken) => {
          setCollapsed(broken);
        }}
      >
        <Logo />
        <MenuListUser
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

          <h1 className="header-title">Edition CSP</h1>

          <div className="nav-action">
            {/* Notification badge */}
            <div
              className="notification-badge"
              onClick={handleNotificationClick}
              title={`${nonValideCount} compte(s) en attente de validation`}
            >
              <FaBell className="notification-icon" />
              {nonValideCount > 0 && (
                <span className="badge-count">{nonValideCount}</span>
              )}
            </div>
            {/* User dropdown */}
            <Dropdown
              overlay={
                <Menu onClick={({ key }) => handleMenuClick(key)}>
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
                <div className="user-avatar">
                  <FaUser />
                </div>
                <div className="user-info">
                  <span className="username">Administrateur</span>
                  <FaAngleDown className="dropdown-icon" />
                </div>
              </div>
            </Dropdown>
          </div>
        </Header>

        {renderContent()}
      </Layout>
    </Layout>
  );
}
