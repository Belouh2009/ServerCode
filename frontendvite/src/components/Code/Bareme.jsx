import React, { useState, useEffect } from "react";
import ReactSelect from "react-select";
import axios from "axios";
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
import {
  UploadOutlined,
  SearchOutlined,
  SyncOutlined,
} from "@ant-design/icons";
import { RiFileEditFill } from "react-icons/ri";
import * as XLSX from "xlsx";
import Swal from "sweetalert2";
import ModalBareme from "./ModalBareme";

const { Title } = Typography;
const { Content } = Layout;

const Bareme = () => {
  const [baremes, setBaremes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filteredData, setFilteredData] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedBareme, setSelectedBareme] = useState(null);
  const [datesBareme, setDatesBareme] = useState([]);
  const [categories, setCategories] = useState([]);
  const [indices, setIndices] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedCategorie, setSelectedCategorie] = useState(null);
  const [selectedIndice, setSelectedIndice] = useState(null);

  const formatDate = (dateStr) => {
    if (!dateStr) return "";

    // Si la date est déjà au bon format (venant du back)
    if (dateStr.includes("/")) return dateStr;

    // Si c'est une date Excel (nombre)
    if (typeof dateStr === "number") {
      return XLSX.SSF.format("dd/mm/yyyy", dateStr);
    }

    // Essayer différents formats de séparation
    const separators = ["-", "/", "."];
    for (const sep of separators) {
      if (dateStr.includes(sep)) {
        const parts = dateStr.split(sep);
        // Si on a 3 parties et que la première fait 4 chiffres (année)
        if (parts.length === 3 && parts[0].length === 4) {
          return `${parts[2]}${sep}${parts[1]}${sep}${parts[0]}`;
        }
        // Si format JJ/MM/AAAA
        if (parts.length === 3 && parts[2].length === 4) {
          return dateStr; // déjà au bon format
        }
      }
    }

    return dateStr; // retourne tel quel si format non reconnu
  };

  const fetchBaremes = () => {
    setLoading(true);
    axios
      .get("http://192.168.88.28:8087/bareme/all")
      .then((response) => {
        const formattedData = response.data.map((item) => {
          // Vérification supplémentaire pour le format de date
          let formattedDate = item.datebareme;
          if (item.datebareme) {
            formattedDate = formatDate(item.datebareme);
            // Si le formatage a échoué, on garde la valeur originale
            if (formattedDate.includes("undefined")) {
              formattedDate = item.datebareme;
            }
          }

          return {
            ...item,
            datebareme: formattedDate,
          };
        });

        setBaremes(formattedData);
        setFilteredData(formattedData);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Erreur de chargement:", err);
        setLoading(false);
      });
  };

  useEffect(() => {
    const fetchDates = async () => {
      try {
        const response = await axios.get("http://192.168.88.28:8087/bareme/dates");
        const options = response.data.map((date) => ({
          value: date,
          label: date,
        }));
        setDatesBareme(options);
      } catch (error) {
        console.error("Erreur lors du chargement des dates", error);
      }
    };
    fetchDates();
    fetchBaremes();
  }, []);

  useEffect(() => {
    if (selectedDate) {
      const fetchCategories = async () => {
        try {
          const response = await axios.get(
            `http://192.168.88.28:8087/bareme/categories?date=${selectedDate.value}`
          );
          const options = response.data.map((cat) => ({
            value: cat,
            label: `${cat}`,
          }));
          setCategories(options);
          setSelectedCategorie(null);
          setIndices([]);
        } catch (error) {
          console.error("Erreur lors du chargement des catégories", error);
        }
      };
      fetchCategories();
    }
  }, [selectedDate]);

  useEffect(() => {
    if (selectedDate && selectedCategorie) {
      const fetchIndices = async () => {
        try {
          const response = await axios.get(
            `http://192.168.88.28:8087/bareme/indices?date=${selectedDate.value}&categorie=${selectedCategorie.value}`
          );
          const options = response.data.map((indice) => ({
            value: indice,
            label: `${indice}`,
          }));
          setIndices(options);
          setSelectedIndice(null);
        } catch (error) {
          console.error("Erreur lors du chargement des indices", error);
        }
      };
      fetchIndices();
    }
  }, [selectedDate, selectedCategorie]);

  const handleFilterClick = () => {
    let filtered = baremes;

    if (selectedDate) {
      filtered = filtered.filter(
        (b) => b.datebareme === formatDate(selectedDate.value)
      );
    }

    if (selectedCategorie) {
      filtered = filtered.filter((b) => b.categorie == selectedCategorie.value);
    }

    if (selectedIndice) {
      filtered = filtered.filter((b) => b.indice == selectedIndice.value);
    }

    setFilteredData(filtered);
  };

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

  // Nouvelle fonction pour réinitialiser les filtres
  const handleResetFilters = () => {
    setSelectedDate(null);
    setSelectedCategorie(null);
    setSelectedIndice(null);
    setFilteredData(baremes); // Réaffiche toutes les données
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

      sendToBackend(formattedData);
    };
    reader.readAsArrayBuffer(file);
    return false;
  };

  const sendToBackend = (data) => {
    fetch("http://192.168.88.28:8087/bareme/import", {
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
          fetchBaremes();
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
        Table des Barèmes
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
              marginBottom: 10,
            }}
          >
            <Upload
              beforeUpload={handleFileUpload}
              showUploadList={false}
              accept=".xls,.xlsx"
            >
              <Button type="primary" icon={<UploadOutlined />}>Importer Excel</Button>
            </Upload>
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "flex-end",
              gap: "16px",
              marginBottom: "16px",
              flexWrap: "wrap",
            }}
          >
            {/* Date Select */}
            <div style={{ flex: "1 1 200px", minWidth: "200px" }}>
              <label style={{ display: "block", marginBottom: 4 }}>
                Date du barème
              </label>
              <ReactSelect
                options={datesBareme}
                value={selectedDate}
                onChange={setSelectedDate}
                placeholder="Sélectionnez une date"
              />
            </div>

            {/* Catégorie Select */}
            <div style={{ flex: "1 1 200px", minWidth: "200px" }}>
              <label style={{ display: "block", marginBottom: 4 }}>
                Catégorie
              </label>
              <ReactSelect
                options={categories}
                value={selectedCategorie}
                onChange={setSelectedCategorie}
                isDisabled={!selectedDate}
                placeholder={
                  selectedDate
                    ? "Sélectionnez une catégorie"
                    : "Choisissez d'abord une date"
                }
              />
            </div>

            {/* Indice Select */}
            <div style={{ flex: "1 1 200px", minWidth: "200px" }}>
              <label style={{ display: "block", marginBottom: 4 }}>
                Indice
              </label>
              <ReactSelect
                options={indices}
                value={selectedIndice}
                onChange={setSelectedIndice}
                isDisabled={!selectedCategorie}
                placeholder={
                  selectedCategorie
                    ? "Sélectionnez un indice"
                    : "Choisissez d'abord une catégorie"
                }
              />
            </div>

            {/* Boutons d'action */}
            <div
              style={{
                flex: "0 0 auto",
                display: "flex",
                marginTop: "24px",
                gap: "8px",
                alignSelf: "center",
              }}
            >
              <Button
                type="primary"
                icon={<SearchOutlined />}
                onClick={handleFilterClick}
                disabled={
                  !selectedDate && !selectedCategorie && !selectedIndice
                }
              >
                Rechercher
              </Button>
              <Button
                onClick={handleResetFilters}
                color="cyan"
                variant="solid"
                icon={<SyncOutlined />}
              >
                Actualiser
              </Button>
            </div>
          </div>
          <div
            className="hide-scrollbar"
            style={{
              maxHeight: 950,
              minHeight: 410,
              height: "calc(100vh - 380px)",
              overflowY: "auto",
            }}
          >
            <Table
              bordered
              size="middle"
              columns={columns}
              dataSource={filteredData}
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
