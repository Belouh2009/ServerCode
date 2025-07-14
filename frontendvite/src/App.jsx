import { Routes, Route, Navigate } from "react-router-dom";
import Login from "../src/components/Users/Login";
import AppUsers from "../src/components/Users/AppUsers";
import AppPension from "../src/components/Pension/AppPension"
import AppSolde from "../src/components/Solde/AppSolde";
import Registre from "../src/components/Users/Registre";
import background from "../src/components/image/bureau3.jpg";
import Mdp from "../src/components/Users/MotDePasseO";

function App() {
  const isAuthenticated = localStorage.getItem("username"); // Vérifier si l'utilisateur est connecté

  return (
    <div
     /*  style={{
        backgroundImage: `url(${background})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        height: "100vh",
        width: "100vw",
      }} */
    >
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/registre" element={<Registre />} />
        <Route path="/motdepasse" element={<Mdp />} />
        <Route path="/utilisateurs" element={<AppUsers />} />
        <Route path="/pension" element={<AppPension />} />
        <Route path="/solde" element={<AppSolde />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </div>
  );
}

export default App;
