import React from "react";
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

// Styles optimisés
const styles = StyleSheet.create({
  page: {
    padding: "30pt 50pt",
    fontSize: 12,
    fontFamily: "Times-Roman",
    lineHeight: 1.5,
  },
  section: { 
    marginBottom: 10,
  },
  header: {
    marginBottom: 20,
    textAlign: "center",
  },
  title: {
    fontSize: 10,
    fontWeight: "bold",
    color: "#000",
  },
  subtitle: {
    fontSize: 10,
    fontWeight: "bold",
    color: "#333",
    textTransform: "uppercase",
    marginTop: 10,
  },
  paragraph: {
    marginBottom: 10,
    textIndent: 20,
    fontSize: 10,
  },
  detailsText: {
    fontSize: 10,
    marginLeft: 30,
    marginBottom: 5,
  },
  footer: {
    fontSize: 10,
    textAlign: "right",
    marginTop: 20,
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

// Fonction de formatage de date sécurisée
const formatDate = (dateString) => {
  if (!dateString) return "N/A";
  try {
    const date = new Date(dateString);
    return isNaN(date) ? "N/A" : date.toLocaleDateString("fr-FR");
  } catch {
    return "N/A";
  }
};

// Composant PDF principal
const CertificatPDF = ({ dataList }) => {
  const currentDate = new Date().toLocaleDateString("fr-FR", {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });

  return (
    <Document>
      {dataList.map((data, index) => {
        const year = data?.date_creation 
          ? new Date(data.date_creation).getFullYear() 
          : "N/A";

        return (
          <Page key={`page-${index}`} size="A4" style={styles.page}>
            <View style={styles.logoContainer}>
              <Image src={logo} style={styles.logo} />
            </View>

            <View style={styles.header}>
              <Text style={styles.title}>
                MINISTERE DE L'ECONOMIE ET DE FINANCE{"\n"}
                SECRETARIAT GENERAL{"\n"}
                DIRECTION GENERALE DU BUDGET ET DES FINANCES{"\n"}
                DIRECTION DE LA SOLDE ET DE PENSIONS{"\n"}
                SERVICE REGIONAL DE LA SOLDE ET DE LA PENSIONS{"\n"}
                HAUTE MATSIATRA
              </Text>

              <Text style={styles.subtitle}>
                CERTIFICAT ADMINISTRATIF DE LA PENSION{"\n"}
                N° {data.id_certificat || "N/A"}/MEF/SG/DGBF/SRSP.HM/CCE
              </Text>
            </View>

            <View style={styles.section}>
              <Text style={styles.paragraph}>
                Le Chef du SERVICE REGIONAL DE LA SOLDE ET DES PENSIONS HAUTE
                MATSIATRA soussigné, certifie que {data.civilite || ""} {data.nom || ""}{" "}
                {data.prenom || ""} est titulaire de la Pension n° {data.num_pension || "N/A"},
                servie par la {data.caisse || "N/A"}, assignée payable à{" "}
                {data.assignation || "N/A"}, est décédé le {formatDate(data.dateDece)},
                pour l'année {year} comme suit :
              </Text>
            </View>

            <View style={styles.section}>
              {data?.sesituer?.map((cce, idx) => (
                <Text key={`cce-${idx}`} style={styles.detailsText}>
                  - {cce?.rubrique?.id_rubrique || "N/A"} ({cce?.rubrique?.libelle || "N/A"}):{" "}
                  {typeof cce.montant === "number"
                    ? cce.montant.toLocaleString("fr-FR").replace(/\s/g, ".")
                    : "N/A"}{" "}
                  Ariary
                </Text>
              ))}
            </View>

            <Text style={styles.paragraph}>
              En foi de quoi, la présente attestation lui est délivrée pour
              servir et valoir ce que de droit.
            </Text>

            <Text style={styles.footer}>Fianarantsoa, le {currentDate}</Text>
          </Page>
        );
      })}
    </Document>
  );
};

// Composant bouton PDF optimisé
const OpenPDFButtonCce = ({ data, label = "PDF", onBeforePrint }) => {
  const [loading, setLoading] = React.useState(false);
  const [messageApi, contextHolder] = message.useMessage();

  const generateAndOpenPDF = async (dataList) => {
    try {
      setLoading(true);
      
      if (onBeforePrint) {
        await onBeforePrint();
      }

      const blob = await pdf(<CertificatPDF dataList={dataList} />).toBlob();
      const url = URL.createObjectURL(blob);
      
      const newWindow = window.open(url, "_blank");
      if (!newWindow) {
        messageApi.warning("Veuillez autoriser les popups pour afficher le PDF");
      }
    } catch (error) {
      console.error("Erreur PDF:", error);
      messageApi.error("Erreur lors de la génération du PDF");
    } finally {
      setLoading(false);
    }
  };

  const handleGenerate = () => {
    if (!data || (Array.isArray(data) && data.length === 0)) {
      Swal.fire({
        icon: "warning",
        title: "Aucune sélection",
        text: "Veuillez sélectionner au moins un certificat avant d'imprimer.",
      });
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
          style={{ marginLeft: 10 }}
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

export default OpenPDFButtonCce;