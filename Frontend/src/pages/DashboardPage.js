import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Nav } from "../components/nav/Nav";
import { AuthContext } from "../context/authContext";
import {
  getMeRequest,
  updateMeRequest,
  deleteMeRequest,
} from "../api/userService";

export const DashboardPage = () => {
  const { user, login, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const [profile, setProfile] = useState(null);
  const [message, setMessage] = useState("");
  const [form, setForm] = useState({
    email: "",
    username: "",
    nombre: "",
    password: "",
  });

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const res = await getMeRequest(user.token);
        setProfile(res.data);
        setForm({
          email: res.data.email || "",
          username: res.data.username || "",
          nombre: res.data.nombre || "",
          password: "",
        });
      } catch (error) {
        setMessage(error.message);
      }
    };

    if (user?.token) {
      loadProfile();
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  const handleUpdate = async (e) => {
    e.preventDefault();

    try {
      const payload = {};
      if (form.email.trim()) payload.email = form.email.trim();
      if (form.username.trim()) payload.username = form.username.trim();
      if (form.nombre.trim()) payload.nombre = form.nombre.trim();
      if (form.password.trim()) payload.password = form.password.trim();

      const res = await updateMeRequest(user.token, payload);

      setProfile(res.data);
      setMessage(res.message);

      // Actualiza usuario guardado en AuthContext/localStorage
      login(
        {
          ...user,
          username: res.data.username,
          email: res.data.email,
          nombre: res.data.nombre,
        },
        user.token
      );

      setForm((prev) => ({ ...prev, password: "" }));
    } catch (error) {
      setMessage(error.message);
    }
  };

  const handleDelete = async () => {
    const confirmDelete = window.confirm(
      "¿Seguro que quieres eliminar tu cuenta?"
    );
    if (!confirmDelete) return;

    try {
      const res = await deleteMeRequest(user.token);
      setMessage(res.message);
      logout();
      navigate("/");
    } catch (error) {
      setMessage(error.message);
    }
  }

  return (
    <main>
      <Nav />
      <h1>Mi perfil</h1>

      {message && <p>{message}</p>}

      {profile && (
        <section>
          <p>ID: {profile.id}</p>
          <p>Username: {profile.username}</p>
          <p>Email: {profile.email}</p>
          <p>Nombre: {profile.nombre}</p>
          <p>Rol: {profile.rol || "sin rol"}</p>
        </section>
      )}

      <section>
        <h2>Editar perfil</h2>
        <form onSubmit={handleUpdate}>
          <input
            name="email"
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
          />
          <input
            name="username"
            type="text"
            placeholder="Username"
            value={form.username}
            onChange={handleChange}
          />
          <input
            name="nombre"
            type="text"
            placeholder="Nombre"
            value={form.nombre}
            onChange={handleChange}
          />
          <input
            name="password"
            type="password"
            placeholder="Nueva contraseña"
            value={form.password}
            onChange={handleChange}
          />
          <button type="submit">Guardar cambios</button>
        </form>
      </section>

      <section>
        <h2>Eliminar cuenta</h2>
        <button onClick={handleDelete}>Eliminar mi cuenta</button>
      </section>
    </main>
  );
}
