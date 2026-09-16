import { useState } from "react";
import { getImageUrl } from "../../services/tmdb";
import { IconClose, IconHeart, IconStar } from "../Icons";
import "./CineMatchCard.css";

export default function CineMatchCard({ filme, onLike, onDislike }) {
  const [animacao, setAnimacao] = useState(null); // 'like' | 'dislike' | null

  function handleAction(tipo) {
    setAnimacao(tipo);
    setTimeout(() => {
      if (tipo === "like") {
        onLike(filme);
      } else {
        onDislike(filme);
      }
      setAnimacao(null);
    }, 300);
  }

  const ano = filme.release_date ? filme.release_date.split("-")[0] : "";

  return (
    <div
      className={`cinematch-card-wrapper ${animacao ? `anim-${animacao}` : ""}`}
    >
      <div className="cinematch-card">
        <div className="cinematch-image">
          <img src={getImageUrl(filme.poster_path)} alt={filme.title} />
          {filme.vote_average && (
            <div className="cinematch-rating">
              <IconStar size={14} filled />
              <span>{filme.vote_average.toFixed(1)}</span>
            </div>
          )}
        </div>

        <div className="cinematch-body">
          <div className="cinematch-header">
            <h2 className="cinematch-title">{filme.title}</h2>
            {ano && <span className="cinematch-year">{ano}</span>}
          </div>

          <p className="cinematch-overview">
            {filme.overview || "Sem sinopse disponível em português."}
          </p>

          <div className="cinematch-actions">
            <button
              type="button"
              className="match-btn btn-dislike"
              onClick={() => handleAction("dislike")}
              title="Pular filme (Não curti)"
            >
              <IconClose size={24} color="#ef4444" />
              <span>Pular</span>
            </button>

            <button
              type="button"
              className="match-btn btn-like"
              onClick={() => handleAction("like")}
              title="Dar Match! Salvar em Quero Assistir"
            >
              <IconHeart size={24} color="#ffffff" filled />
              <span>Quero Assistir</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
