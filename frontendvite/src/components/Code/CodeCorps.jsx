import React, { useState, useEffect } from 'react';
import { Layout, Input, Button, Upload, Table, Spin, Card, Typography } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { RiFileEditFill } from "react-icons/ri";
import * as XLSX from 'xlsx';
import Swal from 'sweetalert2';
import ModalCorps from './ModalCorps';  // Assurez-vous d'importer correctement ce composant Modal

const { Title } = Typography;
const { Content } = Layout;

const CodeCorps = ({ darkTheme }) => {
  const [fileData, setFileData] = useState([]);
  const [rubriques, setRubriques] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filteredData, setFilteredData] = useState([]);
  const [showModalCorps, setShowModalCorps] = useState(false); // Correction de la variable pour afficher le modal
  const [selectedCorps, setSelectedCorps] = useState(null);    // Correction de l'orthographe de "selectedCorps"

  // Fonction pour récupérer les rubriques depuis le backend
  const fetchRubriques = () => {
    setLoading(true);
    fetch('http://localhost:8087/corps/all')
      .then(response => response.json())
      .then(data => {
        setRubriques(data);
        setFilteredData(data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Erreur lors de la récupération des rubriques:', error);
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
      const wb = XLSX.read(abuf, { type: 'array' });
      const ws = wb.Sheets[wb.SheetNames[0]];
      const data = XLSX.utils.sheet_to_json(ws);

      // Filtrer uniquement les colonnes nécessaires (id_corps, libelle, categorie)
      const formattedData = data.map(item => ({
        idCorps: String(item["Code Corps"] || "").substring(0, 10) || "Aucun",
        libelleCorps: item["Corps Libelle"] || "Aucun",
        categorie: item["Categorie"] || "Aucun"
      }));

      setFileData(formattedData);
      sendToBackend(formattedData);
    };
    reader.readAsArrayBuffer(file);
    return false;
  };

  const sendToBackend = (data) => {
    fetch('http://localhost:8087/corps/import', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
      .then(response => response.json())
      .then((data) => {
        Swal.fire({ title: 'Succès!', text: data.message, icon: 'success', confirmButtonText: 'OK' });
        fetchRubriques();
      })
      .catch((error) => {
        Swal.fire({ title: 'Erreur!', text: "Erreur lors de l'importation des données", icon: 'error', confirmButtonText: 'OK' });
        console.error('Erreur:', error);
      });
  };

  const handleSearch = (e) => {
    const searchTerm = e.target.value.toLowerCase();
    const filtered = rubriques.filter(corps => {
      const idCorps = corps.idCorps ? corps.idCorps.toLowerCase() : "";
      const libelleCorps = corps.libelleCorps ? corps.libelleCorps.toLowerCase() : "";
      const categorie = corps.categorie ? corps.categorie.toLowerCase() : "";

      return (
        idCorps.includes(searchTerm) ||
        libelleCorps.includes(searchTerm) ||
        categorie.includes(searchTerm)
      );
    });

    setFilteredData(filtered);
  };

  const columns = [
    {
      title: 'ID Corps',
      dataIndex: 'idCorps',
      key: 'idCorps',
      sorter: (a, b) => a.idCorps.localeCompare(b.idCorps),
      defaultSortOrder: 'ascend',
    },
    {
      title: 'Libellé',
      dataIndex: 'libelleCorps',
      key: 'libelleCorps',
      sorter: (a, b) => a.libelleCorps.localeCompare(b.libelleCorps)
    },
    {
      title: 'Catégorie',
      dataIndex: 'categorie',
      key: 'categorie',
      sorter: (a, b) => a.categorie.localeCompare(b.categorie)
    },
    {
      title: "Actions",
      fixed: 'right',
      width: 100,
      render: (_, record) => (
        <Button type="primary" onClick={() => handleShowEditModal(record)}>
          <RiFileEditFill size={15} />
        </Button>
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
      <Title level={2} style={{ color: darkTheme ? "#fff" : "#000" }}>Liste des Codes Corps</Title>
      {loading ? (
        <Spin size="large" style={{ display: 'block', margin: '20px auto' }} />
      ) : (
        <Card>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "10px" }}>
            <Input type="search" placeholder="Rechercher..." onChange={handleSearch} style={{ width: "200px" }} />

            <Upload beforeUpload={handleFileUpload} showUploadList={false} accept=".xls,.xlsx">
              <Button type='primary' icon={<UploadOutlined />}>Importer un fichier Excel</Button>
            </Upload>
          </div>

          {filteredData.length === 0 ? (
            <div style={{ textAlign: "center", padding: "20px" }}>
              <p>Aucun code corps trouvé.</p>
            </div>
          ) : (
            <Table
              dataSource={filteredData}
              columns={columns}
              rowKey="idCorps"
              pagination={{
                position: ["bottomRight"],
                showSizeChanger: false
              }}
              scroll={{ y: 230 }} />
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
