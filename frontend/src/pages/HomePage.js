import "./HomePage.css"
import { Link } from "react-router-dom"

function Dashboard() {
    return (
        <main>
            <h1>Bienvenido al dashboard</h1>
            <Link to="/login">Iniciar Sesión</Link>
            <Link to="/register">Registrarse</Link>
            <Link to="/dashboard">Dashboard</Link>
        </main>
    )
}
export default Dashboard