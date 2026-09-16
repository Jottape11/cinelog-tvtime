import { Link } from "react-router";
import { getImageUrl } from "../../services/tmdb";
import { IconStar, IconCheck } from "../Icons";
import "./MovieCard.css";

export default function MovieCard({
  filme,
  assistido = false,
  notaUsuario = 0,
  onToggleAssistido,
}) {
  const ano = filme.release_date ? filme.release_date.split("-")[0] : "2025";
  const mediaTmdb = filme.vote_average ? filme.vote_average.toFixed(1) : "8.0";

  // Formatar duracao se existir runtime em minutos
  const duracaoFormatada = filme.runtime
    ? `${Math.floor(filme.runtime / 60)}h ${filme.runtime % 60}m`
    : "2h 10m";

  // Primeiro provedor principal para tag no poster
  const primeiroProvider =
    filme.providers && filme.providers.length > 0
      ? filme.providers[0].nome
      : "Streaming";

  function handleQuickSeen(e) {
    e.preventDefault();
    e.stopPropagation();
    if (onToggleAssistido) {
      onToggleAssistido(filme);
    }
  }

  return (
    <div className={`cinelog-card ${assistido ? "is-watched" : ""}`}>
      <Link to={`/filme/${filme.id}`} className="card-poster-link">
        <div className="card-poster-wrapper">
          <img
            src={getImageUrl(filme.poster_path)}
            alt={`Pôster de ${filme.title}`}
            loading="lazy"
            onError={(e) => {
              // fallback seguro caso de problema de conexao externa
              e.target.src =
                "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=500&auto=format&fit=crop&q=80";
            }}
          />

          {/* Badge de Nota TMDB superior esquerdo */}
          <div className="poster-score-badge">
            <IconStar size={12} color="#f5c518" filled />
            <span>{mediaTmdb}</span>
          </div>

          {/* Botao de Acao Rapida superior direito */}
          <button
            type="button"
            className={`poster-action-btn ${assistido ? "active" : ""}`}
            onClick={handleQuickSeen}
            title={
              assistido ? "Remover dos assistidos" : "Marcar como já assisti"
            }
          >
            <IconCheck size={14} color={assistido ? "#0c0e11" : "#ffffff"} />
          </button>

          {/* Pílula do Provedor de Streaming inferior */}
          <div className="poster-provider-tag">
            <span className="provider-pill">{primeiroProvider}</span>
          </div>
        </div>
      </Link>

      <div className="card-details-box">
        <Link to={`/filme/${filme.id}`} className="card-title-link">
          <h3 className="card-movie-title" title={filme.title}>
            {filme.title}
          </h3>
        </Link>

        <div className="card-meta-row">
          <span className="card-year-duration">
            {ano} • {duracaoFormatada}
          </span>
          <span className="card-green-stars">
            <IconStar size={11} color="#00e054" filled />{" "}
            {notaUsuario > 0
              ? Number(notaUsuario).toFixed(1)
              : filme.vote_average
                ? (filme.vote_average / 2).toFixed(1)
                : "4.2"}
          </span>
        </div>
      </div>
    </div>
  );
}
