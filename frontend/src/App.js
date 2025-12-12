import {BrowserRouter as Router, Routes, Route} from "react-router-dom" 
import LoginPage from "./pages/LoginPage"
import RegisterPage from "./pages/RegisterPage";
import DashboardPage from "./pages/DashboardPage";


function App() {
  return (
    
    <Router>
      <Routes>
        <Route path="/" element={<DashboardPage/>} />
        <Route path="/register" element={<RegisterPage/>}/>
        <Route path="/login" element={<LoginPage />} />

      </Routes>
    </Router>
  );
}

export default App;
