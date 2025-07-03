import React, { useState } from "react";
import {
  Form,
  Input,
  Select,
  Button,
  Checkbox,
  Row,
  Col,
  Alert,
  Spin,
} from "antd";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { EyeInvisibleOutlined, EyeTwoTone } from "@ant-design/icons";
/* import defaultAvatar from "../../assets/image/user.jpg"; */
import "../../index.css";

const { Option } = Select;

const Register = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const [messageError, setMessageError] = useState(null);
  /* const [imageFile, setImageFile] = useState(null);
  const fileInputRef = React.useRef(); */

  /*  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
    }
  };

  const handleImageClick = () => {
    fileInputRef.current.click();
  }; */

  const handleSubmit = async (values) => {
    setLoading(true);
    try {
      const response = await fetch(
        "http://localhost:8087/utilisateur/register",
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
            /*  if (imageFile) {
        formData.append("image", imageFile);
      } */
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
        }).then(() => {
          navigate("/login");
        });

        form.resetFields();
      } else {
        setMessageError(result);
      }
    } catch (error) {
      console.error("Erreur lors de l'inscription :", error);
      setMessageError("Une erreur est survenue. Veuillez réessayer plus tard.");
    }
    setLoading(false);
  };

  return (
    <div
      className="login-container"
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
      }}
    >
      <Spin spinning={loading} size="large">
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          className="register-form"
          style={{
            maxWidth: 500,
            padding: 24,
            background: "#fff",
            borderRadius: 8,
            boxShadow: "0px 0px 10px rgba(0,0,0,0.1)",
          }}
        >
          <h2 style={{ textAlign: "center", marginBottom: 20 }}>
            Créer un compte
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

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="nom"
                label="Nom"
                rules={[
                  { required: true, message: "Veuillez entrer votre nom" },
                ]}
              >
                <Input placeholder="Votre nom" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="prenom"
                label="Prénom"
                rules={[
                  { required: true, message: "Veuillez entrer votre prénom" },
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
                  {
                    required: true,
                    message: "Veuillez entrer votre matricule",
                  },
                ]}
              >
                <Input placeholder="Votre matricule" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="utilisateur"
                label="Nom d'utilisateur"
                rules={[
                  {
                    required: true,
                    message: "Veuillez entrer un nom d'utilisateur",
                  },
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
                rules={[
                  { required: true, message: "Veuillez choisir une division" },
                ]}
              >
                <Select>
                  <Option value="Solde">Solde</Option>
                  <Option value="Pension">Pension</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="region"
                label="Région"
                rules={[
                  { required: true, message: "Veuillez choisir une région" },
                ]}
              >
                <Select>
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
                  { required: true, message: "Veuillez entrer votre email" },
                  { type: "email", message: "Email invalide" },
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
                    message: "Veuillez entrer un mot de passe",
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
            <Button type="primary" htmlType="submit" loading={loading} block>
              Créer un compte
            </Button>
          </Form.Item>

          <div style={{ textAlign: "center" }}>
            <Link to="/login">Déjà un compte ? Connectez-vous !</Link>
          </div>
        </Form>
      </Spin>
    </div>
  );
};

export default Register;
