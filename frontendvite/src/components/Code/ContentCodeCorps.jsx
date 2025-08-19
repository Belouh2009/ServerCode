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

const ContentCodeCorps = () => {
  const [rubriques, setRubriques] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filteredData, setFilteredData] = useState([]);

  // Fonction pour récupérer les rubriques depuis le backend
  const fetchCorps = () => {
    setLoading(true);
    fetch("http://192.168.88.28:8087/corps/all")
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

  const handleSearch = (e) => {
    const searchTerm = e.target.value.toLowerCase();

    const filtered = rubriques.filter((corps) => {
      const codeCorps = corps.corps ? corps.corps.toLowerCase() : "";
      const libelleCorps = corps.libelleCorps
        ? corps.libelleCorps.toLowerCase()
        : "";
      const categorie = corps.categorie ? corps.categorie.toLowerCase() : "";
      const grade = corps.grade ? corps.grade.toLowerCase() : "";
      // indice est un nombre, on le convertit en chaîne, sinon chaîne vide
      const indice =
        corps.indice !== null && corps.indice !== undefined
          ? String(corps.indice).toLowerCase()
          : "";

      return (
        codeCorps.includes(searchTerm) ||
        libelleCorps.includes(searchTerm) ||
        categorie.includes(searchTerm) ||
        grade.includes(searchTerm) ||
        indice.includes(searchTerm)
      );
    });

    setFilteredData(filtered);
  };

  const columns = [
    {
      title: "Code Corps",
      dataIndex: "corps",
      key: "corps",
      sorter: (a, b) => a.corps.localeCompare(b.corps),
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
    {
      title: "Grade",
      dataIndex: "grade",
      key: "grade",
      sorter: (a, b) => a.grade.localeCompare(b.grade),
    },
    {
      title: "Indice",
      dataIndex: "indice",
      key: "indice",
      sorter: (a, b) => a.indice.localeCompare(b.indice),
    },
  ];

  return (
    <Content
      className="content"
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
             className="tableau"
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
