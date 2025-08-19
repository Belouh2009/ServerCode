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
import { Button, Tooltip } from "antd";
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
    marginBottom: 5,
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
  section: {
    marginVertical: 10,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 2,
  },
  label: {
    flex: 2,
    fontSize: 10,
  },
  value: {
    flex: 1,
    fontSize: 10,
    textAlign: "right",
  },
});

const CertificatPDF = ({ dataList }) => {
  return (
    <Document>
      {dataList.map((data, i) => {
        const renderRecetteText = () => {
          const hasAllData =
            data.montant &&
            data.dateDebut &&
            data.dateDernierPai &&
            data.referenceRecette &&
            data.dateOrdreRecette;

          if (!hasAllData) {
            return "Aucun ordre de recette n'a été émis à l'encontre de l'agent.";
          }

          return `Un ordre de recette ${
            data.montant
          } AR représentant solde et accessoires indument perçues du ${formatDate(
            data.dateDebut
          )} au ${formatDate(
            data.dateDernierPai
          )} est émis à l'encontre de l'intéressé(e) sous N° ${
            data.referenceRecette
          } du ${formatDate(data.dateOrdreRecette)}`;
        };

        // Récupérer l'année de la date de création
        const annee = data?.date_creation
          ? new Date(data.date_creation).getFullYear()
          : "N/A";

        // Date actuelle
        const dateActuelle = new Date().toLocaleDateString("fr-FR");

        const formatDate = (dateString) => {
          return new Date(dateString).toLocaleDateString("fr-FR");
        };

        return (
          <Page size="A4" style={styles.page}>
            <View style={styles.logoContainer}>
              <Image src={logo} style={styles.logo} />
            </View>

            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
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
                <Text style={styles.subtitle}>
                  CERTIFICAT DE CESSATION DE PAIEMENT
                </Text>
              </View>
            </View>

            <View>
              <Text style={styles.detailsTitle}>
                {"\n"}N° {data.idCertificat || "N/A"}/MEF/SG/DGBF/SRSP.HM/CCP.S
              </Text>
            </View>
            <View style={styles.section}>
              <Text style={styles.paragraph}>
                Le Chef du SERVICE REGIONAL DE LA SOLDE ET DES PENSIONS HAUTE
                MATSIATRA soussigné, certifie que {data.civilite} {data.nom}{" "}
                {data.prenom} IM : {data.matricule} Corps : {data.corps} Grade :{" "}
                {data.grade}
                {"\n"}
                Actuellement {data.cessationService} suivant :{" "}
                {data.referenceActe} du {formatDate(data.dateActe)}
                {"\n"}A cessé ses activités pour compter du :{" "}
                {formatDate(data.dateCessation)}
                {"\n"}A été payé jusqu'au : {formatDate(data.dateFinPai)}
                {"\n"}
                Sur chapitre : {data.chapitre} Article : {data.article} du
                BUDGET GENERAL, et sur les bases suivantes :{"\n"}
                Indice : {data.indice} Zone : {data.zone} Enfants :{" "}
                {data.enfant}
              </Text>
            </View>

            <View style={styles.section}>
              {data?.sesituer?.map((ccps, index) => (
                <View key={index} style={styles.row}>
                  <Text style={styles.label}>{ccps?.rubrique?.libelle}</Text>
                  <Text style={styles.value}>
                    {ccps?.rubrique?.id_rubrique} ={" "}
                    {typeof ccps.montant === "number"
                      ? ccps.montant.toLocaleString("fr-FR").replace(/\s/g, ".")
                      : "N/A"}{" "}
                    Ar
                  </Text>
                </View>
              ))}
            </View>
            <Text style={styles.paragraph}>{renderRecetteText()}</Text>

            <Text style={styles.footer}>Fianarantsoa, le {dateActuelle}</Text>
          </Page>
        );
      })}
    </Document>
  );
};

// ✅ Fonction pour générer et ouvrir le PDF immédiatement
const generateAndOpenPDF = async (dataList) => {
  const blob = await pdf(<CertificatPDF dataList={dataList} />).toBlob();
  const url = URL.createObjectURL(blob);
  window.open(url, "_blank");
};

// ✅ Bouton de génération et ouverture automatique du PDF
const OpenPDFButtonCcps = ({ data, label = "PDF" }) => {
  const handleGenerate = () => {
    if (!data || data.length === 0) {
      Swal.fire({
        icon: "warning",
        title: "Aucune sélection",
        text: "Veuillez sélectionner au moins un certificat avant d’imprimer.",
      });
      return;
    }

    const dataList = Array.isArray(data) ? data : [data];
    generateAndOpenPDF(dataList);
  };

  return (
    <Tooltip title="Imprimer cette ccertificat">
      {" "}
      <Button
        style={{ marginLeft: "10px" }}
        type="default"
        icon={<IoPrint />}
        onClick={handleGenerate}
      >
        {label}
      </Button>
    </Tooltip>
  );
};

export default OpenPDFButtonCcps;
