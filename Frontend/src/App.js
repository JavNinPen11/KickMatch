import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import LoginPage from "./pages/loginPage"
import RegisterPage from "./pages/registerPage";
import HomePage from "./pages/homePage";
import { DashboardPage } from "./pages/dashboardPage";
import MatchesPage from "./pages/matchesPage";
import { AuthProvider } from "./context/authContext";
import PrivateRoute from "./components/authComponent/privateRoute";
import "./app.css"
import ProfilePage from "./pages/profilePage";
import PanelAdmin from "./pages/panelAdmin"


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
