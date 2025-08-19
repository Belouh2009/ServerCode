import React, { useState, useEffect } from "react";
import { Modal, Form, Input, Button } from "antd";
import Swal from "sweetalert2";
import axios from "axios";

const ModalModifCorps = ({ open, onClose, corps, onSuccess }) => {
  const [id, setId] = useState(null);
  const [corpsCode, setCorpsCode] = useState("");
  const [libelleCorps, setLibelleCorps] = useState("");
  const [categorie, setCategorie] = useState("");
  const [grade, setGrade] = useState("");
  const [indice, setIndice] = useState(null);

  useEffect(() => {
    if (open && corps) {
      setId(corps.id || null);
      setCorpsCode(corps.corps || "");
      setLibelleCorps(corps.libelleCorps || "");
      setCategorie(corps.categorie || "");
      setGrade(corps.grade || "");
      setIndice(corps.indice ?? null);
    }
  }, [open, corps]);

  const handleSubmit = async () => {
    if (id === null) {
      Swal.fire("Erreur", "ID invalide", "error");
      return;
    }

    const updatedCorpsData = {
      corps: corpsCode,
      libelleCorps,
      categorie,
      grade,
      indice,
    };

    try {
      const response = await axios.put(
        `http://192.168.88.28:8087/corps/modifier/${id}`, // id numérique dans l'URL
        updatedCorpsData,
        { headers: { "Content-Type": "application/json" } }
      );

      if (response.status === 200) {
        Swal.fire("Succès", "Modification réussie !", "success");
        onClose();
        if (onSuccess) onSuccess();
      } else {
        Swal.fire(
          "Erreur",
          "Une erreur est survenue, veuillez réessayer.",
          "error"
        );
      }
    } catch (error) {
      const message =
        error?.response?.data?.message || error.message || "Erreur inconnue";
      Swal.fire("Erreur", `Impossible de mettre à jour : ${message}`, "error");
    }
  };

  return (
    <Modal
      title="Modifier Code Corps"
      centered
      open={open}
      onCancel={onClose}
      width={500}
      footer={null}
      className="custom-modal"
    >
      <Form layout="vertical" onFinish={handleSubmit}>
        <Form.Item
          label="Code"
          rules={[{ required: true, message: "Veuillez entrer le code." }]}
        >
          <Input
            disabled= {true}
            style={{color: "#000000"}}
            value={corpsCode}
            onChange={(e) => setCorpsCode(e.target.value)}
          />
        </Form.Item>

        <Form.Item label="Libelle">
          <Input
            value={libelleCorps}
            onChange={(e) => setLibelleCorps(e.target.value)}
          />
        </Form.Item>

        <Form.Item label="Categorie">
          <Input
            value={categorie}
            onChange={(e) => setCategorie(e.target.value)}
          />
        </Form.Item>

        <Form.Item label="Grade">
          <Input value={grade} onChange={(e) => setGrade(e.target.value)} />
        </Form.Item>

        <Form.Item label="Indice">
          <Input
            type="number"
            value={indice ?? ""}
            onChange={(e) =>
              setIndice(e.target.value ? parseInt(e.target.value, 10) : null)
            }
          />
        </Form.Item>

        <div style={{ textAlign: "center", marginTop: 20 }}>
          <Button type="primary" htmlType="submit">
            Enregistrer les modifications
          </Button>
        </div>
      </Form>
    </Modal>
  );
};

export default ModalModifCorps;
