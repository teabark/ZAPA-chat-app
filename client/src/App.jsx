import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Authentication/Login"
import Dashboard from "./pages/Dashboard/Dashboard"
import { AuthProvider } from "./contexts/AuthContext";
import Verified from "./pages/VerificationPage/Verified";

export default function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Login />} />
<Route path="/dashboard/*" element={<Dashboard />} />
          <Route path="/verify" element={<Verified />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}
