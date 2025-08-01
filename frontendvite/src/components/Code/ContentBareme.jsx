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
  Descriptions,
} from "antd";
import {
  UploadOutlined,
  SearchOutlined,
  SyncOutlined,
} from "@ant-design/icons";
import * as XLSX from "xlsx";

const { Title } = Typography;
const { Content } = Layout;

const Bareme = () => {
  const [filteredData, setFilteredData] = useState([]);
  const [datesBareme, setDatesBareme] = useState([]);
  const [categories, setCategories] = useState([]);
  const [indices, setIndices] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedCategorie, setSelectedCategorie] = useState(null);
  const [selectedIndice, setSelectedIndice] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedResult, setSelectedResult] = useState(null);

  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    if (dateStr.includes("/")) return dateStr;
    if (typeof dateStr === "number") {
      return XLSX.SSF.format("dd/mm/yyyy", dateStr);
    }
    const separators = ["-", "/", "."];
    for (const sep of separators) {
      if (dateStr.includes(sep)) {
        const parts = dateStr.split(sep);
        if (parts.length === 3 && parts[0].length === 4) {
          return `${parts[2]}${sep}${parts[1]}${sep}${parts[0]}`;
        }
        if (parts.length === 3 && parts[2].length === 4) {
          return dateStr;
        }
      }
    }
    return dateStr;
  };

  useEffect(() => {
    const fetchDates = async () => {
      try {
        const response = await axios.get("http://192.168.88.53:8087/bareme/dates");
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
  }, []);

  useEffect(() => {
    if (selectedDate) {
      const fetchCategories = async () => {
        try {
          const response = await axios.get(
            `http://192.168.88.53:8087/bareme/categories?date=${selectedDate.value}`
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
            `http://192.168.88.53:8087/bareme/indices?date=${selectedDate.value}&categorie=${selectedCategorie.value}`
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

  const handleFilterClick = async () => {
    setLoading(true);
    try {
      const response = await axios.get("http://192.168.88.53:8087/bareme/all");
      let filtered = response.data;

      if (selectedDate) {
        filtered = filtered.filter(
          (b) => b.datebareme === formatDate(selectedDate.value)
        );
      }
      if (selectedCategorie) {
        filtered = filtered.filter(
          (b) => b.categorie === selectedCategorie.value
        );
      }
      if (selectedIndice) {
        filtered = filtered.filter((b) => b.indice === selectedIndice.value);
      }

      setFilteredData(filtered);
      if (filtered.length > 0) {
        setSelectedResult(filtered[0]);
      } else {
        setSelectedResult(null);
      }
    } catch (error) {
      console.error("Erreur lors du filtrage des données", error);
    } finally {
      setLoading(false);
    }
  };

  const handleResetFilters = () => {
    setSelectedDate(null);
    setSelectedCategorie(null);
    setSelectedIndice(null);
    setFilteredData([]);
    setSelectedResult(null);
  };

  const calculateSolde = (result) => {
    if (!result) return 0;
    return (
      (result.v500 || 0) +
      (result.v501 || 0) +
      (result.v502 || 0) +
      (result.v503 || 0) +
      (result.v506 || 0)
    );
  };

  const rubriquesColumns = [
    {
      title: "Rubrique",
      dataIndex: "rubrique",
      key: "rubrique",
    },
    {
      title: "Montant",
      dataIndex: "montant",
      key: "montant",
      render: (text) =>
        text.toLocaleString("fr-FR", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        }),
    },
  ];

  const boldLabelStyle = { fontWeight: "bold" };

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
        position: 'relative', // Ajouté pour le positionnement du spinner
      }}
    >
      <Title level={2} style={{ color: "#1e88e5", marginBottom: "20px" }}>
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
              alignItems: "flex-end",
              gap: "16px",
              marginBottom: "16px",
              flexWrap: "wrap",
            }}
          >
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
              <Button onClick={handleResetFilters} icon={<SyncOutlined />}>
                Actualiser
              </Button>
            </div>
          </div>

          {filteredData.length > 0 && (
            <div style={{ display: "flex", gap: "20px", marginBottom: "20px" }}>
              {selectedResult && (
                <div
                  className="hide-scrollbar"
                  style={{
                    maxHeight: 1030,
                    minHeight: 410,
                    height: "calc(100vh - 390px)",
                    overflowY: "auto",
                    flex: 1,
                  }}
                >
                  <Descriptions
                    title={`Barème ${selectedResult.datebareme}`}
                    bordered
                    column={1}
                  >
                    <Descriptions.Item
                      label="Catégorie"
                      labelStyle={boldLabelStyle}
                    >
                      {selectedResult.categorie}
                    </Descriptions.Item>
                    <Descriptions.Item
                      label="Indice"
                      labelStyle={boldLabelStyle}
                    >
                      {selectedResult.indice}
                    </Descriptions.Item>
                  </Descriptions>

                  <Table
                    style={{ marginTop: "20px" }}
                    bordered
                    size="middle"
                    columns={rubriquesColumns}
                    dataSource={[
                      { rubrique: "500", montant: selectedResult.v500 || 0 },
                      { rubrique: "501", montant: selectedResult.v501 || 0 },
                      { rubrique: "502", montant: selectedResult.v502 || 0 },
                      { rubrique: "503", montant: selectedResult.v503 || 0 },
                      { rubrique: "506", montant: selectedResult.v506 || 0 },
                      {
                        rubrique: "Solde",
                        montant: calculateSolde(selectedResult),
                      },
                    ]}
                    rowKey="rubrique"
                    pagination={false}
                    rowClassName={() => "table-row-hover"}
                    className="styled-table"
                  />
                </div>
              )}
            </div>
          )}
        </Card>
      )}
    </Content>
  );
};

export default Bareme;
