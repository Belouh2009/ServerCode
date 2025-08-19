import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Form, Input, Button, Alert, Spin, message } from "antd";
import { LockOutlined, UserOutlined } from "@ant-design/icons";
import loginImage from "../image/login2.jpg";
import background from "../image/bureau3.jpg";
import "./style.css";

export default function Login() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [checkingAuth, setCheckingAuth] = useState(true); // ✅ Nouvel état
  const [form] = Form.useForm();
  const navigate = useNavigate();

  // ✅ Vérifie si déjà connecté et redirige avant d'afficher la page
  useEffect(() => {
    const username = localStorage.getItem("username");
    const role = localStorage.getItem("role");
    const division = localStorage.getItem("division");

    if (username && role) {
      const redirectPath =
        role === "admin"
          ? "/utilisateurs"
          : division === "Pension"
          ? "/pension"
          : division === "Solde"
          ? "/solde"
          : "/utilisateurs";

      navigate(redirectPath, { replace: true });
    } else {
      setCheckingAuth(false); // ✅ seulement si pas connecté
    }
  }, [navigate]);

  const handleLogin = async (values) => {
    const { username, password } = values;
    setLoading(true);
    setError(null);

    try {
      // ✅ Authentification admin locale
      if (username === "Admin" && password === "admin") {
        localStorage.setItem("username", username);
        localStorage.setItem("role", "admin");
        message.success("Connexion réussie !");
        navigate("/utilisateurs", { replace: true });
        return;
      }

      // ✅ Authentification via API
      const response = await fetch(`http://192.168.88.28:8087/utilisateur/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || "Échec de la connexion");
      }

      const data = await response.json();
      const { user } = data;

      if (!user) throw new Error("Données utilisateur manquantes");

      // ✅ Stockage des infos
      localStorage.setItem("username", user.username);
      localStorage.setItem("division", user.division);
      localStorage.setItem("role", "user");

      // ✅ Redirection selon division
      const redirectPath =
        user.division === "Pension"
          ? "/pension"
          : user.division === "Solde"
          ? "/solde"
          : "/utilisateurs";

      message.success("Connexion réussie !");
      navigate(redirectPath, { replace: true });
    } catch (error) {
      console.error("Erreur de login:", error);
      const errorMessage =
        error.message.includes("Failed to fetch")
          ? "Erreur de connexion au serveur"
          : error.message || "Nom d'utilisateur ou mot de passe incorrect";

      setError(errorMessage);
      form.setFields([{ name: "password", errors: [errorMessage] }]);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Si on vérifie encore l'authentification → afficher juste un spinner
  if (checkingAuth) {
    return (
      <div
        style={{
          height: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Spin size="large" tip="Vérification de la session..." />
      </div>
    );
  }

  return (
    <div
      className="login-wrapper"
      style={{
        backgroundImage: `url(${background})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="login-box">
        <div className="login-left">
          <img src={loginImage} alt="login" className="login-image" />
        </div>
        <div className="login-right">
          <Spin spinning={loading} size="large" tip="Connexion en cours...">
            <Form
              form={form}
              onFinish={handleLogin}
              className="login-form"
              layout="vertical"
              initialValues={{ remember: true }}
            >
              <h2 style={{ textAlign: "center", marginBottom: 24 }}>
                Connexion
              </h2>

              {error && (
                <Alert
                  message={error}
                  type="error"
                  showIcon
                  closable
                  onClose={() => setError(null)}
                  style={{ marginBottom: 24 }}
                />
              )}

              <Form.Item
                name="username"
                rules={[
                  {
                    required: true,
                    message: "Veuillez saisir votre nom d'utilisateur",
                  },
                  {
                    min: 3,
                    message:
                      "Le nom d'utilisateur doit contenir au moins 3 caractères",
                  },
                ]}
              >
                <Input
                  prefix={<UserOutlined />}
                  placeholder="Nom d'utilisateur"
                  size="large"
                  autoFocus
                />
              </Form.Item>

              <Form.Item
                name="password"
                rules={[
                  {
                    required: true,
                    message: "Veuillez saisir votre mot de passe",
                  },
                  {
                    min: 4,
                    message:
                      "Le mot de passe doit contenir au moins 4 caractères",
                  },
                ]}
              >
                <Input.Password
                  prefix={<LockOutlined />}
                  placeholder="Mot de passe"
                  size="large"
                />
              </Form.Item>

              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  block
                  size="large"
                  loading={loading}
                >
                  Se connecter
                </Button>
              </Form.Item>

              <div style={{ textAlign: "center" }}>
                <Link to="/registre">Créer un compte</Link>
                <span style={{ margin: "0 8px" }}>|</span>
                <Link to="/motdepasse">Mot de passe oublié ?</Link>
              </div>
            </Form>
          </Spin>
        </div>
      </div>
    </div>
  );
}
