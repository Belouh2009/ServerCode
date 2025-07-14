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

const { Title } = Typography;
const { Content } = Layout;

const CodeZone = ({ darkTheme }) => {
  const [zones, setZones] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filteredData, setFilteredData] = useState([]);

  const fetchZones = () => {
    setLoading(true);
    fetch("http://localhost:8087/zones/all")
      .then((response) => response.json())
      .then((data) => {
        setZones(data);
        setFilteredData(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Erreur lors de la récupération des rubriques:", error);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchZones();
    setZones((prevZones) =>
      prevZones.map((zone) => ({
        district: zone.district || "",
        zone0: zone.zone0 || "",
        zone1: zone.zone1 || "",
        codeZone1: zone.codeZone1 || "",
        zone2: zone.zone2 || "",
        codeZone2: zone.codeZone2 || "",
        zone3: zone.zone3 || "",
        codeZone3: zone.codeZone3 || "",
      }))
    );
  }, []);

  const handleSearch = (e) => {
    const searchTerm = e.target.value.toLowerCase();

    const filtered = zones.filter((zones) => {
      const district = zones.district ? zones.district.toLowerCase() : "";
      const zone0 = zones.zone0 ? zones.zone0.toLowerCase() : "";
      const zone1 = zones.zone1 ? zones.zone1.toLowerCase() : "";
      const codeZone1 = zones.codeZone1 ? zones.codeZone1.toLowerCase() : "";
      const zone2 = zones.zone2 ? zones.zone2.toLowerCase() : "";
      const codeZone2 = zones.codeZone2 ? zones.codeZone2.toLowerCase() : "";
      const zone3 = zones.zone3 ? zones.zone3.toLowerCase() : "";
      const codeZone3 = zones.codeZone3 ? zones.codeZone3.toLowerCase() : "";

      return (
        district.includes(searchTerm) ||
        zone0.includes(searchTerm) ||
        zone1.includes(searchTerm) ||
        codeZone1.includes(searchTerm) ||
        zone2.includes(searchTerm) ||
        codeZone2.includes(searchTerm) ||
        zone3.includes(searchTerm) ||
        codeZone3.includes(searchTerm)
      );
    });

    setFilteredData(filtered);
  };

  const columns = [
    {
      title: "District",
      dataIndex: "district",
      key: "district",
      sorter: (a, b) => a.district.localeCompare(b.district),
      defaultSortOrder: "ascend", // Tri croissant par défaut
    },
    {
      title: "Zone 0",
      dataIndex: "zone0",
      key: "zone0",
      sorter: (a, b) => a.zone0.localeCompare(b.zone0),
    },
    {
      title: "Zone 1",
      dataIndex: "zone1",
      key: "zone1",
      sorter: (a, b) => a.zone1.localeCompare(b.zone1),
    },

    {
      title: "Zone 2",
      dataIndex: "zone2",
      key: "zone2",
      sorter: (a, b) => a.zone2.localeCompare(b.zone2),
    },

    {
      title: "Code Zone 2",
      dataIndex: "codeZone2",
      key: "codeZone2",
      sorter: (a, b) => a.codeZone2.localeCompare(b.codeZone2),
    },

    {
      title: "Zone 3",
      dataIndex: "zone3",
      key: "zone3",
      sorter: (a, b) => a.zone3.localeCompare(b.zone3),
    },

    {
      title: "Code Zone 3",
      dataIndex: "codeZone3",
      key: "codeZone3",
      sorter: (a, b) => a.codeZone3.localeCompare(b.codeZone3),
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
        Liste des Codes Zones
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
              <p>Aucune code zone trouvée.</p>
            </div>
          ) : (
            <Table
              bordered
              size="middle"
              scroll={{ y: 410 }}
              rowClassName={() => "table-row-hover"}
              className="styled-table"
              dataSource={filteredData}
              columns={columns}
              rowKey={(record, index) => `${record.district}-${index}`}
              pagination={{ position: ["bottomRight"], showSizeChanger: false }}
            />
          )}
        </Card>
      )}
    </Content>
  );
};

export default CodeZone;
