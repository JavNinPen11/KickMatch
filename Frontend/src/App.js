import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import LoginPage from "./pages/LoginPage"
import RegisterPage from "./pages/RegisterPage"
import HomePage from "./pages/HomePage"
import { DashboardPage } from "./pages/DashboardPage"
import MatchesPage from "./pages/MatchesPage"
import { AuthProvider } from "./context/authContext"
import PrivateRoute from "./components/authComponent/PrivateRoute"
import "./App.css"
import ProfilePage from "./pages/ProfilePage"
import PanelAdmin from "./pages/panelAdmin"
import AdminRoute from "./components/authComponent/AdminRoute"
import ReservePage from "./pages/ReservePage"
import PanelFields from "./pages/PanelFields"
import { Footer } from "./components/forms/Footer"
import AboutPage from "./pages/AboutPage"
import { ScrollToTop } from "./components/scrollTop/ScrollTop"


function App() {
  return (
    <AuthProvider>
      <Router>
        <ScrollToTop/>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/matches" element={<PrivateRoute><MatchesPage /></PrivateRoute>} />
          <Route path="/profile" element={<PrivateRoute><ProfilePage /></PrivateRoute>} />
          <Route path="/admin" element={
            <PrivateRoute>
              <AdminRoute>
                <PanelAdmin />
              </AdminRoute>
            </PrivateRoute>
          } />
          <Route path="/reservas"element={<PrivateRoute><ReservePage /></PrivateRoute>}/>
          <Route path="/dashboard" element={<PrivateRoute><DashboardPage /></PrivateRoute>} />
          <Route path="/admin/fields" element={
            <PrivateRoute>
              <AdminRoute>
                <PanelFields />
              </AdminRoute>
            </PrivateRoute>  
          } />
          <Route path="/about" element={<AboutPage />} />
        </Routes>
        <Footer/>
      </Router>
    </AuthProvider>
    
  );
}

export default App;
