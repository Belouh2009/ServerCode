import { useState, useEffect } from "react";
import { Button, Layout, Dropdown, Menu } from "antd";
import Logo from "../Logo";
import MenuListUser from "./MenuListUser";
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  MoreOutlined,
} from "@ant-design/icons";
import { FaBell, FaPowerOff, FaUser } from "react-icons/fa";
import axios from "axios";
import ContentUsers from "./ContentUsers";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

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
        "http://192.168.88.53:8087/utilisateur/non-valide/count"
      );
      setNonValideCount(response.data);
    } catch (error) {
      console.error("Erreur lors du comptage des comptes non validés :", error);
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
    }
  };

  const renderContent = () => {
    switch (selectedPage) {
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
        <MenuListUser
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
                  style={{ fontSize: "20px", color: "#fff" }}
                />
              ) : (
                <MenuFoldOutlined style={{ fontSize: "20px", color: "#fff" }} />
              )
            }
          />

          <h1 style={{ marginLeft: "15px", color: "#fff", fontSize: "20px" }}>
            Edition CSP
          </h1>

          <div className="nav-action">
            <div
              className="notify-icon"
              id="btnNonValide"
              onClick={() => setStatus("invalid")}
            >
              <FaBell
                size={19}
                className="btn-action"
                title={`Il y a ${nonValideCount} nouveau(x) compte(s) !`}
                style={{ color: "#fff" }}
              />
              <span style={{ background: "#ff4d4f", color: "#fff" }}>
                {nonValideCount}
              </span>
            </div>

            <Dropdown
              overlay={
                <Menu onClick={({ key }) => handleMenuClick(key)}>
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
                <span style={{ marginLeft: "6px", marginRight: "15px" }}>Administrateur</span>
              </div>
            </Dropdown>
          </div>
        </Header>

        {renderContent()}
      </Layout>
    </Layout>
  );
}
