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
import { RiFileEditFill } from "react-icons/ri";
import axios from "axios";
import Swal from "sweetalert2"; // SweetAlert2 importé
import ModalCorps from "./ModalCorps";

const { Title } = Typography;
const { Content } = Layout;

const CodeCorps = ({ darkTheme }) => {
  const [rubriques, setRubriques] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filteredData, setFilteredData] = useState([]);
  const [showModalCorps, setShowModalCorps] = useState(false);
  const [selectedCorps, setSelectedCorps] = useState(null);

  useEffect(() => {
    fetchRubriques();
  }, []);

  const fetchRubriques = () => {
    setLoading(true);
    axios
      .get("http://localhost:8087/CorpsGradeIndice/all")
      .then((response) => {
        setRubriques(response.data);
        setFilteredData(response.data);
        setLoading(false);
      })
      .catch((error) => {
        Swal.fire({
          title: "Erreur",
          text: "Échec de la récupération des données ! Vérifiez votre connexion.",
          icon: "error",
        });
        setLoading(false);
      });
  };

  const handleShowEditModal = (corps) => {
    Swal.fire({
      title: "Êtes-vous sûr ?",
      text: "Vous allez modifier ce corps !",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Oui, modifier",
      cancelButtonText: "Annuler",
    }).then((result) => {
      if (result.isConfirmed) {
        setSelectedCorps(corps);
        setShowModalCorps(true);
      }
    });
  };

  const processFileData = (jsonData) => {
    const processedData = [];
    const seen = new Set();

    jsonData.forEach((row) => {
      const corpsValues = row.CORPS.split("/");

      corpsValues.forEach((corps) => {
        const trimmedCorps = corps.trim();
        const key = `${trimmedCorps}-${row.GRADE}-${row.INDICE}`;

        if (!seen.has(key)) {
          processedData.push({
            corps: trimmedCorps,
            grade: row.GRADE,
            indice: row.INDICE,
          });
          seen.add(key);
        }
      });
    });

    return processedData;
  };

  const handleSearch = (e) => {
    const searchTerm = e.target.value.toLowerCase();
    const filtered = rubriques.filter((corp) => {
      const corps = corp.corps ? corp.corps.toLowerCase() : "";
      const grade = corp.grade ? corp.grade.toLowerCase() : "";
      const indice = corp.indice ? corp.indice.toString() : "";

      return (
        corps.includes(searchTerm) ||
        grade.includes(searchTerm) ||
        indice.includes(searchTerm)
      );
    });

    setFilteredData(filtered);
  };

  const columns = [
    {
      title: "Corps",
      dataIndex: "corps",
      key: "corps",
      sorter: (a, b) => a.corps.localeCompare(b.corps),
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
      sorter: (a, b) => a.indice - b.indice,
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
        <Spin size="large" style={{ display: "block", margin: "20px auto" }} />
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
              <p>Aucune code trouvée.</p>
            </div>
          ) : (
            <div
              className="hide-scrollbar"
              style={{
                maxHeight: 1030,
                minHeight: 410,
                height: "calc(100vh - 290px)",
                overflowY: "auto",
              }}
            >
              {" "}
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

      <ModalCorps
        open={showModalCorps}
        onClose={() => setShowModalCorps(false)}
        corps={selectedCorps}
        onSuccess={() => {
          fetchRubriques();
          setShowModalCorps(false);
        }}
      />
    </Content>
  );
};

export default CodeCorps;
