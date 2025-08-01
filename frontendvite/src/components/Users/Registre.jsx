import React, { useState } from "react";
import { Form, Input, Select, Button, Alert, Row, Col, Spin } from "antd";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { EyeInvisibleOutlined, EyeTwoTone } from "@ant-design/icons";

import registerImage from "../image/login2.jpg";
import background from "../image/bureau3.jpg"; 
import "../Users/style.css"; 
import userIcon from "../image/user.jpg";

const { Option } = Select;

const Register = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const [messageError, setMessageError] = useState(null);

  const handleSubmit = async (values) => {
    setLoading(true);
    try {
      const response = await fetch(
        "http://192.168.88.53:8087/utilisateur/register",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            matricule: values.matricule,
            nom: values.nom,
            prenom: values.prenom,
            password: values.password,
            username: values.utilisateur,
            division: values.division,
            region: values.region,
            email: values.email,
            validation: "Non Valide",
          }),
        }
      );

      const result = await response.text();

      if (response.ok) {
        Swal.fire({
          title: "Inscription réussie!",
          text: "Votre compte a été créé avec succès. Veuillez contacter l'administrateur pour activer votre compte.",
          icon: "success",
          confirmButtonText: "OK",
        }).then(() => navigate("/login"));

        form.resetFields();
      } else {
        setMessageError(result);
      }
    } catch (error) {
      setMessageError("Une erreur est survenue. Veuillez réessayer plus tard.");
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
              <div style={{ textAlign: "center", marginBottom: 20 }}>
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

              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    name="nom"
                    label="Nom"
                    rules={[{ required: true }]}
                  >
                    <Input placeholder="Votre nom" />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    name="prenom"
                    label="Prénom"
                    rules={[{ required: true }]}
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
                    rules={[{ required: true }]}
                  >
                    <Input placeholder="Votre matricule" />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    name="utilisateur"
                    label="Nom d'utilisateur"
                    rules={[{ required: true }]}
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
                    rules={[{ required: true }]}
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
                    rules={[{ required: true }]}
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
                    rules={[{ required: true, type: "email" }]}
                  >
                    <Input placeholder="Votre email" />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    name="password"
                    label="Mot de passe"
                    rules={[{ required: true }]}
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
