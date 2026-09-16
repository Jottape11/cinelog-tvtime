import { Link } from "react-router";
import { IconFilm } from "../../components/Icons";
import "./NotFound.css";

export default function NotFound() {
  return (
    <div className="not-found-wrapper container-max">
      <div className="not-found-card">
        <div className="not-found-icon-box">
          <IconFilm size={44} color="#e50914" />
        </div>
        <span className="not-found-badge">Erro 404 • Cena Não Encontrada</span>
        <h1 className="not-found-code">404</h1>
        <h2 className="not-found-heading">
          Corta! Essa página não está no roteiro.
        </h2>
        <p className="not-found-desc">
          O link que você tentou acessar não existe, foi movido ou foi cortado
          na edição final do catálogo.
        </p>
        <div className="not-found-actions">
          <Link to="/" className="btn-cinelog-primary">
            Voltar para o Catálogo
          </Link>
          <Link to="/match" className="btn-cinelog-secondary">
            Ir para o CineMatch
          </Link>
        </div>
      </div>
    </div>
  );
}
