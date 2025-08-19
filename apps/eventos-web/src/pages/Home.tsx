import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export default function Home() {
  const { user } = useAuth();

  return (
    <section>
      <h1>Home</h1>
      {user ? (
        <p>Logado como <strong>{user.email}</strong>. Vá para o <Link to="/dashboard">Dashboard</Link>.</p>
      ) : (
        <p>Você não está logado. <Link to="/login">Entrar</Link></p>
      )}
    </section>
  );
}
