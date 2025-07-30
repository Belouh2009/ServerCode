import React from "react";
import { Link } from "react-router-dom";

const Unauthorized = () => {
  return (
    <div style={{ textAlign: "center", marginTop: 60 }}>
      <h2>⛔ Accès refusé</h2>
      <p>Vous n’avez pas l’autorisation d’accéder à cette page.</p>
      <Link to="/login">Retour à la connexion</Link>
    </div>
  );
};

export default Unauthorized;
