import React from "react";
import { Layout, Card, Row, Col } from "antd";
import { motion } from "framer-motion";
import { UserOutlined, ShoppingCartOutlined } from "@ant-design/icons";
import CertificatCasCount from "./Cas/CertificatCasCount"
import CertificatCcpsCount from "./Ccps/CertificatCcpsCount"

const { Content } = Layout;

const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export default function ContentDashboard({ darkTheme }) {
    return (
        <Content style={{ marginLeft: "10px", marginTop: "10px", padding: "24px", background: darkTheme ? "#001529" : "#fff", color: darkTheme ? "#ffffff" : "#000000", borderRadius: "10px 0 0 0", minHeight: "280px" }}>
            <Row gutter={[16, 16]} justify="center"> {/* Row pour aligner les cartes côte à côte */}

                {/* Première Card */}
                <Col xs={24} sm={18} md={12} lg={12}>
                    <motion.div variants={cardVariants} initial="hidden" animate="visible">
                        <Card
                            title="Solde"
                            bordered={false}
                            style={{ borderRadius: "12px", textAlign: "center", boxShadow: "0px 4px 10px rgba(0,0,0,0.1)" }}
                        >
                            <Row gutter={[16, 16]} justify="center">
                                <Col xs={24} sm={12}>
                                    <CertificatCasCount />
                                </Col>


                                <Col xs={24} sm={12}>
                                    <CertificatCcpsCount />
                                </Col>
                            </Row>
                        </Card>
                    </motion.div>
                </Col>

            </Row>
        </Content>
    );
}
