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
import ModalBareme from "./ModalBareme"; // Assure-toi d'avoir ce composant modal

const { Title } = Typography;
const { Content } = Layout;

const Bareme = () => {
  const [fileData, setFileData] = useState([]);
  const [baremes, setBaremes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filteredData, setFilteredData] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedBareme, setSelectedBareme] = useState(null);

  const fetchBaremes = () => {
    setLoading(true);
    fetch("http://localhost:8087/bareme/all")
      .then((res) => res.json())
      .then((data) => {
        setBaremes(data);
        setFilteredData(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Erreur de chargement:", err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchBaremes();
  }, []);

  const handleShowEditModal = (record) => {
    Swal.fire({
      title: "Êtes-vous sûr ?",
      text: "Vous allez modifier cette ligne de barème !",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Oui",
      cancelButtonText: "Annuler",
    }).then((result) => {
      if (result.isConfirmed) {
        setSelectedBareme(record);
        setShowModal(true);
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

      const formattedData = data.map((item) => ({
        datebareme:
          typeof item.DATEBAREME === "number"
            ? XLSX.SSF.format("dd/mm/yyyy", item.DATEBAREME)
            : item.DATEBAREME,
        categorie: item.CATEGORIE,
        indice: item.INDICE,
        v500: item.V500,
        v501: item.V501,
        v502: item.V502,
        v503: item.V503,
        v506: item.V506,
        solde: item.SOLDE,
      }));

      setFileData(formattedData);
      sendToBackend(formattedData);
    };
    reader.readAsArrayBuffer(file);
    return false;
  };

  const sendToBackend = (data) => {
    fetch("http://localhost:8087/bareme/import", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then(async (res) => {
        const isJson = res.headers
          .get("content-type")
          ?.includes("application/json");

        const result = isJson
          ? await res.json()
          : { message: "Importation réussie" };

        if (res.ok) {
          Swal.fire("Succès", result.message, "success");
          fetchBaremes(); // recharge les données
        } else {
          Swal.fire(
            "Erreur",
            result.message || "Erreur lors de l'importation",
            "error"
          );
        }
      })
      .catch((err) => {
        Swal.fire("Erreur", "Erreur réseau ou serveur", "error");
        console.error("Erreur import:", err);
      });
  };

  const handleSearch = (e) => {
    const search = e.target.value.toLowerCase();
    const filtered = baremes.filter((b) =>
      Object.values(b).some(
        (v) => v && v.toString().toLowerCase().includes(search)
      )
    );
    setFilteredData(filtered);
  };

  const columns = [
    { title: "Date", dataIndex: "datebareme", key: "datebareme" },
    { title: "Catégorie", dataIndex: "categorie", key: "categorie" },
    { title: "Indice", dataIndex: "indice", key: "indice" },
    { title: "V500", dataIndex: "v500", key: "v500" },
    { title: "V501", dataIndex: "v501", key: "v501" },
    { title: "V502", dataIndex: "v502", key: "v502" },
    { title: "V503", dataIndex: "v503", key: "v503" },
    { title: "V506", dataIndex: "v506", key: "v506" },
    { title: "Solde", dataIndex: "solde", key: "solde" },
    {
      title: "Actions",
      render: (_, record) => (
        <Button type="primary" onClick={() => handleShowEditModal(record)}>
          <RiFileEditFill size={15} />
        </Button>
      ),
    },
  ];

  return (
    <Content style={{ padding: 24, minHeight: 280 }}>
      <Title level={2}>Table des Barèmes</Title>
      {loading ? (
        <Spin size="large" />
      ) : (
        <Card>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: 16,
            }}
          >
            <Input
              placeholder="🔍 Rechercher..."
              onChange={handleSearch}
              style={{ width: 200 }}
            />
            <Upload
              beforeUpload={handleFileUpload}
              showUploadList={false}
              accept=".xls,.xlsx"
            >
              <Button icon={<UploadOutlined />}>Importer Excel</Button>
            </Upload>
          </div>
          <div
            style={{
              maxHeight: 830,
              minHeight: 410,
              height: "calc(100vh - 250px)", // ajuste cette valeur selon ton layout (navbar, header, etc.)
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
                pageSize: 40,
                position: ["bottomRight"],
                showSizeChanger: false,
              }}
              scroll={{ y: "100%" }} // prend 100% de la hauteur disponible
              rowClassName={() => "table-row-hover"}
              className="styled-table"
            />
          </div>
        </Card>
      )}
      <ModalBareme
        open={showModal}
        onClose={() => setShowModal(false)}
        bareme={selectedBareme}
        onSuccess={() => {
          fetchBaremes();
          setShowModal(false);
        }}
      />
    </Content>
  );
};

export default Bareme;
