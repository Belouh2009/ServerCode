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
import axios from "axios";
import Swal from "sweetalert2"; // SweetAlert2 importé
import ModalModifCorpsGradeIndice from "./ModalCorpsGradeIndice";

const { Title } = Typography;
const { Content } = Layout;

const CodeCorps = () => {
  const [fileData, setFileData] = useState([]);
  const [rubriques, setRubriques] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filteredData, setFilteredData] = useState([]);
  const [showModalCorps, setShowModalCorps] = useState(false);
  const [selectedCorps, setSelectedCorps] = useState(null);
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState("");

  useEffect(() => {
    fetchRubriques();
  }, []);

  const fetchRubriques = () => {
    setLoading(true);
    axios
      .get("http://192.168.88.53:8087/CorpsGradeIndice/all")
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
      text: "Vous allez modifier ces codes !",
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

  const handleFileUpload = async (file) => {
    setProgress(0);
    setStatus("Lecture du fichier...");

    try {
      const data = await file.arrayBuffer();
      const workbook = XLSX.read(data);
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      const jsonData = XLSX.utils.sheet_to_json(worksheet);

      setProgress(30);
      setStatus("Traitement des données Excel...");

      const processedData = processFileData(jsonData);
      setFileData(processedData);

      setProgress(60);
      setStatus("Envoi des données au serveur...");

      await axios.post(
        "http://192.168.88.53:8087/CorpsGradeIndice/import",
        processedData,
        {
          headers: { "Content-Type": "application/json" },
          onUploadProgress: (progressEvent) => {
            const percentCompleted = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            setProgress(60 + percentCompleted * 0.4);
          },
        }
      );

      setStatus("Import réussi !");
      setProgress(100);

      Swal.fire({
        title: "Succès",
        text: "Les données ont été importées avec succès !",
        icon: "success",
      });

      fetchRubriques();
    } catch (error) {
      Swal.fire({
        title: "Erreur",
        text: "Échec de l'importation des données. Vérifiez le fichier ou réessayez.",
        icon: "error",
      });
      setStatus("Erreur lors de l'importation.");
      setProgress(0);
    }
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
        Liste des Codes Corps, Grades et Indices
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

      <ModalModifCorpsGradeIndice
        open={showModalCorps}
        onClose={() => setShowModalCorps(false)}
        corpsgradeindice={selectedCorps}
        onSuccess={() => {
          fetchRubriques();
          setShowModalCorps(false);
        }}
      />
    </Content>
  );
};

export default CodeCorps;
