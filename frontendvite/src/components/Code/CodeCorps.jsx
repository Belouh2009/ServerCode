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
import * as XLSX from "xlsx";
import Swal from "sweetalert2";
import ModalCorps from "./ModalCorps"; // Assurez-vous d'importer correctement ce composant Modal

const { Title } = Typography;
const { Content } = Layout;

const CodeCorps = () => {
  const [fileData, setFileData] = useState([]);
  const [rubriques, setRubriques] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filteredData, setFilteredData] = useState([]);
  const [showModalCorps, setShowModalCorps] = useState(false); // Correction de la variable pour afficher le modal
  const [selectedCorps, setSelectedCorps] = useState(null); // Correction de l'orthographe de "selectedCorps"

  // Fonction pour récupérer les rubriques depuis le backend
  const fetchRubriques = () => {
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
    fetchRubriques();
  }, []);

  const handleShowEditModal = (corps) => {
    Swal.fire({
      title: "Êtes-vous sûr ?",
      text: "Vous allez modifier cette code corps !",
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

  const handleFileUpload = (file) => {
    const reader = new FileReader();
    reader.onload = () => {
      const abuf = reader.result;
      const wb = XLSX.read(abuf, { type: "array" });
      const ws = wb.Sheets[wb.SheetNames[0]];
      const data = XLSX.utils.sheet_to_json(ws);

      // Adapter aux champs du modèle CodeCorps (sans id, qui est auto-généré)
      const formattedData = data.map((item) => ({
        corps: String(item["corps"] || "").substring(0, 10) || "Aucun",
        libelleCorps: item["libelle"] || "Aucun",
        categorie: item["categorie"] || "Aucun",
        grade: item["grade"] || "Aucun",
        indice: item["indice"] ? parseInt(item["indice"], 10) : null,
      }));

      setFileData(formattedData);
      sendToBackend(formattedData);
    };
    reader.readAsArrayBuffer(file);
    return false;
  };

  const sendToBackend = (data) => {
    fetch("http://localhost:8087/corps/import", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        Swal.fire({
          title: "Succès!",
          text: data.message,
          icon: "success",
          confirmButtonText: "OK",
        });
        fetchRubriques(); // Recharge les données
      })
      .catch((error) => {
        Swal.fire({
          title: "Erreur!",
          text: "Erreur lors de l'importation des données",
          icon: "error",
          confirmButtonText: "OK",
        });
        console.error("Erreur:", error);
      });
  };

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
    {
      title: "Actions",
      fixed: "right",
      width: 100,
      render: (_, record) => (
        <Button type="primary" onClick={() => handleShowEditModal(record)}>
          <RiFileEditFill size={15} />
        </Button>
      ),
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

            <Upload
              beforeUpload={handleFileUpload}
              showUploadList={false}
              accept=".xls,.xlsx"
            >
              <Button type="primary" icon={<UploadOutlined />}>
                Importer un fichier Excel
              </Button>
            </Upload>
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
                rowKey="id"
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
