import { useState, useEffect } from "react";
import { Button, Layout, Dropdown, Menu } from "antd";
import Logo from "../Logo";
import MenuList from "./MenuListSolde";
import ToggleThemeButton from "../ToggleThemeButton";
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  MoreOutlined,
} from "@ant-design/icons";
import { MdOutlineManageAccounts } from "react-icons/md";
import { FaUser, FaPowerOff } from "react-icons/fa";
import ContentSection from "./Cas/ContentCas";
import ContentCcps from "./Ccps/ContentCcps";
import ContentCcpsRect from "./Ccps/ContentCcpsRect";

import ContentDashboardSolde from "./ContentDashboardSolde";
import CodeRubrique from "../Code/ContentCodeRubriqueSolde";
import CodeZone from "../Code/ContentCodeZone";
import CodeCorps from "../Code/ContentCodeCorps";
import CodeCorpsGradeIndice from "../Code/ContentCorpsGradeIndice";

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

  const toggleTheme = () => {
    setDarkTheme(!darkTheme);
  };

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
      case "cas":
        return <ContentSection darkTheme={darkTheme} />;
      case "normal":
        return <ContentCcps darkTheme={darkTheme} />;
      case "rectificatif":
        return <ContentCcpsRect darkTheme={darkTheme} />;
      case "rubrique":
        return <CodeRubrique darkTheme={darkTheme} />;
      case "corps":
        return <CodeCorps darkTheme={darkTheme} />;
      case "zone":
        return <CodeZone darkTheme={darkTheme} />;
      case "corps-grade-indice":
        return <CodeCorpsGradeIndice darkTheme={darkTheme} />;
      default:
        return <ContentDashboardSolde darkTheme={darkTheme} />;
    }
  };

  return (
    <Layout darkTheme={darkTheme}>
      <Sider
        collapsed={collapsed}
        collapsible
        trigger={null}
        theme={darkTheme ? "dark" : "light"}
        className="sidebar"
      >
        <Logo />
        <MenuList darkTheme={darkTheme} setSelectedPage={setSelectedPage} />
        <ToggleThemeButton darkTheme={darkTheme} toggleTheme={toggleTheme} />
      </Sider>

      <Layout>
        <Header
          style={{
            padding: 0,
            background: darkTheme ? "#001529" : "#fff",
            color: darkTheme ? "#fff" : "#000",
            display: "flex",
            alignItems: "center",
            paddingLeft: "16px",
            marginLeft: "10px",
          }}
          className={darkTheme ? "headers dark-theme" : "headers light-theme"}
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

          <h1>Edition CA.S/CCP.S</h1>

          <div className="nav-action">
            <div className="user-menu">
              <FaUser className="icon" /> <span>{username}</span>
            </div>

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
              <div className="user-menu-icon" title="Options utilisateur">
                <MoreOutlined style={{ fontSize: 20, cursor: "pointer" }} />
              </div>
            </Dropdown>
          </div>
        </Header>

        {renderContent()}
      </Layout>
    </Layout>
  );
}
