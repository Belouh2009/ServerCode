import React, { useState, useRef } from "react";
import { Form, Input, Select, Button, Alert, Row, Col, Spin } from "antd";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { EyeInvisibleOutlined, EyeTwoTone } from "@ant-design/icons";

import registerImage from "../image/login2.png";
import background from "../image/bureau3.jpg";
import "../Users/style.css";
import userIcon from "../image/user.jpg";

const { Option } = Select;

const Register = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const [messageError, setMessageError] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const fileInputRef = useRef(null);

  const getImageForFormData = () => {
    return selectedImage ? selectedImage : null;
  };

  const handleSubmit = async (values) => {
    setLoading(true);
    setMessageError(null);

    try {
      const formData = new FormData();
      const dataWithoutImage = {
        matricule: values.matricule,
        nom: values.nom,
        prenom: values.prenom,
        password: values.password,
        username: values.username,
        division: values.division,
        region: values.region,
        email: values.email,
        image: selectedImage ? null : "user.jpg",
      };

      // Ajouter JSON dans FormData
      formData.append(
        "data",
        new Blob([JSON.stringify(dataWithoutImage)], {
          type: "application/json",
        })
      );

      // Ajouter fichier image uniquement si présent
      const imageFile = getImageForFormData();
      if (imageFile) {
        formData.append("image", imageFile);
      }

      const response = await fetch(
        "http://192.268.88.58:8087/utilisateur/register",
        {
          method: "POST",
          body: formData,
        }
      );

      const result = await response.text();

      if (response.ok) {
        // Succès
        Swal.fire({
          title: "Inscription réussie 🎉",
          text: "Votre compte a été créé. Veuillez contacter l'administrateur pour l’activer.",
          icon: "success",
          confirmButtonText: "OK",
        }).then(() => navigate("/login"));

        form.resetFields();
        setPreviewImage(null);
        setSelectedImage(null);
      } else {
        // Erreur serveur (doublon ou autre)
        setMessageError(result || "Erreur lors de l'inscription");
      }
    } catch (error) {
      console.error("Erreur inscription :", error);
      setMessageError(
        "Impossible de contacter le serveur. Réessayez plus tard."
      );
    } finally {
      setLoading(false);
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
        <div className="login-left">
          <img
            src={registerImage}
            alt="register illustration"
            className="login-image"
          />
        </div>
        <div className="login-right">
          <Spin spinning={loading} size="large">
            <Form
              layout="vertical"
              form={form}
              onFinish={handleSubmit}
              className="login-form"
            >
              {/* Image preview */}
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  marginBottom: 20,
                  gap: 8,
                }}
              >
                <input
                  type="file"
                  accept="image/*"
                  style={{ display: "none" }}
                  ref={fileInputRef}
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      setPreviewImage(URL.createObjectURL(e.target.files[0]));
                      setSelectedImage(e.target.files[0]);
                    }
                  }}
                />
                <img
                  src={previewImage || userIcon}
                  alt="User icon"
                  style={{
                    width: 80,
                    height: 80,
                    borderRadius: "50%",
                    boxShadow: "0 0 10px rgba(0,0,0,0.2)",
                    objectFit: "cover",
                  }}
                  onError={(e) => {
                    e.currentTarget.src = userIcon;
                  }}
                />
                <Button
                  onClick={() => fileInputRef.current.click()}
                  size="small"
                >
                  Choisir une image
                </Button>
              </div>

              {/* Erreur globale serveur */}
              {messageError && (
                <Alert
                  message={messageError}
                  type="error"
                  showIcon
                  closable
                  onClose={() => setMessageError(null)}
                  style={{ marginBottom: 16 }}
                />
              )}

              {/* Formulaire */}
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    name="nom"
                    label="Nom"
                    rules={[{ required: true, message: "Le nom est requis" }]}
                  >
                    <Input placeholder="Votre nom" />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    name="prenom"
                    label="Prénom"
                    rules={[
                      { required: true, message: "Le prénom est requis" },
                    ]}
                  >
                    <Input placeholder="Votre prénom" />
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    name="matricule"
                    label="Matricule"
                    rules={[
                      { required: true, message: "Le matricule est requis" },
                    ]}
                  >
                    <Input placeholder="Votre matricule" />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    name="username"
                    label="Nom d'utilisateur"
                    rules={[
                      { required: true, message: "Nom d'utilisateur requis" },
                    ]}
                  >
                    <Input placeholder="Nom d'utilisateur" />
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    name="division"
                    label="Division"
                    rules={[{ required: true, message: "Division requise" }]}
                  >
                    <Select placeholder="Choisissez une division">
                      <Option value="Solde">Solde</Option>
                      <Option value="Pension">Pension</Option>
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    name="region"
                    label="Région"
                    rules={[{ required: true, message: "Région requise" }]}
                  >
                    <Select placeholder="Choisissez une région">
                      {[
                        "ANALAMANGA",
                        "CENTRAL",
                        "HAUTE MATSIATRA",
                        "BONGOLAVA",
                        "ITASY",
                        "VAKINANKARATRA",
                        "DIANA",
                        "SAVA",
                        "ATSIMO-ATSINANANA",
                        "AMORON'I MANIA",
                        "IHOROMBE",
                        "VATOVAVY-FITOVINANY",
                        "BOENI",
                        "BETSIBOKA",
                        "MELAKY",
                        "SOFIA",
                        "ATSINANANA",
                        "ANALANJIROFO",
                        "ALAOTRA-MANGORO",
                        "ATSIMO-ANDREFANA",
                        "ANDROY",
                        "MENABE",
                        "ANOSY",
                      ].map((region) => (
                        <Option key={region} value={region}>
                          {region}
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    name="email"
                    label="Email"
                    rules={[
                      {
                        required: true,
                        type: "email",
                        message: "Email invalide",
                      },
                    ]}
                  >
                    <Input placeholder="Votre email" />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    name="password"
                    label="Mot de passe"
                    rules={[
                      {
                        required: true,
                        min: 6,
                        message: "6 caractères minimum",
                      },
                    ]}
                  >
                    <Input.Password
                      placeholder="Mot de passe"
                      iconRender={(visible) =>
                        visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
                      }
                    />
                  </Form.Item>
                </Col>
              </Row>

              <Form.Item>
                <Button type="primary" htmlType="submit" block size="large">
                  Créer un compte
                </Button>
              </Form.Item>

              <div style={{ textAlign: "center" }}>
                <Link to="/login">Déjà un compte ? Connectez-vous !</Link>
              </div>
            </Form>
          </Spin>
        </div>
      </div>
    </div>
  );
};

export default Register;
