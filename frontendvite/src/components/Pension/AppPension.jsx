import { useState, useEffect } from "react";
import { Button, Layout, Dropdown, Menu } from "antd";
import Logo from "../Logo";
import MenuList from "./MenuList";
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  MoreOutlined,
} from "@ant-design/icons";
import { MdOutlineManageAccounts } from "react-icons/md";
import { FaUser, FaPowerOff } from "react-icons/fa";
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

const { Header, Sider } = Layout;

export default function App() {
  const navigate = useNavigate();

  const [darkTheme, setDarkTheme] = useState(true);
  const [collapsed, setCollapsed] = useState(false);
  const [selectedPage, setSelectedPage] = useState("home");
  const [username, setUsername] = useState(
    localStorage.getItem("username") || "Admin"
  );

  useEffect(() => {
    const handleStorageChange = () => {
      setUsername(localStorage.getItem("username") || "Admin");
    };
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  const handleMenuClick = (key) => {
    if (key === "logout") {
      handleLogout();
    } else if (key === "account") {
      Swal.fire("Mon Compte", "Fonction à implémenter :)", "info");
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
        localStorage.removeItem("role");
        setUsername("Admin"); // Mise à jour après déconnexion
        navigate("/login", { replace: true });

        // Empêcher de revenir en arrière après déconnexion
        window.history.pushState(null, null, window.location.href);
        window.addEventListener("popstate", () => {
          window.history.pushState(null, null, window.location.href);
        });
      }
    });
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
        onBreakpoint={(broken) => {
          setCollapsed(broken);
        }}
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
                  style={{
                    color: darkTheme ? "#fff" : "#000",
                    fontSize: "20px",
                  }}
                />
              ) : (
                <MenuFoldOutlined
                  style={{
                    color: darkTheme ? "#fff" : "#000",
                    fontSize: "20px",
                  }}
                />
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
      </Layout>
    </Layout>
  );
}
