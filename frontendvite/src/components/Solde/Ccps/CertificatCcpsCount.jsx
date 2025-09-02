import React, { useEffect, useState } from "react";
import { Card } from "antd";
import { GrCertificate } from "react-icons/gr";

export default function CertificatCountCard() {
  const [certificatCount, setCertificatCount] = useState(0);

  useEffect(() => {
    fetch("http://192.168.88.58:8087/certificatsCcps/count")
      .then((response) => response.json())
      .then((data) => setCertificatCount(data))
      .catch((error) =>
        console.error("Erreur lors de la récupération des certificats :", error)
      );
  }, []);

  return (
    <Card
      hoverable
      style={{
        borderRadius: "16px",
        textAlign: "center",
        boxShadow: "0px 6px 14px rgba(0, 0, 0, 0.05)",
        background: "#f9fafc",
        transition: "all 0.3s ease-in-out",
      }}
    >
      <div style={{ marginBottom: "10px" }}>
        <GrCertificate style={{ fontSize: "36px", color: "#52c41a" }} />
      </div>
      <h3 style={{ marginBottom: "5px", color: "#333" }}>CCP.S</h3>
      <p
        style={{
          fontSize: "28px",
          fontWeight: "bold",
          margin: 0,
          color: "#52c41a",
        }}
      >
        {certificatCount}
      </p>
    </Card>
  );
}
