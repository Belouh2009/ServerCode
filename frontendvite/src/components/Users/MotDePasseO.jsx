import React, { useState } from 'react';
import { Form, Input, Button, Alert, Spin } from 'antd';
import { LockOutlined, UserOutlined, KeyOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import Swal from 'sweetalert2';
import axios from 'axios';

const ForgotPassword = () => {
    const [loading, setLoading] = useState(false);
    const [messageError, setMessageError] = useState(null);
    const [messageSuccess, setMessageSuccess] = useState(null);
    const [userData, setUserData] = useState({}); // Stocke les infos utilisateur récupérées

    const handleFetchUser = async (matricule) => {
        try {
            const response = await axios.get(`http://192.168.88.53:8087/utilisateur/${matricule}`);
            setUserData(response.data); // stocke les infos sans les afficher
        } // Dans handleFetchUser
        catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Utilisateur introuvable',
                text: 'Aucun utilisateur trouvé avec ce matricule.',
            });
            console.error("Erreur lors de la récupération :", error);
        }
        
    };

    const handleForgotPassword = async (values) => {
        setLoading(true);
        setMessageError(null);
        setMessageSuccess(null);

        try {
            if (values.newPassword !== values.confirmPassword) {
                setLoading(false);
                Swal.fire({
                    icon: 'warning',
                    title: 'Erreur',
                    text: 'Les mots de passe ne correspondent pas !',
                });
                return;
            }

            // Envoie la mise à jour avec les infos récupérées
            const response = await axios.put('http://192.168.88.53:8087/utilisateur/update', {
                matricule: values.matricule,
                username: values.username,
                password: values.newPassword,
                nom: userData.nom || '',
                prenom: userData.prenom || '',
                division: userData.division || '',
                region: userData.region || '',
            });

            setLoading(false);
            if (response.status === 200) {
                Swal.fire({
                    icon: 'success',
                    title: 'Succès',
                    text: 'Votre mot de passe a été mis à jour avec succès !',
                });
            }
        } catch (error) {
            setLoading(false);
            Swal.fire({
                icon: 'error',
                title: 'Erreur',
                text: 'Échec de la mise à jour. Vérifiez vos informations.',
            });
            console.error(error);
        }
    };

    return (
        <div className="forgot-password-container" style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
            <Spin spinning={loading} size="large">
                <Form
                    onFinish={handleForgotPassword}
                    className="forgot-password-form"
                    style={{ maxWidth: 400, padding: 24, background: "#fff", borderRadius: 8, boxShadow: "0px 0px 10px rgba(0,0,0,0.1)" }}
                    onValuesChange={(changedValues) => {
                        if (changedValues.matricule && changedValues.matricule.length > 3) {
                            handleFetchUser(changedValues.matricule);
                        }
                    }}
                >
                    <h2 style={{ textAlign: "center", marginBottom: 20 }}>Réinitialisation du mot de passe</h2>

                    {messageError && (
                        <Alert
                            message={messageError}
                            type="error"
                            closable
                            onClose={() => setMessageError(null)}
                            style={{ marginBottom: 16 }}
                        />
                    )}
                    {messageSuccess && (
                        <Alert
                            message={messageSuccess}
                            type="success"
                            closable
                            onClose={() => setMessageSuccess(null)}
                            style={{ marginBottom: 16 }}
                        />
                    )}

                    <Form.Item name="matricule" rules={[{ required: true, message: "Veuillez entrer votre matricule !" }]}>
                        <Input prefix={<KeyOutlined />} placeholder="Matricule" />
                    </Form.Item>

                    <Form.Item name="username" rules={[{ required: true, message: "Veuillez entrer votre nom d'utilisateur !" }]}>
                        <Input prefix={<UserOutlined />} placeholder="Nom d'utilisateur" />
                    </Form.Item>

                    <Form.Item name="newPassword" rules={[{ required: true, message: "Veuillez entrer un nouveau mot de passe !" }]}>
                        <Input.Password prefix={<LockOutlined />} placeholder="Nouveau mot de passe" />
                    </Form.Item>

                    <Form.Item
                        name="confirmPassword"
                        rules={[
                            { required: true, message: "Veuillez confirmer votre mot de passe !" },
                            ({ getFieldValue }) => ({
                                validator(_, value) {
                                    if (!value || getFieldValue("newPassword") === value) {
                                        return Promise.resolve();
                                    }
                                    return Promise.reject(new Error("Les mots de passe ne correspondent pas !"));
                                },
                            }),
                        ]}
                    >
                        <Input.Password prefix={<LockOutlined />} placeholder="Confirmer le mot de passe" />
                    </Form.Item>

                    <Form.Item>
                        <Button type="primary" htmlType="submit" block>
                            Réinitialiser le mot de passe
                        </Button>
                    </Form.Item>

                    <div style={{ textAlign: "center" }}>
                        <Link to="/login">Retour à la connexion</Link>
                    </div>
                </Form>
            </Spin>
        </div>
    );
};

export default ForgotPassword;
