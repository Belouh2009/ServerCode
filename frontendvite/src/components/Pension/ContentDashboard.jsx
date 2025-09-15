import React from "react";
import { Layout, Card, Row, Col, Typography, Space } from "antd";
import { motion } from "framer-motion";
import CertificatCountCard from "./Cap/CertificatCapCount";
import CertificatCountCce from "./Cce/CertificatCceCount";

// Configuration des animations pour une réutilisation et une cohérence
const ANIMATION_CONFIG = {
  card: {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.25, 0.1, 0.25, 1.0], // Courbe d'animation plus naturelle
      },
    },
  },
  title: {
    hidden: { opacity: 0, y: -20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        delay: 0.1,
      },
    },
  },
  stagger: {
    visible: {
      transition: {
        staggerChildren: 0.1, // Délai entre les animations des enfants
      },
    },
  },
};

// Styles constants pour une meilleure maintenabilité
const STYLES = {
  content: {
    padding: "24px",
    backgroundColor: "#f8fcff",
    minHeight: "calc(100vh - 90px)", // Prend toute la hauteur disponible
  },
  title: {
    color: "#1e88e5",
    marginBottom: "28px",
    textAlign: "center",
    fontWeight: 600,
  },
  mainCard: {
    borderRadius: "12px",
    overflow: "hidden",
    boxShadow: "0 8px 24px rgba(0, 0, 0, 0.1)",
    border: "none",
  },
  cardHeader: {
    backgroundColor: "linear-gradient(135deg, #e6f7ff 0%, #bae7ff 100%)",
    padding: "16px 24px",
    fontWeight: 600,
    fontSize: "18px",
    border: "none",
  },
};

// Composant principal
const DashboardContent = () => {
  return (
    <Layout.Content className="dashboard-content" style={STYLES.content}>
      <motion.div
        variants={ANIMATION_CONFIG.title}
        initial="hidden"
        animate="visible"
      >
        <Typography.Title level={2} style={STYLES.title}>
          Tableau de bord - Édition CSP
        </Typography.Title>
      </motion.div>

      <Row gutter={[24, 24]} justify="center">
        <Col xs={24} sm={24} md={20} lg={16} xl={14}>
          <motion.div
            variants={ANIMATION_CONFIG.card}
            initial="hidden"
            animate="visible"
          >
            <Card
              title={
                <div style={{ textAlign: "center", width: "100%" }}>
                  Pension
                </div>
              }
              bordered={false}
              style={STYLES.mainCard}
              headStyle={STYLES.cardHeader}
            >
              <motion.div
                variants={ANIMATION_CONFIG.stagger}
                initial="hidden"
                animate="visible"
              >
                <Row gutter={[20, 20]} justify="center">
                  <Col xs={24} sm={12}>
                    <motion.div variants={ANIMATION_CONFIG.card}>
                      <CertificatCountCard />
                    </motion.div>
                  </Col>
                  <Col xs={24} sm={12}>
                    <motion.div variants={ANIMATION_CONFIG.card}>
                      <CertificatCountCce />
                    </motion.div>
                  </Col>
                </Row>
              </motion.div>
            </Card>
          </motion.div>
        </Col>
      </Row>
    </Layout.Content>
  );
};

export default DashboardContent;
