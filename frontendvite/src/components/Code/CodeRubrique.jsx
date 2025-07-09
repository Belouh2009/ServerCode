import React, { useState, useEffect } from 'react';
import { Layout, Input, Button, Upload, Table, Spin, Card, Typography } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { RiFileEditFill } from "react-icons/ri";
import * as XLSX from 'xlsx';
import Swal from 'sweetalert2';
import ModalRubrique from './ModalRubrique';

const { Title } = Typography;
const { Content } = Layout;

const CodeRubrique = ({ darkTheme }) => {
  const [fileData, setFileData] = useState([]);
  const [rubriques, setRubriques] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filteredData, setFilteredData] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [showModalRubrique, setshowModalRubrique] = useState(false);
  const [selectedRubrique, setselectedRubrique] = useState(null);

  // Fonction pour récupérer les rubriques depuis le backend
  const fetchRubriques = () => {
    setLoading(true);
    fetch('http://192.168.88.53:8088/rubriques/liste')
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

  // Fonction pour afficher le modal d'édition
  const handleShowEditModal = (rubrique) => {
    Swal.fire({
      title: "Êtes-vous sûr ?",
      text: "Vous allez modifier cette code rubrique!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Oui",
      cancelButtonText: "Annuler",
    }).then((result) => {
      if (result.isConfirmed) {
        setselectedRubrique(rubrique);
        setIsEditing(true);
        setshowModalRubrique(true);
      }
    });
  };

  const handleFileUpload = (file) => {
    const reader = new FileReader();
    reader.onload = () => {
      const abuf = reader.result;
      const wb = XLSX.read(abuf, { type: 'array' });
      const ws = wb.Sheets[wb.SheetNames[0]];
      const data = XLSX.utils.sheet_to_json(ws);

      const formattedData = data.map(item => ({
        idRubrique:String(item["Code"] || "").substring(0, 10) || "Aucun",
        libelle: item["Salaire de base"] || "Aucun",
      }));

      setFileData(formattedData);
      sendToBackend(formattedData);
    };
    reader.readAsArrayBuffer(file);
    return false;
  };

  const sendToBackend = (data) => {
    fetch('http://192.168.88.53:8088/rubriques/import', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
      .then(response => response.json())
      .then((data) => {
        if (data.message) {
          Swal.fire({ title: 'Succès!', text: data.message, icon: 'success', confirmButtonText: 'OK' });
          fetchRubriques(); // Recharger les rubriques après l'importation
        }
      })
      .catch((error) => {
        Swal.fire({ title: 'Erreur!', text: "Erreur lors de l'importation des données", icon: 'error', confirmButtonText: 'OK' });
        console.error('Erreur:', error);
      });
  };

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
    {
      title: "Actions",
      fixed: 'right',
      width: 100,
      render: (_, record) => (
        <div style={{ display: "flex", justifyContent: "center" }}>
          <Button type="primary" onClick={() => handleShowEditModal(record)}>
            <RiFileEditFill size={15} />
          </Button>
        </div>
      ),
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
            <Upload beforeUpload={handleFileUpload} showUploadList={false} accept=".xls,.xlsx">
              <Button style={{ marginBottom: "10px" }} type='primary' icon={<UploadOutlined />}>Importer un fichier Excel</Button>
            </Upload>
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

      <ModalRubrique
        open={showModalRubrique}
        onClose={() => setshowModalRubrique(false)}
        rubrique={selectedRubrique}
        onSuccess={() => {
          fetchRubriques();  // Recharger les rubriques après modification
          setshowModalRubrique(false);
        }}
      />
    </Content>
  );
};

export default CodeRubrique;
