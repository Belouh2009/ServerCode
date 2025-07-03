import React, { useState, useEffect } from 'react';
import { Layout, Input, Button, Upload, Table, Spin, Card, Typography } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { RiFileEditFill } from "react-icons/ri";
import * as XLSX from 'xlsx';
import Swal from 'sweetalert2';
import ModalZone from './ModalZone'; 

const { Title } = Typography;
const { Content } = Layout;

const CodeZone = ({ darkTheme }) => {
  const [fileData, setFileData] = useState([]);
  const [zones, setZones] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filteredData, setFilteredData] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [showModalZone, setShowModalZone] = useState(false);
  const [selectedZone, setSelectedZone] = useState(null);


  const fetchZones = () => {
    setLoading(true);
    fetch('http://localhost:8087/zones/all')
      .then(response => response.json())
      .then(data => {
        setZones(data);
        setFilteredData(data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Erreur lors de la récupération des rubriques:', error);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchZones();
    setZones(prevZones =>
      prevZones.map(zone => ({
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


  const handleShowEditModal = (zone) => {
    Swal.fire({
      title: "Êtes-vous sûr ?",
      text: "Vous allez modifier cette code zone !",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Oui",
      cancelButtonText: "Annuler",
    }).then((result) => {
      if (result.isConfirmed) {
        setSelectedZone(zone);
        setIsEditing(true);
        setShowModalZone(true);
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
        district: item["District"] || "Aucun",
        zone0: item["Zone 0"] || "Aucun",
        zone1: item["Zone 1"] || "Aucun",
        codeZone1: item["Code Zone 1"] || "Aucun",
        zone2: item["Zone 2"] || "Aucun",
        codeZone2: item["Code Zone 2"] || "Aucun",
        zone3: item["Zone 3"] || "Aucun",
        codeZone3: item["Code Zone 3"] || "Aucun",
      }));

      setFileData(formattedData);  // Mise à jour des données affichées
      sendToBackend(formattedData);  // Envoi des données filtrées au backend
    };
    reader.readAsArrayBuffer(file);
    return false; // Empêche l'action par défaut de l'Upload
  };



  const sendToBackend = (data) => {
    fetch('http://localhost:8087/zones/import', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
      .then(response => response.json())
      .then((data) => {
        Swal.fire({ title: 'Succès!', text: data.message, icon: 'success', confirmButtonText: 'OK' });
        fetchZones();
      })
      .catch((error) => {
        Swal.fire({ title: 'Erreur!', text: "Erreur lors de l'importation des données", icon: 'error', confirmButtonText: 'OK' });
        console.error('Erreur:', error);
      });
  };
  const handleSearch = (e) => {
    const searchTerm = e.target.value.toLowerCase();

    const filtered = zones.filter(zones => {
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
      title: 'District',
      dataIndex: 'district',
      key: 'district',
      sorter: (a, b) => a.district.localeCompare(b.district),
      defaultSortOrder: 'ascend',  // Tri croissant par défaut
    },
    {
      title: 'Zone 0',
      dataIndex: 'zone0',
      key: 'zone0',
      sorter: (a, b) => a.zone0.localeCompare(b.zone0)
    },
    {
      title: 'Zone 1',
      dataIndex: 'zone1',
      key: 'zone1',
      sorter: (a, b) => a.zone1.localeCompare(b.zone1)
    },

    {
      title: 'Zone 2',
      dataIndex: 'zone2',
      key: 'zone2',
      sorter: (a, b) => a.zone2.localeCompare(b.zone2)
    },

    {
      title: 'Code Zone 2',
      dataIndex: 'codeZone2',
      key: 'codeZone2',
      sorter: (a, b) => a.codeZone2.localeCompare(b.codeZone2)
    },

    {
      title: 'Zone 3',
      dataIndex: 'zone3',
      key: 'zone3',
      sorter: (a, b) => a.zone3.localeCompare(b.zone3)
    },

    {
      title: 'Code Zone 3',
      dataIndex: 'codeZone3',
      key: 'codeZone3',
      sorter: (a, b) => a.codeZone3.localeCompare(b.codeZone3)
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
      <Title level={2} style={{ color: darkTheme ? "#fff" : "#000" }}>Liste des Codes Zones</Title>
      {loading ? (
        <Spin size="large" style={{ display: 'block', margin: '20px auto' }} />
      ) : (
        <Card>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "10px" }}>
            <Input
              type="search"
              placeholder="Rechercher..."
              onChange={handleSearch}
              style={{ width: "200px" }} />
            <Upload beforeUpload={handleFileUpload} showUploadList={false} accept=".xls,.xlsx">
              <Button type='primary' icon={<UploadOutlined />}>Importer un fichier Excel</Button>
            </Upload>
          </div>

          {filteredData.length === 0 ? (
            <div style={{ textAlign: "center", padding: "20px" }}>
              <p>Aucune code corps trouvée.</p>
            </div>
          ) : (
            <Table dataSource={filteredData}
              columns={columns}
              rowKey={(record, index) => `${record.district}-${index}`}  // Générer des clés uniques
              pagination={{ position: ["bottomRight"], showSizeChanger: false }} scroll={{ y: 230 }} />
          )}
        </Card>
      )}

      <ModalZone
        darkTheme={darkTheme}
        open={showModalZone}
        onClose={() => setShowModalZone(false)}
        zone={selectedZone}
        onSuccess={fetchZones}
      />
    </Content>
  );
};

export default CodeZone;
