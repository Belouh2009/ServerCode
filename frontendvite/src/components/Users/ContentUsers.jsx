import React, { useState, useEffect } from "react";
import axios from "axios";
import { Layout, Typography, Input, Button, Spin, Card, Form, Table, Select } from "antd";
import { FaCheck, FaTrash } from "react-icons/fa";
import Swal from "sweetalert2";

const { Content } = Layout;
const { Title } = Typography;

export default function ContentUsers({ darkTheme, status, setStatus }) {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [nonValideCount, setNonValideCount] = useState("");

    useEffect(() => {
        fetchUsers();  // Rafraîchir la liste des utilisateurs à chaque changement de statut
        updateNonValideCount();
    }, [status]);  // Utiliser `status` comme dépendance

    const updateNonValideCount = async () => {
        try {
            const response = await axios.get("http://192.168.88.53:8088/utilisateur/non-valide/count");
            setNonValideCount(response.data);
        } catch (error) {
            console.error("Erreur lors de la récupération du nombre d'utilisateurs non validés :", error);
        }
    };


    const fetchUsers = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`http://192.168.88.53:8088/utilisateur?status=${status}`);
            setUsers(response.data);
        } catch (error) {
            console.error("Erreur lors de la récupération des utilisateurs :", error);
            Swal.fire("Erreur", "Impossible de récupérer les utilisateurs", "error");
        } finally {
            setLoading(false);
        }
    };


    const validateUtilisateur = async (matricule) => {
        Swal.fire({
            title: "Êtes-vous sûr ?",
            text: "Vous allez valider cet utilisateur.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Oui, valider",
            cancelButtonText: "Annuler",
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    const response = await axios.post(`http://192.168.88.53:8088/utilisateur/valide/${matricule}`);
                    if (response.status === 200) {
                        Swal.fire("Succès", "Utilisateur validé avec succès !", "success");
                        setStatus("valid");
                        fetchUsers();
                        updateNonValideCount();
                    }
                } catch (error) {
                    console.error("Erreur lors de la validation :", error);
                }
            }
        });
    };

    const deleteUtilisateur = async (matricule) => {
        Swal.fire({
            title: "Êtes-vous sûr ?",
            text: "Vous allez supprimer cet utilisateur. Cette action est irréversible.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Oui",
            cancelButtonText: "Annuler",
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    const response = await axios.delete(`http://192.168.88.53:8088/utilisateur/delete/${matricule}`);
                    if (response.status === 200) {
                        Swal.fire("Succès", "Utilisateur supprimé avec succès !", "success");
                        fetchUsers();
                        updateNonValideCount();
                    }
                } catch (error) {
                    console.error("Erreur lors de la suppression :", error);
                    Swal.fire("Erreur", "Impossible de supprimer l'utilisateur", "error");
                }
            }
        });
    };

    const handleStatusChange = (value) => {
        setStatus(value);
    };

    const handleSearch = (event) => {
        setSearchQuery(event.target.value.toLowerCase());
    };

    const filteredUsers = users.filter((user) =>
        user.nom.toLowerCase().includes(searchQuery) ||
        user.prenom.toLowerCase().includes(searchQuery) ||
        user.username.toLowerCase().includes(searchQuery) ||
        user.division.toLowerCase().includes(searchQuery) ||
        user.email.toLowerCase().includes(searchQuery)
    );
    const columns = [
        {
            title: "Matricule",
            dataIndex: "matricule",
            sorter: (a, b) => a.matricule.localeCompare(b.matricule),
            defaultSortOrder: 'ascend',  // Tri croissant par défaut
        },
        {
            title: "Nom",
            dataIndex: "nom",
            sorter: (a, b) => a.nom.localeCompare(b.nom),
        },
        {
            title: "Prénom",
            dataIndex: "prenom",
            sorter: (a, b) => a.prenom.localeCompare(b.prenom),
        },
        {
            title: "Division",
            dataIndex: "division",
            sorter: (a, b) => a.division.localeCompare(b.division),
        },
        {
            title: "Nom d'utilisateur",
            dataIndex: "username",
            sorter: (a, b) => a.username.localeCompare(b.username),
        },
        {
            title: "Email",
            dataIndex: "email",
            sorter: (a, b) => a.email.localeCompare(b.email),
        },
        {
            title: "Actions",
            dataIndex: "actions",
            fixed: "right",
            width: 100,
            render: (_, record) => (
                <div>
                    {status === "invalid" ? (
                        <Button
                            type="primary"
                            onClick={() => validateUtilisateur(record.matricule)}
                            title="Valider cet utilisateur"
                        >
                            <FaCheck size={15} />
                        </Button>
                    ) : (
                        <Button type="primary" danger onClick={() => deleteUtilisateur(record.matricule)}>
                            <FaTrash size={15} />
                        </Button>
                    )}
                </div>
            ),
        },
    ];


    const formateTableData = filteredUsers.map((user) => ({
        key: user.matricule,
        matricule: user.matricule,
        nom: user.nom,
        prenom: user.prenom,
        username: user.username,
        division: user.division,
        email: user.email,
        actions: user.actions,
    }));

    return (
        <Content style={{
            marginLeft: "10px", marginTop: "10px", padding: "24px",
            background: darkTheme ? "#001529" : "#fff",
            color: darkTheme ? "#ffffff" : "#000000",
            borderRadius: "10px 0 0 0", minHeight: "280px"
        }}>
            <Title level={2} style={{ color: darkTheme ? "#ffffff" : "#000000" }}>
                Liste des Utilisateurs
            </Title>

            {loading ? (
                <div style={{ textAlign: "center", padding: "20px" }}>
                    <Spin size="large" />
                    <p>Chargement des données...</p>
                </div>
            ) : (
                <Card>
                   <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "10px" }}>
                        <Input
                            type="search"
                            placeholder="Rechercher..."
                            onChange={handleSearch}
                            style={{ width: "200px" }}
                        />

                        <Form.Item style={{ margin: 0 }}>
                            <Select
                                onChange={handleStatusChange}
                                value={status}
                                style={{ width: "150px" }}
                                className="select-filter"
                            >
                                <Select.Option value="valid">Validé</Select.Option>
                                <Select.Option value="invalid">Non Validé</Select.Option>
                            </Select>
                        </Form.Item>
                    </div>

                    {formateTableData.length === 0 ? (
                        <div style={{ textAlign: "center", padding: "20px" }}>
                            <p>Aucune utilisateur trouvé.</p>
                        </div>
                    ) : (
                        <Table
                            bordered
                            size="middle"
                            dataSource={formateTableData}
                            columns={columns}
                            rowKey="key"
                            pagination={{
                                pageSize: 4,          
                                position: ["bottomRight"],
                              }}
                              scroll={{ x: "max-content" }} 
                        />
                    )}
                </Card>
            )}
        </Content>

    );
}
