import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Form, Input, Button, Alert, Spin, message } from "antd";
import { LockOutlined, UserOutlined } from "@ant-design/icons";
import loginImage from "../image/login2.jpg";
import background from "../image/bureau3.jpg";
import userIcon from "../image/user.jpg";
import "./style.css";

export default function Login() {
  const [loading, setLoading] = useState(false);
  const [messageError, setMessageError] = useState(null);
  const navigate = useNavigate();

  // ➤ Redirection immédiate si déjà connecté
  useEffect(() => {
    const username = localStorage.getItem("username");
    const role = localStorage.getItem("role");
    const division = localStorage.getItem("division");

    if (username && role) {
      if (role === "admin") {
        navigate("/utilisateurs", { replace: true });
      } else if (division === "Pension") {
        navigate("/pension", { replace: true });
      } else if (division === "Solde") {
        navigate("/solde", { replace: true });
      } else {
        navigate("/utilisateurs", { replace: true });
      }
    }
  }, [navigate]);

  const handleLogin = async (values) => {
    const { username, password } = values;

    setLoading(true);
    setMessageError(null);

    if (username === "Admin" && password === "admin") {
      localStorage.setItem("username", username);
      localStorage.setItem("role", "admin");
      window.dispatchEvent(new Event("storage"));
      message.success("Connexion réussie !");
      navigate("/utilisateurs", { replace: true });
      return;
    }

    try {
      const response = await fetch(`http://192.168.88.28:8087/utilisateur/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) throw new Error("Échec de la connexion");

      const data = await response.json();
      const { message: msg, user } = data;

      if (msg === "Connexion réussie") {
        localStorage.setItem("username", user.username);
        localStorage.setItem("division", user.division);
        localStorage.setItem("role", "user");

        message.success(msg);
        if (user.division === "Pension") {
          navigate("/pension", { replace: true });
          return;
        } else if (user.division === "Solde") {
          navigate("/solde", { replace: true });
          return;
        } else {
          navigate("/utilisateurs", { replace: true });
          return;
        }
      } else {
        setMessageError("Nom d'utilisateur ou mot de passe incorrect");
      }
    } catch (error) {
      setMessageError("Nom d'utilisateur ou mot de passe incorrect");
    }
  };

  return (
    <div
      className="login-wrapper"
      style={{
        backgroundImage: `url(${background})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div className="login-box">
        <div className="login-left">
          <img src={loginImage} alt="login" className="login-image" />
        </div>
        <div className="login-right">
          <Spin spinning={loading} size="large">
            <Form
              onFinish={handleLogin}
              className="login-form"
              layout="vertical"
            >
              <div style={{ textAlign: "center", marginBottom: 50 }}>
                <img
                  src={userIcon}
                  alt="User icon"
                  style={{
                    width: 80,
                    height: 80,
                    borderRadius: "50%",
                    boxShadow: "0 0 10px rgba(0, 0, 0, 0.2)",
                  }}
                />
              </div>

              {messageError && (
                <Alert
                  message={messageError}
                  type="error"
                  closable
                  onClose={() => setMessageError(null)}
                  style={{ marginBottom: 16 }}
                />
              )}

              <Form.Item
                name="username"
                rules={[
                  {
                    required: true,
                    message: "Veuillez entrer votre nom d'utilisateur !",
                  },
                ]}
              >
                <Input
                  prefix={<UserOutlined />}
                  placeholder="Nom d'utilisateur"
                  size="large"
                />
              </Form.Item>

              <Form.Item
                name="password"
                rules={[
                  {
                    required: true,
                    message: "Veuillez entrer votre mot de passe !",
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
                <Button type="primary" htmlType="submit" block size="large">
                  Se connecter
                </Button>
              </Form.Item>

              <div style={{ textAlign: "center" }}>
                <Link to="/registre">Créer un compte</Link> |
                <Link to="/motdepasse" style={{ marginLeft: 5 }}>
                  Mot de passe oublié ?
                </Link>
              </div>
            </Form>
          </Spin>
        </div>
      </div>
    </div>
  );
}
