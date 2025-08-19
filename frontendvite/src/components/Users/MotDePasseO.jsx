import React, { useState } from "react";
import { Form, Input, Button, Alert, Spin } from "antd";
import {
  LockOutlined,
  UserOutlined,
  KeyOutlined,
  EyeInvisibleOutlined,
  EyeTwoTone,
} from "@ant-design/icons";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import axios from "axios";

import background from "../image/bureau3.jpg"; // même fond que login/register
import registerImage from "../image/login2.jpg"; // image à gauche
import "../Users/style.css";

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [messageError, setMessageError] = useState(null);
  const [messageSuccess, setMessageSuccess] = useState(null);
  const [userData, setUserData] = useState({});

  const handleFetchUser = async (matricule) => {
    try {
      const response = await axios.get(
        `http://192.168.88.28:8087/utilisateur/${matricule}`
      );
      setUserData(response.data);
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Utilisateur introuvable",
        text: "Aucun utilisateur trouvé avec ce matricule.",
      });
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
          icon: "warning",
          title: "Erreur",
          text: "Les mots de passe ne correspondent pas !",
        });
        return;
      }

      const response = await axios.put(
        "http://192.168.88.28:8087/utilisateur/update",
        {
          matricule: values.matricule,
          username: values.username,
          password: values.newPassword,
          nom: userData.nom || "",
          prenom: userData.prenom || "",
          division: userData.division || "",
          region: userData.region || "",
        }
      );

      setLoading(false);
      if (response.status === 200) {
        Swal.fire({
          icon: "success",
          title: "Succès",
          text: "Votre mot de passe a été mis à jour avec succès !",
        }).then(() => navigate("/login"));
      }
    } catch (error) {
      setLoading(false);
      Swal.fire({
        icon: "error",
        title: "Erreur",
        text: "Échec de la mise à jour. Vérifiez vos informations.",
      });
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
      <div className="registre-box">
        {/* Partie gauche avec l'image */}
        <div className="login-left">
          <img src={registerImage} alt="illustration" className="login-image" />
        </div>

        {/* Partie droite avec le formulaire */}
        <div className="login-right">
          <Spin spinning={loading} size="large">
            <Form
              onFinish={handleForgotPassword}
              className="login-form"
              layout="vertical"
              onValuesChange={(changedValues) => {
                if (
                  changedValues.matricule &&
                  changedValues.matricule.length > 3
                ) {
                  handleFetchUser(changedValues.matricule);
                }
              }}
            >
              <h2 style={{ textAlign: "center", marginBottom: 20 }}>
                Réinitialisation du mot de passe
              </h2>

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

              <Form.Item
                name="matricule"
                label="Matricule"
                rules={[
                  {
                    required: true,
                    message: "Veuillez entrer votre matricule !",
                  },
                ]}
              >
                <Input prefix={<KeyOutlined />} placeholder="Matricule" />
              </Form.Item>

              <Form.Item
                name="username"
                label="Nom d'utilisateur"
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
                />
              </Form.Item>

              <Form.Item
                name="newPassword"
                label="Nouveau mot de passe"
                rules={[
                  {
                    required: true,
                    message: "Veuillez entrer un nouveau mot de passe !",
                  },
                ]}
              >
                <Input.Password
                  prefix={<LockOutlined />}
                  placeholder="Nouveau mot de passe"
                  iconRender={(visible) =>
                    visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
                  }
                />
              </Form.Item>

              <Form.Item
                name="confirmPassword"
                label="Confirmer le mot de passe"
                rules={[
                  {
                    required: true,
                    message: "Veuillez confirmer votre mot de passe !",
                  },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (!value || getFieldValue("newPassword") === value) {
                        return Promise.resolve();
                      }
                      return Promise.reject(
                        new Error("Les mots de passe ne correspondent pas !")
                      );
                    },
                  }),
                ]}
              >
                <Input.Password
                  prefix={<LockOutlined />}
                  placeholder="Confirmer le mot de passe"
                  iconRender={(visible) =>
                    visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
                  }
                />
              </Form.Item>

              <Form.Item>
                <Button type="primary" htmlType="submit" block size="large">
                  Réinitialiser le mot de passe
                </Button>
              </Form.Item>

              <div style={{ textAlign: "center" }}>
                <Link to="/login">Retour à la connexion</Link>
              </div>
            </Form>
          </Spin>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
