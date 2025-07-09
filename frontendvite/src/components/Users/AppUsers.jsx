import { useState, useEffect } from "react";
import { Button, Layout, Dropdown, Menu } from "antd";
import Logo from "../Logo";
import MenuListUser from "./MenuListUser";
import ToggleThemeButton from "../ToggleThemeButton";
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  MoreOutlined,
} from "@ant-design/icons";
import { FaBell, FaPowerOff, FaUser } from "react-icons/fa";
import { MdOutlineManageAccounts } from "react-icons/md";
import axios from "axios";
import ContentUsers from "./ContentUsers";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

import CodeRubrique from "../Code/CodeRubrique";
import CodeRubriqueSolde from "../Code/CodeRubriqueSolde";
import CodeZone from "../Code/CodeZone";
import CodeCorps from "../Code/CodeCorps";
import CorpsGradeIndice from "../Code/CodeCorpsGradeIndice";
import "../../index.css";

const { Header, Sider } = Layout;

export default function AppUsers() {
  const [darkTheme, setDarkTheme] = useState(true);
  const [collapsed, setCollapsed] = useState(false);
  const [status, setStatus] = useState("valid");
  const [selectedPage, setSelectedPage] = useState("users");
  const [nonValideCount, setNonValideCount] = useState(0);

  const navigate = useNavigate(); // Déplacement de useNavigate à l'intérieur du composant

  const toggleTheme = () => {
    setDarkTheme(!darkTheme);
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
        localStorage.removeItem("role");

        // Redirection vers la page de connexion
        navigate("/login", { replace: true });

        // Empêcher de revenir en arrière
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
        "http://192.168.88.53:8088/utilisateur/non-valide/count"
      );
      setNonValideCount(response.data);
    } catch (error) {
      console.error(
        "Erreur lors de la récupération du nombre d'utilisateurs non validés :",
        error
      );
    }
  };

  useEffect(() => {
    updateNonValideCount();
    const interval = setInterval(updateNonValideCount, 10000);
    return () => clearInterval(interval);
  }, []);

  const handleMenuClick = (key) => {
    if (key === "logout") {
      handleLogout();
    } else if (key === "account") {
      Swal.fire("Mon Compte", "Fonction à implémenter :)", "info");
    }
  };

  const renderContent = () => {
    // Vérification de la valeur de selectedPage et affichage du contenu associé
    switch (selectedPage) {
      case "corps":
        return (
          <CodeCorps
            darkTheme={darkTheme}
            status={status}
            setStatus={setStatus}
          />
        );
      case "zone":
        return (
          <CodeZone
            darkTheme={darkTheme}
            status={status}
            setStatus={setStatus}
          />
        );
      case "pension":
        return (
          <CodeRubrique
            darkTheme={darkTheme}
            status={status}
            setStatus={setStatus}
          />
        );
      case "solde":
        return (
          <CodeRubriqueSolde
            darkTheme={darkTheme}
            status={status}
            setStatus={setStatus}
          />
        );
      case "corpsGradeIndice":
        return (
          <CorpsGradeIndice
            darkTheme={darkTheme}
            status={status}
            setStatus={setStatus}
          />
        );

      // Si aucune valeur ne correspond, retourner ContentUsers
      default:
        return (
          <ContentUsers
            darkTheme={darkTheme}
            status={status}
            setStatus={setStatus}
          />
        );
    }
  };

  return (
    <Layout className={darkTheme ? "dark-theme" : "light-theme"}>
      <Sider
        collapsed={collapsed}
        collapsible
        trigger={null}
        theme={darkTheme ? "dark" : "light"}
        className="sidebar"
      >
        <Logo />
        <MenuListUser
          darkTheme={darkTheme}
          selectedPage={selectedPage}
          setSelectedPage={setSelectedPage}
        />
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

          <h1>Edition CSP</h1>

          <div className="nav-action">
            <div
              className="notify-icon"
              id="btnNonValide"
              onClick={() => {
                setStatus("invalid");
              }}
            >
              <FaBell
                size={"19"}
                className="btn-action"
                title={`Il y a ${nonValideCount} nouveau(s) compte(s) !`}
              />
              <span>{nonValideCount}</span>
            </div>

            {/* Afficher le nom de l'utilisateur connecté */}
            <div className="user-menu">
              <FaUser className="icon" /> <span>Admin</span>
            </div>

            <Dropdown
              overlay={
                <Menu onClick={({ key }) => handleMenuClick(key)}>
                  {/* <Menu.Item key="account">
                    {" "}
                    <MdOutlineManageAccounts />
                    Mon compte
                  </Menu.Item> */}
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
