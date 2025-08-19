import React from "react";
import axios from "axios";
import {
  Page,
  Text,
  View,
  Document,
  StyleSheet,
  Image,
  pdf,
} from "@react-pdf/renderer";
import { IoPrint } from "react-icons/io5";
import { Button, Tooltip, message } from "antd";
import logo from "../../image/icon.jpg";
import Swal from "sweetalert2";

const styles = StyleSheet.create({
  page: {
    paddingTop: 30,
    paddingBottom: 50,
    paddingLeft: 50,
    paddingRight: 50,
    fontSize: 12,
    fontFamily: "Times-Roman",
  },
  section: { marginBottom: 5 },
  title: {
    fontSize: 9,
    textAlign: "center",
    marginBottom: 10,
    fontWeight: "bold",
    color: "#000",
    lineHeight: 1.5,
  },
  subtitle: {
    fontSize: 10,
    textAlign: "center",
    marginBottom: 20,
    fontWeight: "bold",
    color: "#333",
    textTransform: "uppercase",
    lineHeight: 1.5,
  },
  paragraph: {
    marginBottom: 10,
    fontSize: 10,
    textIndent: 20,
    lineHeight: 1.25,
  },
  detailsTitle: {
    textAlign: "center",
    fontSize: 10,
    fontWeight: "bold",
    marginBottom: 5,
  },
  footer: {
    fontSize: 10,
    textAlign: "right",
    marginTop: 20,
    marginRight: 50,
  },
  logoContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  logo: {
    width: 100,
    height: "auto",
  },
});

const formatDate = (dateString) =>
  new Date(dateString).toLocaleDateString("fr-FR");

const CertificatPage = ({ data }) => {
  const dateActuelle = formatDate(new Date());

  return (
    <Page size="A4" style={styles.page}>
      <View style={styles.logoContainer}>
        <Image src={logo} style={styles.logo} />
      </View>

      <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
        <View style={{ flex: 1 }}>
          <Text style={styles.title}>
            MINISTERE DE L'ECONOMIE ET DE FINANCE
            {"\n"}SECRETARIAT GENERAL
            {"\n"}DIRECTION GENERALE DU BUDGET ET DES FINANCES
            {"\n"}DIRECTION DE LA SOLDE ET DE PENSIONS
            {"\n"}SERVICE REGIONAL DE LA SOLDE ET DE LA PENSIONS
            {"\n"}HAUTE MATSIATRA
          </Text>
        </View>

        <View style={{ flex: 1, textAlign: "right" }}>
          <Text style={styles.subtitle}>CERTIFICAT ADMINISTRATIF</Text>
        </View>
      </View>

      <View>
        <Text style={styles.detailsTitle}>
          {"\n"}N° {data.idCertificat || "N/A"}/MEF/SG/DGBF/SRSP.HM/CA.S
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.paragraph}>
          L'ORDINATEUR SECONDAIRE DE LA SOLDE soussigné, certifie qu'aucun
          mandantement de rappel n'a été effectué au profit de {data.nom}{" "}
          {data.prenom} IM : {data.matricule} Chapitre : {data.chapitre} en
          service à {data.localite} sur la période du :{" "}
          {formatDate(data.dateDebut)} au {formatDate(data.dateFin)},
          conformément à {data.referenceActe} du {formatDate(data.dateActe)}.
        </Text>
      </View>

      <Text style={styles.paragraph}>
        En foi de quoi, le présent Certificat est délivré pour servir et valoir
        ce que de droit.
        {"\n"}Corps : {data.corps}, Libellé : {data.libelleCorps}
        {"\n"}Grade : {data.grade}
        {"\n"}Indice : {data.indice}
      </Text>

      <Text style={styles.footer}>Fianarantsoa, le {dateActuelle}</Text>
    </Page>
  );
};

const CertificatPDF = ({ dataList }) => (
  <Document>
    {dataList.map((data, i) => (
      <CertificatPage key={i} data={data} />
    ))}
  </Document>
);

const fetchLibelleCorps = async (corps) => {
  try {
    const res = await axios.get(`http://192.168.88.28:8087/corps/libelle/${corps}`);
    return res.data || "Non disponible";
  } catch (err) {
    console.error("Erreur récupération libellé :", err);
    return "Non disponible";
  }
};

const OpenPDFButton = ({ data, label = "Imprimer", onBeforePrint }) => {
  const [messageApi, contextHolder] = message.useMessage();
  const [loading, setLoading] = React.useState(false);

  const generateAndOpenPDF = async (dataList) => {
    try {
      setLoading(true);

      // Appel de la fonction avant impression si elle existe
      if (onBeforePrint) {
        await onBeforePrint();
      }

      const blob = await pdf(<CertificatPDF dataList={dataList} />).toBlob();
      const url = URL.createObjectURL(blob);
      window.open(url, "_blank");

    } catch (error) {
      console.error("Erreur lors de la génération du PDF:", error);
      messageApi.error("Erreur lors de l'impression");
    } finally {
      setLoading(false);
    }
  };

  const handleGenerate = () => {
    if (!data || (Array.isArray(data) && data.length === 0)) {
      messageApi.warning("Veuillez sélectionner au moins un certificat");
      return;
    }

    const dataList = Array.isArray(data) ? data : [data];
    generateAndOpenPDF(dataList);
  };

  return (
    <>
      {contextHolder}
      <Tooltip title="Imprimer ce certificat">
        <Button
          style={{ marginLeft: "10px" }}
          type="default"
          icon={<IoPrint />}
          onClick={handleGenerate}
          loading={loading}
        >
          {label}
        </Button>
      </Tooltip>
    </>
  );
};

export default OpenPDFButton;
