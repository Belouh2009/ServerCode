import React, { useState, useEffect } from 'react';
import { Layout, Input, Button, Upload, Table, Spin, Card, Typography } from 'antd';

const { Title } = Typography;
const { Content } = Layout;

const CodeRubrique = ({ darkTheme }) => {
  const [fileData, setFileData] = useState([]);
  const [rubriques, setRubriques] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filteredData, setFilteredData] = useState([]);

  // Fonction pour récupérer les rubriques depuis le backend
  const fetchRubriques = () => {
    setLoading(true);
    fetch('http://localhost:8087/rubriques/liste')
      .then(response => response.json())
      .then(data => {
        setRubriques(data);
        setFilteredData(data); // Mise à jour des données filtrées
        setLoading(false);
      })
      .catch(error => {
        setLoading(false);
        console.error('Erreur lors de la récupération des rubriques:', error);
      });
  };

  // Charger les rubriques à l'initialisation du composant
  useEffect(() => {
    fetchRubriques();
  }, []);


  const handleSearch = (e) => {
    const searchTerm = e.target.value.toLowerCase();
    const filtered = rubriques.filter(rubrique =>
      rubrique.idRubrique.toLowerCase().includes(searchTerm) ||
      rubrique.libelle.toLowerCase().includes(searchTerm)
    );
    setFilteredData(filtered);
  };

  const columns = [
    {
      title: 'ID Rubrique',
      dataIndex: 'idRubrique',
      key: 'idRubrique',
      sorter: (a, b) => a.idRubrique.localeCompare(b.idRubrique), // Tri alphabétique
      defaultSortOrder: 'ascend',  // Tri croissant par défaut
    },
    {
      title: 'Libellé',
      dataIndex: 'libelle',
      key: 'libelle',
      sorter: (a, b) => a.libelle.localeCompare(b.libelle), // Tri alphabétique
    },
  ];


  return (
    <Content style={{
      marginLeft: "10px", marginTop: "10px", padding: "24px",
      background: darkTheme ? "#001529" : "#fff",
      color: darkTheme ? "#ffffff" : "#000000",
      borderRadius: "10px 0 0 0", minHeight: "280px"
    }}>
      <Title level={2} style={{ color: darkTheme ? "#ffffff" : "#000000" }}>
        Liste des Codes Rubriques
      </Title>

      {loading ? (
        <div style={{ textAlign: "center", padding: "20px" }}>
          <Spin size="large" />
          <p>Chargement des données...</p>
        </div>
      ) : (
        <Card>
          <div style={{ marginTop: "5px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <Input type="search" placeholder="Rechercher..." onChange={handleSearch} style={{ width: "200px", marginBottom: "10px" }} />
          </div>

          {filteredData.length === 0 ? (
            <div style={{ textAlign: "center", padding: "20px" }}>
              <p>Aucune rubrique trouvée.</p>
            </div>
          ) : (
            <Table
              dataSource={filteredData}
              columns={columns}
              rowKey="idRubrique"
              pagination={{ position: ["bottomRight"], showSizeChanger: false }} scroll={{ y: 230 }} />
          )}
        </Card>
      )}


    </Content>
  );
};

export default CodeRubrique;
