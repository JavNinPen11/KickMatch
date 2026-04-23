import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import LoginPage from "./pages/LoginPage"
import RegisterPage from "./pages/RegisterPage";
import HomePage from "./pages/HomePage";
import { DashboardPage } from "./pages/DashboardPage";
import MatchesPage from "./pages/MatchesPage";
import MatchDetailPage from "./pages/MatchDetailPage";
import { AuthProvider } from "./context/authContext";
import PrivateRoute from "./components/authComponent/PrivateRoute";
import "./App.css"
import ProfilePage from "./pages/ProfilePage";

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
          <Route path="/matches/:matchId" element={<MatchDetailPage />} />
          <Route path="/dashboard" element={<PrivateRoute><DashboardPage /></PrivateRoute>} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
