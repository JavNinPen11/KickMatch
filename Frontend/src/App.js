import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import LoginPage from "./pages/LoginPage"
import RegisterPage from "./pages/RegisterPage";
import HomePage from "./pages/HomePage";
import { DashboardPage } from "./pages/DashboardPage";
import MatchesPage from "./pages/MatchesPage";
import { AuthProvider } from "./context/authContext";
import PrivateRoute from "./components/authComponent/privateRoute";
import "./app.css"
import ProfilePage from "./pages/ProfilePage";
import PanelAdmin from "./pages/PanelAdmin"


//panel admin sin proteger
function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/matches" element={<PrivateRoute><MatchesPage /></PrivateRoute>}/>
          <Route path="/profile" element={<PrivateRoute><ProfilePage /></PrivateRoute>}/>
          <Route path="/admin" element={<PanelAdmin />} />
          <Route path="/dashboard" element={<PrivateRoute><DashboardPage /></PrivateRoute>}
           />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
