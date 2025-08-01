import React from "react";
import { Layout, Card, Row, Col, Typography } from "antd";
import { motion } from "framer-motion";
import CertificatCountCard from "./Cap/CertificatCapCount";
import CertificatCountCce from "./Cce/CertificatCceCount";

const { Content } = Layout;
const { Title } = Typography;

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export default function ContentDashboard() {
  return (
    <Content
      style={{
        margin: "10px",
        padding: "24px",
        background: "#ffffff",
        color: "#000000",
        borderRadius: "12px",
        minHeight: "280px",
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.05)",
      }}
    >
      <Title
        level={2}
        style={{
          color: "#1e88e5",
          marginBottom: "20px",
        }}
      >
        Tableau de bord - Edition CSP
      </Title>

      <Row gutter={[24, 24]} justify="center">
        <Col xs={24} sm={24} md={20} lg={16}>
          <motion.div
            variants={cardVariants}
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
              style={{
                borderRadius: "16px",
                textAlign: "center",
                boxShadow: "0px 6px 18px rgba(0, 0, 0, 0.08)",
              }}
              headStyle={{
                backgroundColor: "#e6f7ff",
                borderRadius: "16px 16px 0 0",
                fontWeight: "bold",
                fontSize: "18px",
              }}
            >
              <Row gutter={[16, 16]} justify="center">
                <Col xs={24} sm={12}>
                  <CertificatCountCard />
                </Col>
                <Col xs={24} sm={12}>
                  <CertificatCountCce />
                </Col>
              </Row>
            </Card>
          </motion.div>
        </Col>
      </Row>
    </Content>
  );
}
