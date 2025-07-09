import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Form, Input, Button, Alert, Spin, message } from "antd";
import { LockOutlined, UserOutlined } from "@ant-design/icons";
import './style.css'

export default function Login() {
    const [loading, setLoading] = useState(false);
    const [messageError, setMessageError] = useState(null);
    const navigate = useNavigate();

    const handleLogin = async (values) => {
        const { username, password } = values;

        setLoading(true);
        setMessageError(null);

        if (username === "Admin" && password === "admin") {
            localStorage.setItem("username", username); // Correctif ici
            localStorage.setItem("role", "admin");

            // Déclencher un événement storage
            window.dispatchEvent(new Event("storage"));

            message.success("Connexion réussie !");
            setTimeout(() => {
                navigate("/utilisateurs");
                setLoading(false);
            }, 1000);
            return;
        }

        try {
            const response = await fetch(`http://192.168.88.53:8088/utilisateur/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username, password }) // Envoie le JSON dans le body
            });
            
            if (!response.ok) throw new Error("Échec de la connexion");
            
            const data = await response.json(); // Récupère l'objet JSON
            const { message: msg, user } = data;
            
            if (msg === "Connexion réussie") {
                localStorage.setItem("username", user.username);
                localStorage.setItem("division", user.division);
                localStorage.setItem("role", "user");
            
                message.success(msg);
            
                // Redirige selon la division
                setTimeout(() => {
                    if (user.division === "Pension") {
                        navigate("/pension");
                    } else if (user.division === "Solde") {
                        navigate("/solde");
                    } else {
                        navigate("/utilisateurs");
                    }
                }, 1000);
            } else {
                setMessageError("Nom d'utilisateur ou mot de passe incorrect");
            }            
        } catch (error) {
            setMessageError("Nom d'utilisateur ou mot de passe incorrect");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-container" style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
            <Spin spinning={loading} size="large">
                <Form onFinish={handleLogin} className="login-form" style={{ maxWidth: 400, padding: 24, background: "#fff", borderRadius: 8, boxShadow: "0px 0px 10px rgba(0,0,0,0.1)" }}>
                    <h2 style={{ textAlign: "center", marginBottom: 20 }}>Connexion</h2>

                    {messageError && (
                        <Alert message={messageError} type="error" closable onClose={() => setMessageError(null)} style={{ marginBottom: 16 }} />
                    )}

                    <Form.Item name="username" rules={[{ required: true, message: "Veuillez entrer votre nom d'utilisateur !" }]}>
                        <Input prefix={<UserOutlined />} placeholder="Nom d'utilisateur" />
                    </Form.Item>

                    <Form.Item name="password" rules={[{ required: true, message: "Veuillez entrer votre mot de passe !" }]}>
                        <Input.Password prefix={<LockOutlined />} placeholder="Mot de passe" />
                    </Form.Item>

                    <Form.Item>
                        <Button type="primary" htmlType="submit" block>
                            Se connecter
                        </Button>
                    </Form.Item>

                    <div style={{ textAlign: "center" }}>
                        <Link to="/registre">Créer un compte</Link> |
                        <Link to="/motdepasse">Mot de passe oublié?</Link>
                    </div>
                </Form>
            </Spin>
        </div>
    );
}
