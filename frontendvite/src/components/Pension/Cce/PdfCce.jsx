import React from "react";
import { Page, Text, View, Document, StyleSheet, Image, pdf } from "@react-pdf/renderer";
import { IoPrint } from "react-icons/io5";
import { Button } from "antd";
import logo from '../../image/icon.jpg';
import Swal from "sweetalert2";

const styles = StyleSheet.create({
    page: {
        paddingTop: 30,
        paddingBottom: 50,
        paddingLeft: 50,
        paddingRight: 50,
        fontSize: 12,
        fontFamily: "Helvetica",
    },
    section: { marginBottom: 15 },
    title: {
        fontSize: 11,
        textAlign: "center",
        marginBottom: 10,
        fontWeight: "bold",
        color: "#000",
        lineHeight: 1.5,
    },
    subtitle: {
        fontSize: 12,
        textAlign: "center",
        marginBottom: 20,
        fontWeight: "bold",
        color: "#333",
        textTransform: "uppercase",
        lineHeight: 1.5,
    },
    paragraph: {
        marginBottom: 10,
        textIndent: 20,
        lineHeight: 1.25,
    },
    detailsTitle: {
        fontSize: 14,
        fontWeight: "bold",
        marginBottom: 5,
    },
    detailsText: {
        fontSize: 12,
        marginBottom: 5,
        marginLeft: 30,
    },
    footer: {
        fontSize: 12,
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

const CertificatPDF = ({ dataList }) => {

    return (
        <Document>
            {dataList.map((data, i) => {
                const annee = data?.date_creation ? new Date(data.date_creation).getFullYear() : "N/A";
                const dateActuelle = new Date().toLocaleDateString("fr-FR");

                return (
                    <Page size="A4" style={styles.page}>
                        <View style={styles.logoContainer}>
                            <Image src={logo} style={styles.logo} />
                        </View>

                        <View>
                            <Text style={styles.title}>
                                MINISTERE DE L'ECONOMIE ET DE FINANCE,
                                {"\n"}SECRETARIAT GENERAL,
                                {"\n"}DIRECTION GENERALE DU BUDGET ET DES FINANCES,
                                {"\n"}DIRECTION DE LA SOLDE ET DE PENSIONS,
                                {"\n"}SERVICE REGIONAL DE LA SOLDE ET DE LA PENSIONS
                                {"\n"}HAUTE MATSIATRA
                            </Text>

                            <Text style={styles.subtitle}>
                                CERTIFICAT ADMINISTRATIF DE LA PENSION
                                {"\n"}N° {data.id_certificat || "N/A"}/MEF/SG/DGBF/SRSP.HM/CA.P
                            </Text>
                        </View>

                        <View style={styles.section}>
                            <Text style={styles.paragraph}>
                                Le Chef du SERVICE REGIONAL DE LA SOLDE ET DES PENSIONS HAUTE MATSIATRA soussigné, certifie
                                que {data.civilite} {data.nom} {data.prenom} est titulaire de la Pension n° {data.numPension},
                                servie par la {data.caisse}, assignée payable à {data.assignation}, est décédé le {data.dateDece},
                                pour l'année {annee} comme suit :
                            </Text>
                        </View>

                        <View style={styles.section}>
                            <Text style={styles.detailsTitle}>Détails Financiers :</Text>
                            {data?.sesituer?.map((cce, index) => (
                                <View key={index}>
                                    <Text style={styles.detailsText}>
                                        - {cce?.rubrique?.id_rubrique} ({cce?.rubrique?.libelle}) :
                                        {typeof cce.montant === 'number' ? cce.montant.toLocaleString("fr-FR").replace(/\s/g, ".") : "N/A"} Ariary
                                    </Text>
                                </View>
                            ))}
                        </View>

                        <Text style={styles.paragraph}>
                            En foi de quoi, la présente attestation lui est délivrée pour servir et valoir ce que de droit.
                        </Text>

                        <Text style={styles.footer}>
                            Fianarantsoa, le {dateActuelle}
                        </Text>
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
const OpenPDFButtonCce = ({ data, label = "PDF" }) => {
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
        <Button
            style={{ marginLeft: "10px" }}
            type="default"
            icon={<IoPrint />}
            onClick={handleGenerate}
        >
            {label}
        </Button>
    );
};

export default OpenPDFButtonCce;
