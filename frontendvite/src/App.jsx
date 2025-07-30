import { Routes, Route, Navigate } from "react-router-dom";
import Login from "../src/components/Users/Login";
import AppUsers from "../src/components/Users/AppUsers";
import AppPension from "../src/components/Pension/AppPension";
import AppSolde from "../src/components/Solde/AppSolde";
import Registre from "../src/components/Users/Registre";
import Mdp from "../src/components/Users/MotDePasseO";
import Unauthorized from "./components/Users/Unauthorized";
import ProtectedRoute from "../src/ProtectedRoute";

function App() {
  return (
    <Routes>
      {/* Routes publiques */}
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<Login />} />
      <Route path="/registre" element={<Registre />} />
      <Route path="/motdepasse" element={<Mdp />} />
      <Route path="/unauthorized" element={<Unauthorized />} />

      {/* Routes protégées */}
      <Route
        path="/utilisateurs"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <AppUsers />
          </ProtectedRoute>
        }
      />
      <Route
        path="/pension"
        element={
          <ProtectedRoute allowedRoles={["user"]}>
            <AppPension />
          </ProtectedRoute>
        }
      />
      <Route
        path="/solde"
        element={
          <ProtectedRoute allowedRoles={["user"]}>
            <AppSolde />
          </ProtectedRoute>
        }
      />

      {/* Route par défaut (404) */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

export default App;
