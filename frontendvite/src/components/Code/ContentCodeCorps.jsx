import React, { useState, useEffect } from "react";
import {
  Layout,
  Input,
  Button,
  Upload,
  Table,
  Spin,
  Card,
  Typography,
} from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { RiFileEditFill } from "react-icons/ri";
import Swal from "sweetalert2";

const { Title } = Typography;
const { Content } = Layout;

const ContentCodeCorps = ({ darkTheme }) => {
  const [fileData, setFileData] = useState([]);
  const [rubriques, setRubriques] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filteredData, setFilteredData] = useState([]);
  const [showModalCorps, setShowModalCorps] = useState(false); // Correction de la variable pour afficher le modal
  const [selectedCorps, setSelectedCorps] = useState(null); // Correction de l'orthographe de "selectedCorps"

  // Fonction pour récupérer les rubriques depuis le backend
  const fetchCorps = () => {
    setLoading(true);
    fetch("http://localhost:8087/corps/all")
      .then((response) => response.json())
      .then((data) => {
        setRubriques(data);
        setFilteredData(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Erreur lors de la récupération des rubriques:", error);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchCorps();
  }, []);

  const handleShowEditModal = (corps) => {
    Swal.fire({
      title: "Êtes-vous sûr ?",
      text: "Vous allez modifier ce corps !",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Oui",
      cancelButtonText: "Annuler",
    }).then((result) => {
      if (result.isConfirmed) {
        setSelectedCorps(corps);
        setShowModalCorps(true);
      }
    });
  };

  const handleSearch = (e) => {
    const searchTerm = e.target.value.toLowerCase();
    const filtered = rubriques.filter((corps) => {
      const idCorps = corps.idCorps ? corps.idCorps.toLowerCase() : "";
      const libelleCorps = corps.libelleCorps
        ? corps.libelleCorps.toLowerCase()
        : "";
      const categorie = corps.categorie ? corps.categorie.toLowerCase() : "";

      return (
        idCorps.includes(searchTerm) ||
        libelleCorps.includes(searchTerm) ||
        categorie.includes(searchTerm)
      );
    });

    setFilteredData(filtered);
  };

  const columns = [
    {
      title: "ID Corps",
      dataIndex: "idCorps",
      key: "idCorps",
      sorter: (a, b) => a.idCorps.localeCompare(b.idCorps),
      defaultSortOrder: "ascend",
    },
    {
      title: "Libellé",
      dataIndex: "libelleCorps",
      key: "libelleCorps",
      sorter: (a, b) => a.libelleCorps.localeCompare(b.libelleCorps),
    },
    {
      title: "Catégorie",
      dataIndex: "categorie",
      key: "categorie",
      sorter: (a, b) => a.categorie.localeCompare(b.categorie),
    },
  ];

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
        Liste des Codes Corps
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
          </div>

          {filteredData.length === 0 ? (
            <div style={{ textAlign: "center", padding: "20px" }}>
              <p>Aucun code corps trouvé.</p>
            </div>
          ) : (
            <div
              className="hide-scrollbar"
              style={{
                maxHeight: 1030,
                minHeight: 410,
                height: "calc(100vh - 250px)",
                overflowY: "auto",
              }}
            >
              <Table
                bordered
                size="middle"
                dataSource={filteredData}
                columns={columns}
                rowKey="idCorps"
                pagination={{
                  pageSize: 20,
                  position: ["bottomRight"],
                  showSizeChanger: false,
                }}
                scroll={{ y: "100%" }}
                rowClassName={() => "table-row-hover"}
                className="styled-table"
              />
            </div>
          )}
        </Card>
      )}
    </Content>
  );
};

export default ContentCodeCorps;
