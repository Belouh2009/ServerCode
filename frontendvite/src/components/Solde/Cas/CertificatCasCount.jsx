import React, { useEffect, useState } from "react";
import { Card } from "antd";
import { GrCertificate } from "react-icons/gr";

export default function CertificatCountCard() {
    const [certificatCount, setCertificatCount] = useState(0);

    useEffect(() => {
        fetch("http://localhost:8087/certificatsCas/count")
            .then(response => response.json())
            .then(data => setCertificatCount(data))
            .catch(error => console.error("Erreur lors de la récupération des certificats :", error));
    }, []);

    return (
        <Card
            style={{ borderRadius: "12px", textAlign: "center" }}
            hoverable
        >
            <GrCertificate style={{ fontSize: "32px", color: "#1268da" }} />
            <h3>CA.S</h3>
            <p style={{ fontSize: "24px", fontWeight: "bold" }}>{certificatCount}</p>
        </Card>
    );
}
